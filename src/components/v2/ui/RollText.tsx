import type { CSSProperties } from 'react';

/** Per-letter roll on hover of the closest link or button. Plain text stays readable to assistive tech. */
export function RollText({ children }: { children: string }) {
  return (
    <span className="v2-roll">
      <span className="v2-visually-hidden">{children}</span>
      <span className="v2-roll-track" aria-hidden>
        {Array.from(children).map((char, index) => {
          const glyph = char === ' ' ? '\u00A0' : char;
          return (
            <span key={index} className="v2-roll-mask" style={{ '--i': index } as CSSProperties}>
              <span className="v2-roll-char">{glyph}</span>
              <span className="v2-roll-char v2-roll-char--next">{glyph}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
