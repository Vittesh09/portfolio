'use client';

import { motion, useAnimate, useReducedMotion, type Transition } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { DeskBackToTop } from '@/src/components/v2/desk/DeskBackToTop';
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

// First-load entrance (nav, page, footer) is CSS (`.desk-enter` in desk.css): it
// starts at first paint instead of waiting for hydration, so the copy is visible
// (and counted as painted) right away. Route changes below stay on Motion.
// Opacity + transform only: both stay on the compositor. Animating `filter: blur()`
// over the live WebGL stage re-rasterises it every frame and stutters.
const PAGE_OUT = { opacity: 0, y: -6 };
const PAGE_IN = { opacity: 1, y: 0 };
const OUT_TRANSITION: Transition = { duration: 0.14, ease: EASE_IN };
const IN_TRANSITION: Transition = { duration: 0.36, ease: EASE_OUT };


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
  const hideNav = pathname.startsWith('/writing') || pathname.startsWith('/blog');
  // Long reads: a case study or a single post/talk.
  const showToTop = /^\/(work|writing)\/[^/]+\/?$/.test(pathname);
  const [navTucked, setNavTucked] = useState(false);
  const navTuckedRef = useRef(false);

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

  // Tuck the Home/About pill away while scrolling down; bring it back on any scroll up
  // (or near the top). The anchor follows the scroll in the current direction, so a
  // small reversal of TUCK_PX is enough to flip it, however far you scrolled before.
  // The scroller persists across desk routes; a route change resets it to the top,
  // and that scroll event brings the pill back.
  useEffect(() => {
    if (hideNav) return;
    const scroller = rootRef.current?.querySelector<HTMLElement>('.desk-scroll');
    if (!scroller) return;
    const TUCK_PX = 8;
    const TOP_PX = 48;
    let anchor = scroller.scrollTop;
    const set = (next: boolean) => {
      if (next === navTuckedRef.current) return;
      navTuckedRef.current = next;
      setNavTucked(next);
    };
    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      const y = scroller.scrollTop;
      // iOS rubber-band overscroll runs past the ends; it is not a direction change.
      if (y < 0 || y > max) return;
      if (y <= TOP_PX) {
        anchor = y;
        set(false);
        return;
      }
      if (navTuckedRef.current) {
        if (y > anchor) anchor = y;
        else if (anchor - y >= TUCK_PX) {
          anchor = y;
          set(false);
        }
      } else if (y < anchor) {
        anchor = y;
      } else if (y - anchor >= TUCK_PX) {
        anchor = y;
        set(true);
      }
    };
    onScroll();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [hideNav]);

  // Desk → desk links: navigate at once while the page dips out, then fade the new
  // page in. router.push is a transition, so the old page stays on screen until the
  // new one is ready; nothing waits on the fade.
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
      const page = pageScope.current;
      if (!reduce && page) void animatePage(page, PAGE_OUT, OUT_TRANSITION);
      router.push(href);
      window.clearTimeout(fallbackTimer.current);
      // If the route still hasn't committed, fall back to a hard load.
      fallbackTimer.current = window.setTimeout(() => {
        if (navigating.current) window.location.assign(href);
      }, 4000);
    };

    // Warm desk routes on hover/press so the push above commits without a fetch.
    const prefetched = new Set<string>();
    const warm = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest('a');
      if (!anchor) return;
      let next: URL;
      try {
        next = new URL(anchor.href);
      } catch {
        return;
      }
      if (next.origin !== window.location.origin || !isDeskPath(next.pathname)) return;
      const path = normalizePath(next.pathname);
      if (prefetched.has(path)) return;
      prefetched.add(path);
      router.prefetch(`${next.pathname}${next.search}`);
    };

    root.addEventListener('pointerover', warm, { passive: true });
    root.addEventListener('pointerdown', warm, { passive: true, capture: true });
    root.addEventListener('click', onClick, true);
    return () => {
      root.removeEventListener('click', onClick, true);
      root.removeEventListener('pointerover', warm);
      root.removeEventListener('pointerdown', warm, true);
    };
  }, [animatePage, pageScope, reduce, router]);

  // New route committed. Layout effect, so a page we navigated to starts invisible
  // before its first paint (the scroll reset in DeskSmoothScroll lands under it),
  // then fades up. Back/forward never dipped out, so they just settle in place.
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const fromClick = navigating.current;
    navigating.current = false;
    window.clearTimeout(fallbackTimer.current);
    const page = pageScope.current;
    if (!page) return;
    if (reduce) {
      void animatePage(page, PAGE_IN, { duration: 0 });
      return;
    }
    if (fromClick) {
      page.style.setProperty('opacity', '0');
      page.style.setProperty('transform', 'translateY(6px)');
      void animatePage(page, { opacity: [0, 1], y: [6, 0] }, IN_TRANSITION);
      return;
    }
    void animatePage(page, PAGE_IN, IN_TRANSITION);
  }, [pathname, animatePage, pageScope, reduce]);

  return (
    <div ref={rootRef} className={`desk-root${hideNav ? ' desk-root--no-nav' : ''}`}>
      {hideNav ? null : (
        <nav
          ref={navRef}
          className="desk-nav desk-enter desk-enter--nav"
          aria-label="Desk"
          data-tucked={navTucked ? 'true' : undefined}
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
        </nav>
      )}
      <div className="desk-edge desk-edge--bottom" aria-hidden="true" />
      <DeskSmoothScroll resetKey={pathname}>
        <div className="desk-viewport desk-enter desk-enter--page">
          <div ref={pageScope} className="desk-page">
            {children}
          </div>
        </div>
        <footer className="desk-foot desk-enter desk-enter--foot">
          <DeskFooterMeta />
        </footer>
        {showToTop ? <DeskBackToTop key={pathname} /> : null}
      </DeskSmoothScroll>
    </div>
  );
}
