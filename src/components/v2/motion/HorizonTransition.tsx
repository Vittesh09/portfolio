'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from 'react';

type Phase = 'idle' | 'cover' | 'swap' | 'reveal';

function normalizePath(path: string) {
  if (!path) return '/';
  return path.endsWith('/') ? path : `${path}/`;
}

function routeLabel(path: string) {
  const p = normalizePath(path);
  if (p === '/v2/') return 'Home';
  if (p.startsWith('/v2/about')) return 'About';
  if (p.startsWith('/v2/work/')) return 'Work';
  if (p.startsWith('/v2/machine')) return 'Machine';
  if (p.startsWith('/v2/classic/workbench')) return 'Workbench';
  if (p.startsWith('/v2/classic')) return 'Classic';
  if (p.startsWith('/v2/singularity')) return 'Lab';
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

/**
 * Disc rise — Nod-style staggered circles that climb to cover the page,
 * then clear. Adapted: red + paper/ink discs, singularity core instead of eye.
 * Ref: https://nodcoding.com/summer-bootcamps/
 */
export function HorizonTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('Archive');
  const [live, setLive] = useState('');
  const [radius, setRadius] = useState(1200);
  const pendingPath = useRef<string | null>(null);
  const pendingHref = useRef<string | null>(null);
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
    (href: string) => {
      const url = new URL(href, window.location.href);
      setRadius(coverRadius());
      pendingPath.current = normalizePath(url.pathname);
      pendingHref.current = `${url.pathname}${url.search}${url.hash}`;
      pushed.current = false;
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
      if (!next.pathname.startsWith('/v2')) return;
      if (normalizePath(next.pathname) === normalizePath(window.location.pathname)) return;
      if (prefersReducedMotion()) return;

      mouse.preventDefault();
      mouse.stopPropagation();
      beginCover(next.href);
    };

    root.addEventListener('click', onClick, true);
    return () => root.removeEventListener('click', onClick, true);
  }, [beginCover]);

  useEffect(() => {
    if (phase !== 'cover') return;
    /* First disc ~0s, second ~0.22s, settle ~0.9s */
    const failSafe = window.setTimeout(pushPending, 920);
    return () => window.clearTimeout(failSafe);
  }, [phase, pushPending]);

  useEffect(() => {
    if (phase !== 'swap' || !pendingPath.current) return;
    if (normalizePath(pathname ?? '') !== pendingPath.current) return;
    window.scrollTo(0, 0);
    const id = window.requestAnimationFrame(() => setPhaseSafe('reveal'));
    return () => window.cancelAnimationFrame(id);
  }, [phase, pathname, setPhaseSafe]);

  useEffect(() => {
    if (phase !== 'reveal') return;
    document.getElementById('v2-main')?.focus({ preventScroll: true });
    const failSafe = window.setTimeout(finish, 700);
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
      {phase !== 'idle' ? (
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
      <div className="v2-disc-stage" data-phase={phase}>
        {children}
      </div>
    </>
  );
}
