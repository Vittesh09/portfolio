'use client';

import { motion, useAnimate, useReducedMotion, type Transition } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { DeskFooterMeta } from '@/src/components/v2/desk/DeskFooterMeta';
import { DeskSmoothScroll } from '@/src/components/v2/desk/DeskSmoothScroll';
import { useV2Theme } from '@/src/components/v2/layout/ThemeProvider';
import { isDeskPath, normalizePath } from '@/src/config/v2/routes';
import '@/src/styles/desk.css';

const TABS = [
  {
    href: '/',
    label: 'Home',
    match: (path: string) => path === '/'
  },
  {
    href: '/about/',
    label: 'About',
    match: (path: string) => path.startsWith('/about')
  }
] as const;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

// Opacity + transform only: both stay on the compositor. Animating `filter: blur()`
// over the live WebGL stage re-rasterises it every frame and stutters.
const LAND_HIDDEN = { opacity: 0, y: 12 };
const LAND_SHOWN = { opacity: 1, y: 0 };
const PAGE_OUT = { opacity: 0, y: -6 };
const PAGE_IN = { opacity: 1, y: 0 };
const OUT_TRANSITION: Transition = { duration: 0.22, ease: EASE_IN };
const IN_TRANSITION: Transition = { duration: 0.5, ease: EASE_OUT };
const land = (delay: number, duration = 0.9): Transition => ({ duration, delay, ease: EASE_OUT });


/**
 * Persistent desk chrome (mounted once by the desk layout). Nav + footer stay
 * put; only the page between them fades out/in on desk-to-desk navigation.
 */
export function DeskShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [pageScope, animatePage] = useAnimate<HTMLDivElement>();
  const navigating = useRef(false);
  const mounted = useRef(false);
  const fallbackTimer = useRef<number | undefined>(undefined);
  const { setThemePreference } = useV2Theme();
  const hideNav = pathname.startsWith('/blog');

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

  // Desk → desk links: fade the page out, then navigate, then fade the new page in.
  // Capture phase so Next's <Link> handler never runs a second navigation.
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
      // Warm the route while the old page fades, so it is usually ready by the time
      // we push. Pushing only after the fade means the swap always happens while the
      // page is invisible, never halfway through the fade.
      router.prefetch(href);
      const go = () => {
        router.push(href);
        window.clearTimeout(fallbackTimer.current);
        // If the route still hasn't committed, fall back to a hard load.
        fallbackTimer.current = window.setTimeout(() => {
          if (navigating.current) window.location.assign(href);
        }, 4000);
      };
      const page = pageScope.current;
      if (reduce || !page) {
        go();
        return;
      }
      void animatePage(page, PAGE_OUT, OUT_TRANSITION).then(go, go);
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
      void animatePage(page, PAGE_IN, { duration: 0 });
      return;
    }
    // Back/forward never faded out, so this is a no-op for them.
    void animatePage(page, PAGE_IN, IN_TRANSITION);
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
