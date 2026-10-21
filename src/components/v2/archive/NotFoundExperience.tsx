'use client';

import Link from 'next/link';
import { v2Path } from '@/src/config/v2/profile';
import { useRef } from 'react';
import { BlackHoleLazy } from '@/src/components/v2/singularity/BlackHoleLazy';
import { useSingularityColorClick } from '@/src/components/v2/singularity/hooks/useSingularityColorClick';
import { SINGULARITY_COLOR_SETS } from '@/src/components/v2/singularity/lib/palettes';
import {
  DEFAULT_SINGULARITY_PARAMS,
  type SingularityParams
} from '@/src/components/v2/singularity/lib/params';

export function NotFoundExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const paramsRef = useRef<SingularityParams>({
    ...DEFAULT_SINGULARITY_PARAMS,
    ...SINGULARITY_COLOR_SETS[1]
  });
  const onStageClick = useSingularityColorClick(rootRef, paramsRef, 1);

  return (
    <div ref={rootRef} className="v2-root dark notfound-screen" onClick={onStageClick}>
      <section
        ref={stageRef}
        className="notfound-stage"
        aria-label="Page not found. Drag the singularity to move it, drag around it to orbit, or click it to change its color."
      >
        <BlackHoleLazy heroRef={stageRef} mode="center" paramsRef={paramsRef} />
        <div className="notfound-copy">
          <div className="notfound-warp" data-bh-warp>
            <p className="archive-label notfound-code">404</p>
            <h1 className="archive-display notfound-title">It seems you’re lost</h1>
            <p className="notfound-line">Only those who wander discover what they’re seeking.</p>
          </div>
          <div className="notfound-links">
            <Link href={v2Path('/')} className="archive-label notfound-home">
              Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
