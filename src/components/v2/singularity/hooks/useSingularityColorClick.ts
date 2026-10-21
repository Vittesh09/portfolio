'use client';

import { useEffect, useRef, type MouseEvent, type RefObject } from 'react';
import { SINGULARITY_COLOR_SETS } from '../lib/palettes';
import type { SingularityParams } from '../lib/params';

/** Click (not drag) cycles the disk palette. Same gesture on 404 and the landing hero. */
export function useSingularityColorClick(
  rootRef: RefObject<HTMLElement | null>,
  paramsRef: { current: SingularityParams },
  startIndex = 0,
  enabled = true
) {
  const colorIndex = useRef(startIndex);
  const pointer = useRef({ x: 0, y: 0, moved: false, down: false });

  useEffect(() => {
    if (!enabled) return;
    const stage = rootRef.current;
    if (!stage) return;

    const onPointerDown = (event: PointerEvent) => {
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;
      pointer.current.moved = false;
      pointer.current.down = true;
    };
    const onPointerMove = (event: PointerEvent) => {
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
  }, [rootRef, enabled]);

  return (event: MouseEvent) => {
    if (pointer.current.moved) return;
    const target = event.target;
    if (
      target instanceof Element &&
      target.closest('a, button, input, textarea, select, [role="button"]')
    ) {
      return;
    }
    colorIndex.current = (colorIndex.current + 1) % SINGULARITY_COLOR_SETS.length;
    const next = SINGULARITY_COLOR_SETS[colorIndex.current];
    if (!next) return;
    Object.assign(paramsRef.current, next);
  };
}
