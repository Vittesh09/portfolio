'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useKissMode } from '@/src/components/v2/layout/KissModeProvider';
import { useLenisSmoothScroll } from '@/src/components/v2/motion/useLenisSmoothScroll';

function collectScrollTitles(root: ParentNode) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'main h1, main h2, main h3, main .archive-serif, footer .archive-serif'
    )
  ).filter((el) => {
    if (el.classList.contains('bh-sr-only')) return false;
    if (el.classList.contains('archive-display--stat')) return false;
    if (el.closest('.v2-black-hole-hero, .v2-kiss-hero, .v2-hero-title')) return false;
    return true;
  });
}

function useTitleReveals(enabled: boolean, pathname: string | null, kissMode: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const root = document.querySelector('.v2-root');
    if (!root) return;

    const titles = collectScrollTitles(root);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      titles.forEach((title) => {
        title.classList.add('v2-title-reveal', 'is-in');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -12% 0px' }
    );

    const fold = window.innerHeight * 0.88;
    titles.forEach((title) => {
      title.classList.add('v2-title-reveal');
      if (title.getBoundingClientRect().top < fold) {
        title.classList.add('is-in');
        return;
      }
      observer.observe(title);
    });

    return () => {
      observer.disconnect();
      titles.forEach((title) => {
        title.classList.remove('v2-title-reveal', 'is-in');
      });
    };
  }, [enabled, pathname, kissMode]);
}

function useSectionReveals(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileLanding =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.v2-root main section')
    );

    if (reduce || mobileLanding) {
      sections.forEach((section) => section.classList.add('v2-motion-visible'));
      return;
    }

    sections.forEach((section, index) => {
      if (index === 0) {
        section.classList.add('v2-motion-visible');
      } else {
        section.classList.add('v2-motion-section');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('v2-motion-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );

    sections.slice(1).forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);
}

/** Touch stand-in for card hover: the thumb settles and takes colour as it rises into view. */
function useProjectScrollFocus() {
  useEffect(() => {
    const touch =
      window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches;
    if (!touch) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const eased = new WeakMap<HTMLElement, number>();
    let frame = 0;
    let last = performance.now();

    const targetFor = (card: HTMLElement) => {
      const thumb = card.querySelector('.archive-project-thumb');
      if (!thumb) return 0;
      const rect = thumb.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const raw = (vh - center) / (vh * 0.45);
      const t = Math.min(1, Math.max(0, raw));
      return t * t * (3 - 2 * t);
    };

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const follow = reduce ? 1 : 1 - Math.exp(-4.5 * dt);
      document
        .querySelectorAll<HTMLElement>('.archive-project-card:not(.is-locked)')
        .forEach((card) => {
          const target = targetFor(card);
          const prev = eased.get(card) ?? target;
          const next = Math.abs(target - prev) < 0.001 ? target : prev + (target - prev) * follow;
          if (Math.abs(next - prev) < 0.0005 && eased.has(card)) return;
          eased.set(card, next);
          card.style.setProperty('--focus', next.toFixed(4));
          card.classList.toggle('is-focused', next > 0.82);
        });
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);
}

function AmbientCursor({ enabled }: { enabled: boolean }) {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [nativeGrab, setNativeGrab] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scaleRef = useRef(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled || !mounted) return;
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 768px)').matches
    ) {
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100, scale: 1 };
    let frame = 0;

    const place = () => {
      const dot = dotRef.current;
      const halo = ringRef.current;
      if (dot) dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (halo) {
        halo.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) scale(${ring.scale})`;
      }
    };

    let last = performance.now();
    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      if (!Number.isFinite(ring.x) || !Number.isFinite(ring.y)) {
        ring.x = target.x;
        ring.y = target.y;
      }
      if (reduce) {
        ring.x = target.x;
        ring.y = target.y;
      } else {
        const dt = Math.min(0.05, (now - last) / 1000);
        const follow = 1 - Math.exp(-14 * dt);
        ring.x += (target.x - ring.x) * follow;
        ring.y += (target.y - ring.y) * follow;
        ring.scale += (scaleRef.current - ring.scale) * follow;
      }
      last = now;
      place();
    };
    frame = window.requestAnimationFrame(tick);

    const move = (event: PointerEvent) => {
      target.x = event.clientX - 18;
      target.y = event.clientY - 18;
      const node = event.target;
      const overHole =
        node instanceof Element &&
        Boolean(node.closest('.bh-grab') || document.querySelector('.bh-hero.is-bh-dragging'));
      setNativeGrab(overHole);
      setInteractive(
        !overHole &&
          node instanceof Element &&
          Boolean(node.closest('a, button, [role="button"], input, textarea, select, label'))
      );
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled, mounted]);

  const orbit = pressed && !interactive && !nativeGrab;
  const scale = nativeGrab ? 1 : pressed ? 0.88 : interactive ? 1.55 : 1;

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  if (!mounted || !enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="v2-ambient-cursor-ring"
        data-interactive={interactive}
        data-native-grab={nativeGrab}
        style={{ opacity: nativeGrab ? 0 : 1, transition: 'opacity 0.18s ease' }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="v2-ambient-cursor"
        data-interactive={interactive}
        data-native-grab={nativeGrab}
        data-pressed={pressed}
        data-orbit={orbit}
        style={{ opacity: nativeGrab ? 0 : 1, transition: 'opacity 0.18s ease' }}
      >
        <span className="v2-ambient-cursor-orbit" aria-hidden>
          <span className="v2-ambient-cursor-trail" data-trail="4" />
          <span className="v2-ambient-cursor-trail" data-trail="3" />
          <span className="v2-ambient-cursor-trail" data-trail="2" />
          <span className="v2-ambient-cursor-trail" data-trail="1" />
          <span className="v2-ambient-cursor-core" />
        </span>
      </div>
    </>
  );
}

export function ExperienceMotion() {
  const pathname = usePathname();
  const isMachine = pathname?.includes('/machine') ?? false;
  const { kissMode } = useKissMode();

  useLayoutEffect(() => {
    const root = document.querySelector('.v2-root');
    root?.classList.add('v2-intro-reveal');
    window.dispatchEvent(new CustomEvent('v2-cosmos-reveal'));
  }, []);

  useLenisSmoothScroll(!isMachine);
  useSectionReveals(true);
  useTitleReveals(true, pathname, kissMode);
  useProjectScrollFocus();
  const [cursorOn, setCursorOn] = useState(false);

  useEffect(() => {
    const root = document.querySelector('.v2-root');
    const narrow = window.matchMedia('(max-width: 768px)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const sync = () => {
      const on = !narrow.matches && !coarse.matches;
      setCursorOn(on);
      root?.classList.toggle('v2-custom-cursor-active', on);
    };
    sync();
    narrow.addEventListener('change', sync);
    coarse.addEventListener('change', sync);
    return () => {
      narrow.removeEventListener('change', sync);
      coarse.removeEventListener('change', sync);
      root?.classList.remove('v2-custom-cursor-active');
    };
  }, []);

  return <AmbientCursor enabled={cursorOn} />;
}
