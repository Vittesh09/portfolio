'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useKissMode } from '@/src/components/v2/layout/KissModeProvider';
import { useLenisSmoothScroll } from '@/src/components/v2/motion/useLenisSmoothScroll';

type GatePhase = 'loading' | 'ready' | 'exit' | 'hidden';

const INTRO_STORAGE_KEY = 'v2-auto-intro';

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

function AmbientCursor({ enabled }: { enabled: boolean }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.35 });
  const smoothY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.35 });
  const [pressed, setPressed] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (!enabled || window.matchMedia('(pointer: coarse)').matches) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX - 18);
      y.set(event.clientY - 18);
      const target = event.target;
      setInteractive(
        target instanceof Element &&
          Boolean(
            target.closest('a, button, [role="button"], input, textarea, select, label')
          )
      );
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  /* Orbit only while pressed and not over a CTA */
  const orbit = pressed && !interactive;

  return (
    <motion.div
      aria-hidden
      className="v2-ambient-cursor"
      data-interactive={interactive}
      data-pressed={pressed}
      data-orbit={orbit}
      style={{ x: smoothX, y: smoothY }}
      animate={{ scale: pressed ? 0.88 : interactive ? 1.55 : 1 }}
      transition={{ duration: 0.18 }}
    >
      <span className="v2-ambient-cursor-orbit" aria-hidden>
        <span className="v2-ambient-cursor-trail" data-trail="4" />
        <span className="v2-ambient-cursor-trail" data-trail="3" />
        <span className="v2-ambient-cursor-trail" data-trail="2" />
        <span className="v2-ambient-cursor-trail" data-trail="1" />
        <span className="v2-ambient-cursor-core" />
      </span>
    </motion.div>
  );
}

function EntryGate({ phase }: { phase: GatePhase }) {
  const visible = phase !== 'hidden';

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="entry-gate"
          className="v2-entry-gate"
          data-phase={phase}
          initial={false}
          animate={
            phase === 'exit'
              ? { opacity: 0, scale: 1.12 }
              : { opacity: 1, scale: 1 }
          }
          exit={{ opacity: 0 }}
          transition={{
            duration: phase === 'exit' ? 0.75 : 0.25,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <div className="v2-entry-orbits" aria-hidden>
            <span className="v2-entry-orbit v2-entry-orbit-1" />
            <span className="v2-entry-orbit v2-entry-orbit-2" />
            <span className="v2-entry-orbit v2-entry-orbit-3" />
          </div>

          <div className="v2-entry-core" aria-hidden>
            <span className="v2-entry-void" />
            <span className="v2-entry-ring" />
            <span className="v2-entry-progress" />
          </div>

          <p className="archive-label v2-entry-status">
            {phase === 'ready' || phase === 'exit' ? 'Vittesh Sinha' : 'Entering archive'}
          </p>
          <p className="archive-label v2-entry-caption">Product designer · India</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ExperienceMotion() {
  const pathname = usePathname();
  const isHome = pathname === '/v2' || pathname === '/v2/';
  const isMachine = pathname?.includes('/machine') ?? false;
  const { kissMode } = useKissMode();
  // Keep SSR and first client paint identical; intro runs only after mount.
  const [phase, setPhase] = useState<GatePhase>('hidden');

  useLayoutEffect(() => {
    const root = document.querySelector('.v2-root');

    if (!isHome) {
      setPhase('hidden');
      root?.classList.remove('v2-intro-active', 'v2-intro-reveal');
      return;
    }

    // Primary /v2 uses the singularity load intro — skip the old orbit entry gate
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    setPhase('hidden');
    root?.classList.remove('v2-intro-active');
    root?.classList.add('v2-intro-reveal');
    window.dispatchEvent(new CustomEvent('v2-cosmos-reveal'));
  }, [isHome]);

  const gateOpen = isHome && phase !== 'hidden';

  useEffect(() => {
    if (!gateOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [gateOpen]);

  const experienceReady = phase === 'hidden';
  useLenisSmoothScroll(experienceReady && !isMachine);
  useSectionReveals(experienceReady);
  useTitleReveals(experienceReady, pathname, kissMode);

  useEffect(() => {
    const root = document.querySelector('.v2-root');
    if (!root || window.matchMedia('(pointer: coarse)').matches) return;
    root.classList.toggle('v2-custom-cursor-active', experienceReady);
    return () => root.classList.remove('v2-custom-cursor-active');
  }, [experienceReady]);

  return (
    <>
      {isHome && !kissMode ? <EntryGate phase={phase} /> : null}
      <AmbientCursor enabled={experienceReady} />
    </>
  );
}
