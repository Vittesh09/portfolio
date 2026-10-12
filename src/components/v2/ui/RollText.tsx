import type { CSSProperties } from 'react';

/** Whole-word roll. One text node is read and copied; the duplicate is hidden from assistive tech. */
export function RollText({ children }: { children: string }) {
  return (
    <span className="v2-roll" data-text={children}>
      <span className="v2-roll-face">{children}</span>
      <span className="v2-roll-ghost" aria-hidden="true" style={{ '--i': 0 } as CSSProperties}>
        {children}
      </span>
    </span>
  );
}
