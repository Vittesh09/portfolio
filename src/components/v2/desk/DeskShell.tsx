'use client';

import { motion, useAnimate, useReducedMotion, type Transition } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { DeskFooterMeta } from '@/src/components/v2/desk/DeskFooterMeta';
import { DeskSmoothScroll } from '@/src/components/v2/desk/DeskSmoothScroll';
import { useV2Theme } from '@/src/components/v2/layout/ThemeProvider';
import '@/src/styles/desk.css';

const TABS = [
  {
    href: '/desk',
    label: 'Home',
    match: (path: string) => path === '/desk' || path === '/desk/'
  },
  {
    href: '/desk/about',
    label: 'About',
    match: (path: string) => path.startsWith('/desk/about')
  }
] as const;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

const LAND_HIDDEN = { opacity: 0, y: 14, filter: 'blur(8px)' };
const LAND_SHOWN = { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } };
const land = (delay: number, duration = 0.9): Transition => ({ duration, delay, ease: EASE_OUT });

function normalizePath(path: string) {
  return path.endsWith('/') ? path : `${path}/`;
}

function isDeskPath(path: string) {
  const p = normalizePath(path);
  return p === '/desk/' || p.startsWith('/desk/');
}

/**
 * Persistent desk chrome (mounted once by the desk layout). Nav + footer stay
 * put; only the page between them fades out/in on desk-to-desk navigation.
 */
export function DeskShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/desk';
  const router = useRouter();
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [pageScope, animatePage] = useAnimate<HTMLDivElement>();
  const navigating = useRef(false);
  const mounted = useRef(false);
  const fallbackTimer = useRef<number | undefined>(undefined);
  const { setThemePreference } = useV2Theme();
  const hideNav = pathname.startsWith('/desk/blog');

  useEffect(() => {
    setThemePreference('light');
  }, [setThemePreference]);

  useLayoutEffect(() => {
    if (hideNav) {
      document.documentElement.style.setProperty('--desk-nav-bottom', '0px');
      return () => {
        document.documentElement.style.removeProperty('--desk-nav-bottom');
      };
    }

    const nav = navRef.current;
    if (!nav) return;
    const sync = () => {
      document.documentElement.style.setProperty(
        '--desk-nav-bottom',
        `${Math.ceil(nav.getBoundingClientRect().bottom)}px`
      );
    };
    sync();
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('resize', sync);
      document.documentElement.style.removeProperty('--desk-nav-bottom');
    };
  }, [hideNav]);

  // Desk → desk links: fade the page out, then navigate. Capture phase so
  // Next's <Link> handler never runs a second navigation.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest('a');
      if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) {
        return;
      }
      // Work rail marks the click that ends a drag; let the rail swallow it.
      if (anchor.closest('[data-suppress-click="1"]')) return;
      let next: URL;
      try {
        next = new URL(anchor.href);
      } catch {
        return;
      }
      if (next.origin !== window.location.origin || !isDeskPath(next.pathname)) return;

      event.preventDefault();
      event.stopPropagation();
      if (navigating.current) return;
      if (normalizePath(next.pathname) === normalizePath(window.location.pathname)) return;

      const href = `${next.pathname}${next.search}${next.hash}`;
      navigating.current = true;
      // Navigate in parallel with the fade so a slow route never leaves a blank page;
      // if the route still hasn't committed, fall back to a hard load.
      router.push(href);
      window.clearTimeout(fallbackTimer.current);
      fallbackTimer.current = window.setTimeout(() => {
        if (navigating.current) window.location.assign(href);
      }, 4000);
      const page = pageScope.current;
      if (reduce || !page) return;
      void animatePage(
        page,
        { opacity: 0, y: -8, filter: 'blur(6px)' },
        { duration: 0.24, ease: EASE_IN }
      );
    };

    root.addEventListener('click', onClick, true);
    return () => root.removeEventListener('click', onClick, true);
  }, [animatePage, pageScope, reduce, router]);

  // New route committed (scroll already reset by DeskSmoothScroll): fade in.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    navigating.current = false;
    window.clearTimeout(fallbackTimer.current);
    const page = pageScope.current;
    if (!page) return;
    if (reduce) {
      void animatePage(page, { opacity: 1, y: 0, filter: 'blur(0px)' }, { duration: 0 });
      return;
    }
    // Picks up from wherever the fade-out got to, so fast routes don't flash.
    void animatePage(
      page,
      { opacity: 1, y: 0, filter: 'blur(0px)' },
      { duration: 0.55, ease: EASE_OUT }
    ).then(() => {
      page.style.filter = 'none';
    });
  }, [pathname, animatePage, pageScope, reduce]);

  const landInitial = reduce ? false : LAND_HIDDEN;

  return (
    <div ref={rootRef} className={`desk-root${hideNav ? ' desk-root--no-nav' : ''}`}>
      {hideNav ? null : (
        <motion.nav
          ref={navRef}
          className="desk-nav"
          aria-label="Desk"
          initial={reduce ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={land(0.05, 0.75)}
        >
          <div className="desk-nav-pill">
            {TABS.map((tab) => {
              const current = tab.match(pathname);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="desk-nav-link"
                  aria-current={current ? 'page' : undefined}
                >
                  {current && !reduce ? (
                    <motion.span
                      className="desk-nav-current"
                      layoutId="desk-nav-current"
                      transition={{ type: 'spring', bounce: 0, visualDuration: 0.35 }}
                    />
                  ) : null}
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
      <div className="desk-edge desk-edge--bottom" aria-hidden="true" />
      <DeskSmoothScroll resetKey={pathname}>
        <motion.div
          className="desk-viewport"
          initial={landInitial}
          animate={LAND_SHOWN}
          transition={land(0.15)}
        >
          <div ref={pageScope} className="desk-page">
            {children}
          </div>
        </motion.div>
        <motion.footer
          className="desk-foot"
          initial={landInitial}
          animate={LAND_SHOWN}
          transition={land(0.35, 0.8)}
        >
          <DeskFooterMeta />
        </motion.footer>
      </DeskSmoothScroll>
    </div>
  );
}
