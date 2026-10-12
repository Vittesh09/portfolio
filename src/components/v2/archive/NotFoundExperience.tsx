'use client';

import Link from 'next/link';
import { useEffect, useRef, type MouseEvent } from 'react';
import { BlackHoleLazy } from '@/src/components/v2/singularity/BlackHoleLazy';
import {
  DEFAULT_SINGULARITY_PARAMS,
  type SingularityParams
} from '@/src/components/v2/singularity/lib/params';

const COLOR_SETS: Pick<
  SingularityParams,
  'colorHot' | 'colorMid' | 'colorAccent' | 'colorEmber' | 'colorOuter'
>[] = [
  {
    colorHot: '#fff6ee',
    colorMid: '#ff5a3a',
    colorAccent: '#f23828',
    colorEmber: '#7a2218',
    colorOuter: '#1a0a08'
  },
  {
    colorHot: '#eef6ff',
    colorMid: '#4aa3ff',
    colorAccent: '#1d4ed8',
    colorEmber: '#16356b',
    colorOuter: '#070c18'
  },
  {
    colorHot: '#fff8e6',
    colorMid: '#ffc14a',
    colorAccent: '#f59e0b',
    colorEmber: '#6b3e0a',
    colorOuter: '#1a1206'
  },
  {
    colorHot: '#f7eeff',
    colorMid: '#c084fc',
    colorAccent: '#7c3aed',
    colorEmber: '#3b1764',
    colorOuter: '#100818'
  },
  {
    colorHot: '#eefff6',
    colorMid: '#34d399',
    colorAccent: '#059669',
    colorEmber: '#0d4a32',
    colorOuter: '#07140e'
  }
];

export function NotFoundExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const paramsRef = useRef<SingularityParams>({
    ...DEFAULT_SINGULARITY_PARAMS,
    ...COLOR_SETS[1]
  });
  const colorIndex = useRef(1);
  const pointer = useRef({ x: 0, y: 0, moved: false, down: false });

  useEffect(() => {
    // The drag target is mounted on the root, outside the stage section.
    const stage = rootRef.current;
    if (!stage) return;

    const onPointerDown = (event: globalThis.PointerEvent) => {
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;
      pointer.current.moved = false;
      pointer.current.down = true;
    };
    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (!pointer.current.down || pointer.current.moved) return;
      const distance = Math.hypot(event.clientX - pointer.current.x, event.clientY - pointer.current.y);
      if (distance > 6) pointer.current.moved = true;
    };
    const onPointerUp = () => {
      pointer.current.down = false;
    };

    stage.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      stage.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  const onStageClick = (event: MouseEvent) => {
    if (pointer.current.moved) return;
    const target = event.target;
    if (target instanceof Element && target.closest('a, button')) return;
    colorIndex.current = (colorIndex.current + 1) % COLOR_SETS.length;
    Object.assign(paramsRef.current, COLOR_SETS[colorIndex.current]);
  };

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
          <Link href="/" className="archive-label notfound-home">
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
