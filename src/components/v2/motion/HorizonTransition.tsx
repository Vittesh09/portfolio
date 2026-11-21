'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from 'react';
import { isDeskPath, normalizePath } from '@/src/config/v2/routes';

type Phase = 'idle' | 'cover' | 'swap' | 'reveal';
type Wipe = 'disc' | 'blur';

function routeLabel(path: string) {
  const p = normalizePath(path).replace(/^\/v2(?=\/)/, '') || '/';
  if (p === '/') return 'Home';
  if (p.startsWith('/about')) return 'About';
  if (p.startsWith('/tldr')) return 'TL;DR';
  if (p.startsWith('/work/')) return 'Work';
  if (p.startsWith('/machine')) return 'Machine';
  if (p.startsWith('/classic/workbench')) return 'Workbench';
  if (p.startsWith('/classic')) return 'Classic';
  if (p.startsWith('/singularity')) return 'Lab';
  return 'Archive';
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function coverRadius() {
  return Math.ceil(Math.hypot(window.innerWidth, window.innerHeight));
}

function isSitePath(pathname: string) {
  if (pathname.startsWith('/legacy')) return false;
  if (pathname.startsWith('/_next')) return false;
  if (pathname.startsWith('/assets')) return false;
  return true;
}

/**
 * Disc rise on the archive; soft blur wipe on desk lab routes.
 */
export function HorizonTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const [wipe, setWipe] = useState<Wipe>('disc');
  const [label, setLabel] = useState('Archive');
  const [live, setLive] = useState('');
  const [radius, setRadius] = useState(1200);
  const pendingPath = useRef<string | null>(null);
  const pendingHref = useRef<string | null>(null);
  const wipeRef = useRef<Wipe>('disc');
  const pushed = useRef(false);
  const phaseRef = useRef<Phase>('idle');

  const setPhaseSafe = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const finish = useCallback(() => {
    pendingPath.current = null;
    pendingHref.current = null;
    pushed.current = false;
    setPhaseSafe('idle');
    setLive('');
    document.documentElement.classList.remove('v2-disc-lock');
  }, [setPhaseSafe]);

  const pushPending = useCallback(() => {
    if (pushed.current || !pendingHref.current) return;
    pushed.current = true;
    router.push(pendingHref.current);
    setPhaseSafe('swap');
  }, [router, setPhaseSafe]);

  const beginCover = useCallback(
    (href: string, nextWipe: Wipe) => {
      const url = new URL(href, window.location.href);
      setRadius(coverRadius());
      pendingPath.current = normalizePath(url.pathname);
      pendingHref.current = `${url.pathname}${url.search}${url.hash}`;
      pushed.current = false;
      wipeRef.current = nextWipe;
      setWipe(nextWipe);
      phaseRef.current = 'cover';
      router.prefetch(pendingHref.current);
      setLabel(routeLabel(url.pathname));
      setLive(`Navigating to ${routeLabel(url.pathname)}`);
      document.documentElement.classList.add('v2-disc-lock');
      setPhaseSafe('cover');
    },
    [router, setPhaseSafe]
  );

  useEffect(() => {
    const root = document.querySelector('.v2-root');
    if (!root) return;

    const onClick = (event: Event) => {
      const mouse = event as MouseEvent;
      if (isModifiedClick(mouse)) return;
      if (phaseRef.current !== 'idle') {
        mouse.preventDefault();
        return;
      }

      const target = mouse.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;
      const raw = anchor.getAttribute('href');
      if (!raw || raw.startsWith('mailto:') || raw.startsWith('tel:')) return;

      let next: URL;
      try {
        next = new URL(anchor.href);
      } catch {
        return;
      }
      if (next.origin !== window.location.origin) return;
      if (!isSitePath(next.pathname)) return;
      if (normalizePath(next.pathname) === normalizePath(window.location.pathname)) return;
      if (prefersReducedMotion()) return;
      const fromDesk = isDeskPath(window.location.pathname);
      const toDesk = isDeskPath(next.pathname);
      // Desk layout owns desk → desk transitions (content-only, chrome stays).
      if (fromDesk && toDesk) return;

      mouse.preventDefault();
      mouse.stopPropagation();
      beginCover(next.href, fromDesk || toDesk ? 'blur' : 'disc');
    };

    root.addEventListener('click', onClick, true);
    return () => root.removeEventListener('click', onClick, true);
  }, [beginCover]);

  useEffect(() => {
    if (phase !== 'cover') return;
    // Blur wipe needs a beat to settle before swap; disc keeps the longer beat.
    const delay = wipeRef.current === 'blur' ? 340 : 920;
    const failSafe = window.setTimeout(pushPending, delay);
    return () => window.clearTimeout(failSafe);
  }, [phase, pushPending]);

  useEffect(() => {
    if (phase !== 'swap' || !pendingPath.current) return;
    const target = pendingPath.current;
    const matched = normalizePath(pathname ?? '') === target;

    const reveal = () => {
      if (phaseRef.current !== 'swap') return;
      window.scrollTo(0, 0);
      setPhaseSafe('reveal');
    };

    // Wait for the route to land, then one paint before reveal.
    // Failsafe keeps desk blur from sticking in swap.
    if (matched) {
      const id = window.setTimeout(reveal, 48);
      return () => window.clearTimeout(id);
    }
    const failSafe = window.setTimeout(reveal, 280);
    return () => window.clearTimeout(failSafe);
  }, [phase, pathname, setPhaseSafe]);

  useEffect(() => {
    if (phase !== 'reveal') return;
    document.getElementById('v2-main')?.focus({ preventScroll: true });
    const delay = wipeRef.current === 'blur' ? 480 : 700;
    const failSafe = window.setTimeout(finish, delay);
    return () => window.clearTimeout(failSafe);
  }, [phase, finish]);

  useEffect(() => {
    return () => document.documentElement.classList.remove('v2-disc-lock');
  }, []);

  return (
    <>
      <div className="v2-visually-hidden" aria-live="polite" aria-atomic="true">
        {live}
      </div>
      {phase !== 'idle' && wipe === 'disc' ? (
        <div
          className="v2-disc"
          data-phase={phase}
          aria-hidden="true"
          style={{ ['--disc-r' as string]: `${radius}px` }}
        >
          <div className="v2-disc-shapes">
            <span className="v2-disc-shape v2-disc-shape--accent" />
            <span className="v2-disc-shape v2-disc-shape--paper" />
          </div>
          <div className="v2-disc-core">
            <span className="v2-disc-ring" />
            <span className="v2-disc-void" />
          </div>
          <p className="v2-disc-label">{label}</p>
        </div>
      ) : null}
      {phase !== 'idle' && wipe === 'blur' ? (
        <div className="v2-blur-wipe" data-phase={phase} aria-hidden="true" />
      ) : null}
      <div
        className="v2-disc-stage"
        data-phase={wipe === 'blur' && phase !== 'idle' ? `blur-${phase}` : phase}
      >
        {children}
      </div>
    </>
  );
}
