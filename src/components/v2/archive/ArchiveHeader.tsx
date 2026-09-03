'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { siteConfig } from '@/src/config/v2/site';
import { ThemeToggle } from '@/src/components/v2/ui/ThemeToggle';
import { HashNavLink } from '@/src/components/v2/ui/HashNavLink';
import { useMobileLanding } from '@/src/components/v2/ui/useMobileLanding';

const navOptionClass =
  'archive-label v2-nav-option group transition-colors hover:text-accent-pop';

/** Hide shortly after scroll activity stops. */
const HIDE_AFTER_MS = 700;
const TOP_STAY_PX = 12;

export function ArchiveHeader() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const isHome = pathname === '/v2' || pathname === '/v2/';
  const isMobile = useMobileLanding();
  const hideTimer = useRef<number | null>(null);
  const lastY = useRef(0);
  const openRef = useRef(open);
  const visibleRef = useRef(visible);
  const spacerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  openRef.current = open;
  visibleRef.current = visible;

  const headerInertProps = !(visible || open) ? ({ inert: true } as const) : {};

  const clearHide = () => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  /** Hide once the user has stopped scrolling (menu open → stay). */
  const scheduleHide = () => {
    clearHide();
    hideTimer.current = window.setTimeout(() => {
      if (openRef.current) return;
      if (window.scrollY <= TOP_STAY_PX) {
        setVisible(true);
        return;
      }
      setVisible(false);
    }, HIDE_AFTER_MS);
  };

  const showWhileScrolling = () => {
    setVisible(true);
    scheduleHide();
  };

  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (!isHome) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash) {
      window.history.replaceState(null, '', '/v2/');
    }
  };

  useEffect(() => {
    setOpen(false);
    setVisible(true);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      clearHide();
      setVisible(true);
      return;
    }
    if (typeof window !== 'undefined' && window.scrollY > TOP_STAY_PX) {
      scheduleHide();
    }
  }, [open]);

  useEffect(() => {
    const header = headerRef.current;
    const spacer = spacerRef.current;
    if (!header || !spacer) return;

    const sync = () => {
      const bar = header.querySelector('.v2-archive-header-bar');
      spacer.style.height = `${(bar as HTMLElement | null)?.offsetHeight ?? header.offsetHeight}px`;
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(header);
    return () => ro.disconnect();
  }, [open, pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    lastY.current = window.scrollY;

    const onScrollActivity = (event?: Event) => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastY.current);
      lastY.current = y;

      if (y <= TOP_STAY_PX) {
        clearHide();
        setVisible(true);
        return;
      }

      const velocity =
        event instanceof CustomEvent
          ? Math.abs(Number(event.detail?.velocity ?? 0))
          : null;

      // Lenis keeps emitting near the end with ~0 velocity — don't treat that as "scrolling"
      const moving =
        delta > 0.75 || (velocity !== null ? velocity > 0.04 : event?.type === 'wheel' || event?.type === 'touchmove');

      if (moving) {
        showWhileScrolling();
        return;
      }

      // Settled after Lenis lerp — ensure hide timer is running
      scheduleHide();
    };

    const onWheel = (event: WheelEvent) => onScrollActivity(event);
    const onTouchMove = (event: TouchEvent) => onScrollActivity(event);
    const onScroll = (event: Event) => onScrollActivity(event);
    const onLenis = (event: Event) => onScrollActivity(event);

    // Peek only when already hidden — never cancel a pending hide forever
    const onPointerMove = (event: PointerEvent) => {
      if (event.clientY > 14) return;
      if (visibleRef.current || openRef.current) return;
      setVisible(true);
      scheduleHide();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('v2-lenis-scroll', onLenis);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    if (window.scrollY > TOP_STAY_PX) scheduleHide();
    else setVisible(true);

    return () => {
      clearHide();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('v2-lenis-scroll', onLenis);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [pathname]);

  return (
    <>
      <div ref={spacerRef} aria-hidden className="v2-archive-header-spacer shrink-0" />
      <header
        ref={headerRef}
        data-hidden={visible || open ? 'false' : 'true'}
        className="v2-archive-header fixed inset-x-0 top-0 z-[110] border-b"
        {...headerInertProps}
      >
        <div className="v2-archive-header-bar mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-8">
          <Link
            href="/v2/"
            onClick={goHome}
            className={`${navOptionClass} font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          >
            Vittesh Sinha®
            <span className="v2-visually-hidden"> — Home</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {siteConfig.nav.map((item) => {
              const isHash = item.href.includes('#');
              const NavTag = isHash ? HashNavLink : Link;
              const isCurrent =
                item.label === 'About'
                  ? Boolean(pathname?.startsWith('/v2/about'))
                  : item.label === 'Home'
                    ? isHome
                    : false;
              return (
                <NavTag
                  key={item.href}
                  href={item.href}
                  onClick={item.href === '/v2/' ? goHome : undefined}
                  className={navOptionClass}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.label}
                </NavTag>
              );
            })}
            <Link
              href="/v2/machine/"
              className={navOptionClass}
              aria-current={pathname?.includes('/machine') ? 'page' : undefined}
            >
              [Machine]
            </Link>
            <ThemeToggle />
          </nav>
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className={`${navOptionClass} min-h-11 border border-border-subtle px-3`}
              aria-expanded={open}
              aria-controls="v2-mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {open ? (
          <nav
            id="v2-mobile-nav"
            className="border-t border-border-subtle px-2 pb-2 md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col">
              {siteConfig.nav.map((item, index) => {
                const isHash = item.href.includes('#');
                const NavTag = isHash ? HashNavLink : Link;
                return (
                  <NavTag
                    key={item.href}
                    href={item.href}
                    onClick={(event) => {
                      if (item.href === '/v2/') {
                        goHome(event);
                        return;
                      }
                      setOpen(false);
                    }}
                    className="v2-nav-mobile-row flex min-h-11 items-baseline justify-between border-b border-border-subtle"
                  >
                    <span className="text-2xl font-semibold tracking-tight">{item.label}</span>
                    <span className="archive-label text-accent-pop" aria-hidden>
                      0{index + 1}
                    </span>
                  </NavTag>
                );
              })}
              <Link
                href="/v2/machine/"
                onClick={() => setOpen(false)}
                className="v2-nav-mobile-row flex min-h-11 w-full border-b border-border-subtle text-left"
              >
                <span className="text-2xl font-semibold tracking-tight">[Machine]</span>
              </Link>
              {isMobile ? (
                <p className="archive-label px-1 py-4 text-text-muted">
                  Open on desktop for a better experience
                </p>
              ) : null}
            </div>
          </nav>
        ) : null}
      </header>
    </>
  );
}
