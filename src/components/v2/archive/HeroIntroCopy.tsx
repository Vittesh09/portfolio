import type { CSSProperties } from 'react';
import { profile } from '@/src/config/v2/profile';

export function HeroHeadlineLines() {
  return (
    <>
      <span className="v2-hero-line v2-hero-plain">I make powerful products</span>
      <span className="v2-hero-line">
        <span className="v2-hero-emphasis v2-hero-emphasis-hot">easier to use.</span>
      </span>
    </>
  );
}

export function HeroIntroCopy({
  className,
  style
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const [before, after] = profile.heroIntro.split('Vittesh');
  return (
    <p className={className} style={style}>
      {before}
      <span className="text-accent-pop">Vittesh</span>
      {after}
    </p>
  );
}
