'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { siteConfig } from '@/src/config/v2/site';
import { profile } from '@/src/config/v2/profile';
import { ThemeToggle } from '@/src/components/v2/ui/ThemeToggle';
import { HashNavLink } from '@/src/components/v2/ui/HashNavLink';
import { useMobileLanding } from '@/src/components/v2/ui/useMobileLanding';

const navOptionClass =
  'archive-label v2-nav-option group transition-colors hover:text-accent-pop';

/** Stay on screen at the top of the page. Hide only while scrolling down. */
const TOP_STAY_PX = 12;
const PEEK_PX = 80;

export function ArchiveHeader() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const isHome = pathname === '/v2' || pathname === '/v2/';
  const isMobile = useMobileLanding();
  const lastY = useRef(0);
  const openRef = useRef(open);
  const visibleRef = useRef(visible);
  const spacerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  openRef.current = open;
  visibleRef.current = visible;

  const headerInertProps = !(visible || open) ? ({ inert: true } as const) : {};

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
      setVisible(true);
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
      const goingDown = y > lastY.current + 2;
      const goingUp = y < lastY.current - 2;
      lastY.current = y;

      if (openRef.current || y <= TOP_STAY_PX) {
        setVisible(true);
        return;
      }

      const velocity =
        event instanceof CustomEvent
          ? Math.abs(Number(event.detail?.velocity ?? 0))
          : null;

      const moving =
        goingDown ||
        goingUp ||
        (velocity !== null ? velocity > 0.04 : false);

      if (!moving) return;
      if (goingDown) setVisible(false);
      else setVisible(true);
    };

    const onWheel = (event: WheelEvent) => onScrollActivity(event);
    const onTouchMove = (event: TouchEvent) => onScrollActivity(event);
    const onScroll = (event: Event) => onScrollActivity(event);
    const onLenis = (event: Event) => onScrollActivity(event);

    const onPointerMove = (event: PointerEvent) => {
      if (event.clientY > PEEK_PX) return;
      setVisible(true);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('v2-lenis-scroll', onLenis);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    setVisible(window.scrollY <= TOP_STAY_PX || visibleRef.current);

    return () => {
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
            className={`${navOptionClass} v2-archive-wordmark font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
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
              href={profile.agentNav.href}
              className={navOptionClass}
              title={profile.agentNav.title}
              aria-label={profile.agentNav.title}
              aria-current={pathname?.includes('/machine') ? 'page' : undefined}
            >
              {profile.agentNav.label}
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
                href={profile.agentNav.href}
                onClick={() => setOpen(false)}
                title={profile.agentNav.title}
                aria-label={profile.agentNav.title}
                className="v2-nav-mobile-row flex min-h-11 w-full border-b border-border-subtle text-left"
              >
                <span className="text-2xl font-semibold tracking-tight">{profile.agentNav.label}</span>
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
