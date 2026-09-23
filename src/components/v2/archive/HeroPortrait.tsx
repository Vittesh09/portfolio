import type { CSSProperties } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/src/config/v2/site';

export function HeroPortrait({
  className = '',
  style
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`v2-hero-portrait ${className}`.trim()} style={style}>
      <div className="v2-hero-portrait-ring">
        <div className="v2-hero-portrait-inner">
          <Image
            src="/assets/images/profile.png"
            alt={`Portrait of ${siteConfig.name}`}
            width={96}
            height={96}
            priority
            unoptimized
            className="v2-hero-portrait-img"
            sizes="96px"
          />
        </div>
      </div>
    </div>
  );
}
