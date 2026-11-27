'use client';

import { useEffect, useState } from 'react';
import { useDeskScroll } from '@/src/components/v2/desk/DeskSmoothScroll';

/** Show the button once the reader is this far down (px). */
const SHOW_AFTER = 640;

/**
 * Floating ↑ button for long reads (case studies, posts). Fades in after the reader
 * has scrolled a screen or so, and glides the desk scroller back to the top.
 */
export function DeskBackToTop() {
  const scroll = useDeskScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scroller = scroll?.scrollerRef.current;
    if (!scroller) return;
    let shown = false;
    const update = () => {
      const next = scroller.scrollTop > SHOW_AFTER;
      if (next === shown) return;
      shown = next;
      setVisible(next);
    };
    update();
    scroller.addEventListener('scroll', update, { passive: true });
    return () => scroller.removeEventListener('scroll', update);
  }, [scroll]);

  return (
    <button
      type="button"
      className="desk-to-top"
      data-visible={visible ? 'true' : undefined}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        const scroller = scroll?.scrollerRef.current;
        if (!scroller) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        scroller.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }}
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
        <path
          d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
