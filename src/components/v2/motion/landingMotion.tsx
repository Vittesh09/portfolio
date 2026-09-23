'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const LETTER_MS = 420;

/** False until mount so SSR markup matches the first client render. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return reduced;
}

export type HeroTitleLine = {
  text: string;
  accent?: boolean;
};

export const HERO_TITLE_LINES_KISS: HeroTitleLine[] = [{ text: 'I make powerful products easier to use.' }];

export const HERO_TITLE_LINES_SINGULARITY: HeroTitleLine[] = [
  { text: 'I make powerful products easier to use.' }
];

export function heroTitleDuration(lines: HeroTitleLine[], stagger = 0.032) {
  const chars = lines.reduce((count, line) => count + line.text.length, 0);
  return 0.1 + Math.max(0, chars - 1) * stagger + LETTER_MS / 1000;
}

type AnimatedHeroTitleProps = {
  lines: HeroTitleLine[];
  className?: string;
  play?: boolean;
  stagger?: number;
  onComplete?: () => void;
};

/** Letter-by-letter headline reveal — words stay unbroken (no orphaned punctuation). */
export function AnimatedHeroTitle({
  lines,
  className,
  play = true,
  stagger = 0.032,
  onComplete
}: AnimatedHeroTitleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const label = lines.map((line) => line.text).join(' ');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const totalDuration = heroTitleDuration(lines, stagger);

  useEffect(() => {
    if (!play) return;
    if (reduceMotion) {
      onCompleteRef.current?.();
      return;
    }
    const id = window.setTimeout(() => {
      onCompleteRef.current?.();
    }, totalDuration * 1000);
    return () => window.clearTimeout(id);
  }, [play, reduceMotion, totalDuration]);

  let charIndex = 0;

  return (
    <h1 className={`v2-hero-title ${className ?? ''}`} aria-label={label}>
      <span aria-hidden>
        {lines.map((line, lineIndex) => {
          const words = line.text.split(' ');

          return (
            <span
              key={`${lineIndex}-${line.text}`}
              className={`v2-hero-title-line ${line.accent ? 'text-accent-pop' : ''}`}
            >
              {words.map((word, wordIndex) => (
                <span key={`${lineIndex}-${wordIndex}`} className="v2-hero-title-word">
                  {wordIndex > 0 ? (
                    <AnimatedLetter
                      char=" "
                      index={charIndex++}
                      play={play}
                      stagger={stagger}
                      isSpace
                    />
                  ) : null}
                  {word.split('').map((char, letterIndex) => {
                    const index = charIndex++;
                    return (
                      <AnimatedLetter
                        key={`${lineIndex}-${wordIndex}-${letterIndex}`}
                        char={char}
                        index={index}
                        play={play}
                        stagger={stagger}
                      />
                    );
                  })}
                </span>
              ))}
            </span>
          );
        })}
      </span>
    </h1>
  );
}

function AnimatedLetter({
  char,
  index,
  play,
  stagger,
  isSpace = false
}: {
  char: string;
  index: number;
  play: boolean;
  stagger: number;
  isSpace?: boolean;
}) {
  return (
    <motion.span
      className={isSpace ? 'v2-hero-title-space' : 'v2-hero-title-char'}
      initial={false}
      animate={play ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: '0.42em', filter: 'blur(4px)' }}
      transition={{
        duration: LETTER_MS / 1000,
        delay: 0.1 + index * stagger,
        ease: EASE
      }}
    >
      {isSpace ? '\u00A0' : char}
    </motion.span>
  );
}

export function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const match = value.match(/\d+/);
  const target = match ? Number(match[0]) : null;
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !inView || target === null) return;
    const controls = animate(0, target, {
      duration: 2.4,
      ease: EASE,
      onUpdate: (latest) => setCurrent(Math.round(latest))
    });
    return () => controls.stop();
  }, [mounted, inView, target]);

  if (value.includes('TODO') || target === null) {
    return (
      <motion.span
        ref={ref}
        initial={false}
        whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 1.8, ease: EASE }}
        className="inline-block"
      >
        {value}
      </motion.span>
    );
  }

  const digits = match?.[0] ?? '';
  const prefix = value.slice(0, value.indexOf(digits));
  const suffix = value.slice(value.indexOf(digits) + digits.length);
  const shown = mounted ? current : target;
  const displayed = digits.startsWith('0')
    ? String(shown).padStart(digits.length, '0')
    : String(shown);

  return (
    <span ref={ref} suppressHydrationWarning>
      {prefix}
      {displayed}
      {suffix}
    </span>
  );
}

type RevealOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/** Fade + lift when the block enters the viewport (classes applied after mount). */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  y = 28
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    el.style.opacity = '0';
    el.style.transform = `translateY(${y}px)`;

    const show = () => {
      el.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show();
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '-8% 0px -6% 0px' }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.style.opacity = '';
      el.style.transform = '';
      el.style.transition = '';
    };
  }, [reduceMotion, delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Staggered on-load fade for the kiss / mobile hero (CSS-driven, no hydration flash). */
export function useKissHeroIntro() {
  const heroRef = useRef<HTMLElement>(null);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hero.classList.add('is-kiss-in');
      setIntroReady(true);
      return;
    }
    const id = window.requestAnimationFrame(() => {
      hero.classList.add('is-kiss-in');
      setIntroReady(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return { heroRef, introReady };
}

type MobileHeroSublineProps = {
  play: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Intro line rises toward the headline after the letter reveal. */
export function MobileHeroSubline({ play, className, children }: MobileHeroSublineProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.p
      className={className}
      initial={false}
      animate={
        reduceMotion || play
          ? { opacity: 1, y: 0, marginTop: '1rem' }
          : { opacity: 0, y: 22, marginTop: '2.25rem' }
      }
      transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.12, ease: EASE }}
    >
      {children}
    </motion.p>
  );
}
