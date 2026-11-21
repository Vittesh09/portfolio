'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject
} from 'react';
import { useMotionValue, useSpring } from 'motion/react';

/** Receives horizontal wheel delta (px). Returns false if it could not move (at an edge). */
type HorizontalHandler = (dx: number) => boolean;

type DeskScrollApi = {
  /** Register a horizontal scroller; wheel gestures that start still on it are routed here. */
  registerHorizontal: (el: HTMLElement, handler: HorizontalHandler) => () => void;
  scrollerRef: RefObject<HTMLDivElement | null>;
};

const DeskScrollContext = createContext<DeskScrollApi | null>(null);

export function useDeskScroll() {
  return useContext(DeskScrollContext);
}

/** A wheel gesture ends after this much silence; trackpad momentum keeps it alive. */
const GESTURE_GAP_MS = 140;
/**
 * An event is "clearly" on one axis when it beats the other by this ratio and moves
 * at least INTENT_PX. Clear events may switch the lock mid-gesture; diagonal noise
 * keeps whatever lock is active, so the page never wobbles between axes.
 */
const AXIS_RATIO = 1.6;
const INTENT_PX = 2;

const SCROLL_SPRING = { stiffness: 210, damping: 34, mass: 0.7, restDelta: 0.4 };

function wheelPixels(event: WheelEvent, page: number) {
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? page : 1;
  return { dx: event.deltaX * unit, dy: event.deltaY * unit };
}

/**
 * Desk page scroller. Vertical wheel motion is eased with a framer-motion spring.
 * Each wheel event is assigned to one axis. Over a registered horizontal scroller
 * (the work rail) a clearly sideways swipe moves the rail, even right after a
 * vertical flick whose momentum is still arriving; vertical momentum is pure dy,
 * so it can never be mistaken for a sideways swipe, and a clearly vertical move
 * hands control straight back to the page.
 */
export function DeskSmoothScroll({
  children,
  resetKey
}: {
  children: ReactNode;
  /** Changing this snaps the scroll back to the top (e.g. on route change). */
  resetKey?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handlers = useRef(new Map<HTMLElement, HorizontalHandler>());

  const target = useMotionValue(0);
  const smooth = useSpring(target, SCROLL_SPRING);

  const registerHorizontal = useCallback((el: HTMLElement, handler: HorizontalHandler) => {
    handlers.current.set(el, handler);
    return () => {
      handlers.current.delete(el);
    };
  }, []);
  const api = useMemo(
    () => ({ registerHorizontal, scrollerRef: wrapperRef }),
    [registerHorizontal]
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrowMq = window.matchMedia('(max-width: 768px)');
    const coarseMq = window.matchMedia('(pointer: coarse)');
    // Live check — phones/narrow viewports keep native touch; spring writes fight momentum.
    const useNative = () => narrowMq.matches || coarseMq.matches;

    const unsubscribe = smooth.on('change', (value) => {
      if (useNative()) return;
      wrapper.scrollTop = value;
    });

    const maxScroll = () => Math.max(0, wrapper.scrollHeight - wrapper.clientHeight);

    let lock: 'vertical' | 'horizontal' | null = null;
    let lockRail: HorizontalHandler | null = null;
    let lastWheelAt = 0;

    const railUnder = (node: EventTarget | null) => {
      if (!(node instanceof Node)) return null;
      for (const [el, handler] of handlers.current) {
        if (el.contains(node)) return handler;
      }
      return null;
    };

    const onWheel = (event: WheelEvent) => {
      if (useNative()) return;
      if (event.ctrlKey) return;
      const origin = event.target as Element | null;
      // The singularity grab proxy is fixed outside the scroller but must still scroll the page.
      if (!origin || !(wrapper.contains(origin) || origin.closest?.('.bh-grab'))) return;
      const now = performance.now();
      if (now - lastWheelAt > GESTURE_GAP_MS) {
        lock = null;
        lockRail = null;
      }
      lastWheelAt = now;

      const { dx: rawDx, dy: rawDy } = wheelPixels(event, wrapper.clientHeight);
      // Shift + mouse wheel means sideways.
      const dx = rawDx !== 0 ? rawDx : event.shiftKey ? rawDy : 0;
      const dy = event.shiftKey && rawDx === 0 ? 0 : rawDy;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      const clearlySideways = ax >= INTENT_PX && ax > ay * AXIS_RATIO;
      const clearlyVertical = ay >= INTENT_PX && ay > ax * AXIS_RATIO;

      if (clearlySideways && lock !== 'horizontal') {
        const rail = railUnder(event.target);
        if (rail) {
          lock = 'horizontal';
          lockRail = rail;
        } else if (!lock) {
          lock = 'vertical';
        }
      } else if (clearlyVertical && lock !== 'vertical') {
        lock = 'vertical';
        lockRail = null;
      } else if (!lock) {
        // Tiny or diagonal first event: follow whichever axis it leans to.
        const rail = ax > ay ? railUnder(event.target) : null;
        lock = rail ? 'horizontal' : 'vertical';
        lockRail = rail;
      }

      if (lock === 'horizontal' && lockRail) {
        event.preventDefault();
        lockRail(dx);
        return;
      }

      event.preventDefault();
      if (dy === 0) return;
      const next = Math.min(maxScroll(), Math.max(0, target.get() + dy));
      if (reduceMq.matches) {
        target.jump(next);
        smooth.jump(next);
      } else {
        target.set(next);
      }
    };

    // Keyboard, scrollbar, touch and anchors scroll natively; re-seat the spring there.
    const onScroll = () => {
      if (useNative()) {
        target.jump(wrapper.scrollTop);
        smooth.jump(wrapper.scrollTop);
        return;
      }
      if (smooth.isAnimating() || Math.abs(wrapper.scrollTop - smooth.get()) < 1.5) return;
      target.jump(wrapper.scrollTop);
      smooth.jump(wrapper.scrollTop);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    wrapper.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener('wheel', onWheel);
      wrapper.removeEventListener('scroll', onScroll);
    };
  }, [smooth, target]);

  useEffect(() => {
    target.jump(0);
    smooth.jump(0);
    if (wrapperRef.current) wrapperRef.current.scrollTop = 0;
  }, [resetKey, smooth, target]);

  return (
    <DeskScrollContext.Provider value={api}>
      <div ref={wrapperRef} className="desk-scroll">
        <div ref={contentRef} className="desk-scroll-content">
          {children}
        </div>
      </div>
    </DeskScrollContext.Provider>
  );
}
