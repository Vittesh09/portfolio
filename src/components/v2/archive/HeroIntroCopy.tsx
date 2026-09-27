import type { CSSProperties } from 'react';
import { heroCloser, heroHeadline, heroName } from '@/src/config/v2/profile';

export function HeroKicker({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <p className={`v2-hero-kicker text-text-secondary ${className ?? ''}`} style={style}>
      Hey, I am <span className="text-accent-pop">{heroName}</span>. Product Designer.
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
