'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { heroCloser, heroHeadline, heroKicker } from '@/src/config/v2/profile';
import { siteConfig } from '@/src/config/v2/site';

function roleDisplayLines(role: string) {
  const words = role.trim().split(/\s+/);
  if (words.length <= 2) return [role];
  return [`${words.slice(0, -1).join(' ')}`, words[words.length - 1]];
}

/** Stacked identity: name, then role with the last word on its own row. */
export function HeroIdentityMark() {
  return (
    <>
      <span className="v2-visually-hidden">
        {siteConfig.name}, {siteConfig.role}
      </span>
      <span className="v2-kiss-heading-row v2-kiss-heading-row--name" aria-hidden="true">
        {siteConfig.name}
      </span>
      {roleDisplayLines(siteConfig.role).map((line) => (
        <span key={line} className="v2-kiss-heading-row v2-kiss-heading-row--role" aria-hidden="true">
          {line}
        </span>
      ))}
    </>
  );
}

export function HeroKicker({ className, style }: { className?: string; style?: CSSProperties }) {
  if (!heroKicker) return null;
  return (
    <p className={`v2-hero-kicker text-text-secondary ${className ?? ''}`} style={style}>
      {heroKicker}
    </p>
  );
}

export function HeroHeadlineLines() {
  return <span className="v2-hero-line v2-hero-plain">{heroHeadline}</span>;
}

export function HeroCloser({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <p className={`v2-hero-closer text-text-secondary ${className ?? ''}`} style={style}>
      {heroCloser}
    </p>
  );
}

/** Mobile kiss closer: types the line in after the stacked identity lands. */
export function TypewriterCloser({ className }: { className?: string }) {
  const [count, setCount] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduced) {
      setCount(heroCloser.length);
      return;
    }
    setCount(0);
    const begin = performance.now() + 880;
    let frame = 0;
    const tick = (now: number) => {
      if (now < begin) {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      let chars = 0;
      let spent = 0;
      const elapsed = now - begin;
      while (chars < heroCloser.length && spent <= elapsed) {
        spent += heroCloser[chars] === ' ' ? 16 : 30;
        chars += 1;
      }
      setCount(chars);
      if (chars < heroCloser.length) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [reduced]);

  const done = reduced || count >= heroCloser.length;
  const shown = reduced ? heroCloser : heroCloser.slice(0, count);

  return (
    <p className={`v2-hero-closer v2-kiss-typed text-text-secondary ${className ?? ''}`}>
      <span className="v2-visually-hidden">{heroCloser}</span>
      <span className="v2-kiss-typed-sizer" aria-hidden="true">
        {heroCloser}
      </span>
      <span className="v2-kiss-typed-live" aria-hidden="true">
        {shown}
        {done ? null : <span className="v2-kiss-caret" />}
      </span>
    </p>
  );
}
