'use client';

import { useCallback, useRef } from 'react';
import type { PointerEvent } from 'react';

/**
 * Tracks the pointer across a grid and writes its position into each cell as
 * --glow-x / --glow-y, so a masked border glow in CSS can follow the cursor
 * across shared cell edges. Pair with the `v2-border-glow` class.
 */
export function useBorderGlow(cellSelector = ':scope > * > *') {
  const frame = useRef(0);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'mouse') return;
      const root = event.currentTarget;
      const { clientX, clientY } = event;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        root.querySelectorAll<HTMLElement>(cellSelector).forEach((cell) => {
          const rect = cell.getBoundingClientRect();
          cell.style.setProperty('--glow-x', `${clientX - rect.left}px`);
          cell.style.setProperty('--glow-y', `${clientY - rect.top}px`);
        });
        root.dataset.glow = 'on';
      });
    },
    [cellSelector]
  );

  const onPointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    cancelAnimationFrame(frame.current);
    delete event.currentTarget.dataset.glow;
  }, []);

  return { onPointerMove, onPointerLeave };
}
