'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import { useDeskScroll } from '@/src/components/v2/desk/DeskSmoothScroll';
import { DeskWalkmanCard } from '@/src/components/v2/desk/DeskWalkmanCard';
import type { ProjectCardData } from '@/src/config/v2/caseStudies';

function ArrowIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
      <path
        d={dir === 'left' ? 'M10 3.5 5.5 8l4.5 4.5' : 'M6 3.5 10.5 8 6 12.5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const RAIL_SPRING = { stiffness: 230, damping: 32, mass: 0.7, restDelta: 0.4 };
/** px of glide per px/ms of release velocity. */
const FLING_MS = 220;

function DragIcon() {
  return (
    <svg viewBox="0 0 20 12" width="18" height="11" aria-hidden="true" focusable="false">
      <path
        d="M1.5 6h17M4.5 3 1.5 6l3 3M15.5 3l3 3-3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="desk-work-resume-icon"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <g className="desk-work-resume-arrow">
        <path
          d="M8 2.5v6.4M5.4 6.6 8 9.2l2.6-2.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path
        className="desk-work-resume-tray"
        d="M3.25 11.1v1.65c0 .55.45 1 1 1h7.5c.55 0 1-.45 1-1V11.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DeskWorkRail({
  cards,
  heading = 'Selected Work',
  headingId = 'desk-work-heading',
  label = 'Selected work, scroll horizontally',
  stepLabel = 'project',
  resumeHref,
  children
}: {
  cards?: ProjectCardData[];
  heading?: string;
  headingId?: string;
  label?: string;
  stepLabel?: string;
  resumeHref?: string;
  children?: ReactNode;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    moved: boolean;
  } | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(max <= 2 || el.scrollLeft >= max - 2);
  }, []);

  const deskScroll = useDeskScroll();
  const railTarget = useMotionValue(0);
  const railSmooth = useSpring(railTarget, RAIL_SPRING);

  const maxScroll = useCallback(() => {
    const el = railRef.current;
    return el ? Math.max(0, el.scrollWidth - el.clientWidth) : 0;
  }, []);

  const moveTo = useCallback(
    (left: number) => {
      const next = Math.min(maxScroll(), Math.max(0, left));
      const prev = railTarget.get();
      railTarget.set(next);
      return next !== prev;
    },
    [maxScroll, railTarget]
  );

  const step = useCallback(
    (dir: -1 | 1) => {
      const item = railRef.current?.querySelector<HTMLElement>('.desk-work-track-item');
      if (!item) return;
      const gap = parseFloat(getComputedStyle(item.parentElement!).columnGap) || 0;
      moveTo(railTarget.get() + dir * (item.offsetWidth + gap));
    },
    [moveTo, railTarget]
  );

  useLayoutEffect(() => {
    const el = railRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    railTarget.jump(0);
    railSmooth.jump(0);
    syncEdges();

    const narrowMq = window.matchMedia('(max-width: 768px)');
    const coarseMq = window.matchMedia('(pointer: coarse)');
    const useNative = () => narrowMq.matches || coarseMq.matches;

    const unsubscribe = railSmooth.on('change', (value) => {
      // On phones, native overflow owns the pan; only follow the spring for button steps.
      if (useNative() && !railSmooth.isAnimating()) return;
      el.scrollLeft = value;
    });
    // Touch pans scroll natively; re-seat the spring so the next move starts there.
    const onScroll = () => {
      syncEdges();
      if (useNative()) {
        railTarget.jump(el.scrollLeft);
        railSmooth.jump(el.scrollLeft);
        return;
      }
      if (railSmooth.isAnimating() || Math.abs(el.scrollLeft - railSmooth.get()) < 1.5) return;
      railTarget.jump(el.scrollLeft);
      railSmooth.jump(el.scrollLeft);
    };
    // Trackpad / shift-wheel only arrive here when the page gate says the page is still.
    const unregister = deskScroll?.registerHorizontal(el, (dx) => moveTo(railTarget.get() + dx));

    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      unsubscribe();
      unregister?.();
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', syncEdges);
    };
  }, [cards, deskScroll, moveTo, railSmooth, railTarget, syncEdges]);

  // ← / → move the rail while the pointer is over it or focus is inside it.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let hovered = false;
    const enter = () => (hovered = true);
    const leave = () => (hovered = false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const active = document.activeElement;
      const focusedInside = !!active && section.contains(active);
      if (!hovered && !focusedInside) return;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
      event.preventDefault();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    };
    section.addEventListener('pointerenter', enter);
    section.addEventListener('pointerleave', leave);
    window.addEventListener('keydown', onKey);
    return () => {
      section.removeEventListener('pointerenter', enter);
      section.removeEventListener('pointerleave', leave);
      window.removeEventListener('keydown', onKey);
    };
  }, [step]);

  const stopDrag = useRef<(() => void) | null>(null);

  useEffect(() => () => stopDrag.current?.(), []);

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.pointerType !== 'mouse') return;
    const el = railRef.current;
    if (!el) return;
    stopDrag.current?.();
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: railSmooth.get(),
      moved: false
    };
    let lastX = event.clientX;
    let lastT = performance.now();
    let velocity = 0;

    const move = (ev: PointerEvent) => {
      const state = drag.current;
      const scroller = railRef.current;
      if (!state || !scroller || state.pointerId !== ev.pointerId) return;
      const dx = ev.clientX - state.startX;
      if (!state.moved) {
        if (Math.abs(dx) <= 4) return;
        state.moved = true;
        scroller.classList.add('is-dragging');
      }
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      velocity = velocity * 0.6 + ((ev.clientX - lastX) / dt) * 0.4;
      lastX = ev.clientX;
      lastT = now;
      const left = Math.min(maxScroll(), Math.max(0, state.startScroll - dx));
      railTarget.jump(left);
      railSmooth.jump(left);
    };
    const finish = () => {
      const scroller = railRef.current;
      const state = drag.current;
      scroller?.classList.remove('is-dragging');
      if (state?.moved && scroller) {
        scroller.setAttribute('data-suppress-click', '1');
        window.setTimeout(() => scroller.removeAttribute('data-suppress-click'), 0);
        // Release glide: carry the last drag velocity a short way.
        if (performance.now() - lastT < 80) moveTo(railTarget.get() - velocity * FLING_MS);
      }
      drag.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      stopDrag.current = null;
    };
    const up = (ev: PointerEvent) => {
      if (drag.current?.pointerId === ev.pointerId) finish();
    };
    stopDrag.current = finish;
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  return (
    <section ref={sectionRef} className="desk-work-rail" aria-labelledby={headingId}>
      <div className="desk-work-heading-row">
        <h2 id={headingId} className="desk-work-heading">
          {heading}
        </h2>
        {resumeHref ? (
          <a
            className="desk-work-resume"
            href={resumeHref}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
            <DownloadIcon />
          </a>
        ) : null}
      </div>
      <div
        ref={railRef}
        className="desk-work-rail-scroller"
        tabIndex={0}
        aria-label={label}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={beginDrag}
        onClickCapture={(event) => {
          if (railRef.current?.getAttribute('data-suppress-click') === '1') {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <ul className="desk-work-track">
          {children ??
            cards?.map((card) => (
              <li key={card.slug} className="desk-work-track-item">
                <DeskWalkmanCard card={card} />
              </li>
            ))}
        </ul>
      </div>

      <div className="desk-rail-controls">
        <div className="desk-rail-hint">
          <span className="desk-rail-hint-item">
            <DragIcon />
            Drag
          </span>
          <div className="desk-rail-buttons">
            <button
              type="button"
              className="desk-rail-btn"
              aria-label={`Previous ${stepLabel}`}
              disabled={atStart}
              onClick={() => step(-1)}
            >
              <ArrowIcon dir="left" />
            </button>
            <button
              type="button"
              className="desk-rail-btn"
              aria-label={`Next ${stepLabel}`}
              disabled={atEnd}
              onClick={() => step(1)}
            >
              <ArrowIcon dir="right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
