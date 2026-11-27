'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/** Always India time, whatever the visitor's own zone. */
const IST = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23'
});

/**
 * HH:MM:SS where each digit swaps on its own: the old one lifts away into a blur,
 * the new one settles in from below, the same blur-and-lift the page copy enters
 * with. Only digits that change move, so seconds tick softly and a new minute or
 * hour ripples through just the places that roll over.
 */
/*
 * Slow, overlapping cross-dissolve: the old digit drifts up and softens away while
 * the new one, starting a beat later, drifts up out of a blur and settles. Small
 * travel and a symmetric ease keep it calm; the whole swap is about a second,
 * comfortably inside the 2s tick.
 */
const DIGIT_OUT = { duration: 0.55, ease: [0.4, 0, 0.6, 1] as const };
const DIGIT_IN = { duration: 0.85, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as const };

function FooterClock({ time }: { time: string }) {
  const reduce = useReducedMotion();
  return (
    <time className="desk-foot-clock">
      {time.split('').map((char, i) =>
        char === ':' ? (
          <span key={`sep-${i}`} className="desk-foot-clock-sep">
            :
          </span>
        ) : (
          <span key={`slot-${i}`} className="desk-foot-clock-slot">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={char}
                className="desk-foot-clock-digit"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: '0.18em', filter: 'blur(4px)' }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: reduce ? { duration: 0.2 } : DIGIT_IN
                }}
                exit={{
                  opacity: 0,
                  ...(reduce ? {} : { y: '-0.18em', filter: 'blur(4px)' }),
                  transition: reduce ? { duration: 0.2 } : DIGIT_OUT
                }}
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        )
      )}
    </time>
  );
}

/** How often the clock updates. */
const TICK_MS = 2000;

function useIndiaTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    let timer = 0;
    // Tick every 2 seconds, on even-second boundaries, so the digit swap reads as
    // calm rather than rapid and still lands in step with the real clock.
    const tick = () => {
      setTime(IST.format(new Date()));
      timer = window.setTimeout(tick, TICK_MS - (Date.now() % TICK_MS) + 5);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);
  return time;
}

export function DeskFooterMeta() {
  const pathname = usePathname() || '';
  const isLanding = pathname === '/';
  const time = useIndiaTime();

  // Ink-and-aurora quote: a soft lens of colour follows the pointer near the quote,
  // and sweeps across once by itself whenever the quote scrolls into view.
  const quoteRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const quote = quoteRef.current;
    if (!quote) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /** How close (px) the pointer must come to the quote for the lens to open. */
    const NEAR = 56;
    const SWEEP_MS = 2600;
    const SWEEP_COOLDOWN_MS = 6000;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let placed = false;
    let lensOn = false;
    let pointerNear = false;
    let sweepRaf = 0;
    let lastSweep = -Infinity;
    let touchTimer = 0;

    // "heart" — measured so its own fill lines up with the words around it.
    const heart = quote.querySelector<HTMLElement>(':scope > .desk-foot-quote-seg .desk-foot-quote-heart');
    const HEART_NEAR = 36;
    let beating = false;
    let stopBeat = false;
    let beatTimer = 0;
    const measure = () => {
      if (!heart) return;
      quote.style.setProperty('--hx', `${heart.offsetLeft}px`);
      quote.style.setProperty('--hy', `${heart.offsetTop}px`);
      quote.style.setProperty('--qw', `${quote.clientWidth}px`);
      quote.style.setProperty('--qh', `${quote.clientHeight}px`);
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(quote);
    void document.fonts?.ready.then(measure);

    const setBeat = (on: boolean) => {
      if (on) {
        stopBeat = false;
        if (beating) return;
        beating = true;
        quote.setAttribute('data-beat', 'on');
        return;
      }
      if (!beating) return;
      // Finish the current beat (it ends at rest), unless nothing is animating.
      if (reduce) {
        beating = false;
        quote.removeAttribute('data-beat');
      } else {
        stopBeat = true;
      }
    };
    const onBeatEnd = () => {
      if (!stopBeat) return;
      stopBeat = false;
      beating = false;
      quote.removeAttribute('data-beat');
    };
    heart?.addEventListener('animationiteration', onBeatEnd);
    const nearHeart = (clientX: number, clientY: number) => {
      if (!heart) return false;
      const h = heart.getBoundingClientRect();
      return (
        clientX > h.left - HEART_NEAR &&
        clientX < h.right + HEART_NEAR &&
        clientY > h.top - HEART_NEAR &&
        clientY < h.bottom + HEART_NEAR
      );
    };

    const write = () => {
      quote.style.setProperty('--mx', `${cx.toFixed(1)}px`);
      quote.style.setProperty('--my', `${cy.toFixed(1)}px`);
    };
    const setLens = (on: boolean) => {
      if (on === lensOn) return;
      lensOn = on;
      if (on) quote.setAttribute('data-lens', 'on');
      else quote.removeAttribute('data-lens');
    };
    const follow = () => {
      const k = reduce ? 1 : 0.2;
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      write();
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3 ? requestAnimationFrame(follow) : 0;
    };
    const stopSweep = () => {
      if (sweepRaf) cancelAnimationFrame(sweepRaf);
      sweepRaf = 0;
    };

    const aim = (clientX: number, clientY: number) => {
      const r = quote.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;
      const near = x > -NEAR && x < r.width + NEAR && y > -NEAR && y < r.height + NEAR;
      pointerNear = near;
      setBeat(nearHeart(clientX, clientY));
      if (!near) {
        if (!sweepRaf) setLens(false);
        return;
      }
      stopSweep();
      tx = Math.min(r.width + 24, Math.max(-24, x));
      ty = Math.min(r.height + 16, Math.max(-16, y));
      if (!placed || !lensOn) {
        // Open where the pointer is, rather than gliding in from the last spot.
        cx = tx;
        cy = ty;
        placed = true;
        write();
      }
      setLens(true);
      if (!raf) raf = requestAnimationFrame(follow);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') aim(event.clientX, event.clientY);
    };
    // Touch: the lens blooms where the finger lands on the quote, then fades.
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return;
      window.clearTimeout(touchTimer);
      window.clearTimeout(beatTimer);
      aim(event.clientX, event.clientY);
      if (pointerNear) {
        touchTimer = window.setTimeout(() => {
          pointerNear = false;
          if (!sweepRaf) setLens(false);
        }, 900);
      }
      // A tap on "heart" beats it a few times.
      if (beating) beatTimer = window.setTimeout(() => setBeat(false), 2600);
    };
    const onLeaveWindow = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.relatedTarget) return;
      pointerNear = false;
      setBeat(false);
      if (!sweepRaf) setLens(false);
    };

    // One unprompted pass of the lens across the words (left to right, a soft arc).
    const sweep = () => {
      if (reduce || pointerNear || sweepRaf) return;
      const now = performance.now();
      if (now - lastSweep < SWEEP_COOLDOWN_MS) return;
      lastSweep = now;
      const r = quote.getBoundingClientRect();
      const start = performance.now();
      cancelAnimationFrame(raf);
      raf = 0;
      setLens(true);
      const frame = (t: number) => {
        const p = Math.min(1, (t - start) / SWEEP_MS);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        cx = -40 + (r.width + 80) * e;
        cy = r.height * (0.5 - 0.22 * Math.sin(e * Math.PI * 2));
        tx = cx;
        ty = cy;
        placed = true;
        write();
        if (p < 1) {
          sweepRaf = requestAnimationFrame(frame);
        } else {
          sweepRaf = 0;
          if (!pointerNear) setLens(false);
        }
      };
      sweepRaf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        quote.setAttribute('data-live', visible ? 'true' : 'false');
        if (visible && entry.intersectionRatio >= 0.6) window.setTimeout(sweep, 350);
      },
      { threshold: [0, 0.6] }
    );
    io.observe(quote);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveWindow);
    return () => {
      io.disconnect();
      resize.disconnect();
      heart?.removeEventListener('animationiteration', onBeatEnd);
      window.clearTimeout(beatTimer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
      window.clearTimeout(touchTimer);
      cancelAnimationFrame(raf);
      stopSweep();
    };
  }, [isLanding]);

  const label = time ? `India, Earth, ${time}` : 'India, Earth';

  return (
    <div className="desk-foot-meta-wrap">
      {isLanding ? (
        <p ref={quoteRef} className="desk-foot-quote" data-live="false">
          <span className="desk-foot-quote-seg">
            Experience is at the <span className="desk-foot-quote-heart">heart</span> of being human.
          </span>{' '}
          <span className="desk-foot-quote-seg">I try to make it better everyday.</span>
          {/* Same words, same wrapping, painted in the aurora and masked to the lens. */}
          <span className="desk-foot-quote-aurora" aria-hidden="true">
            <span className="desk-foot-quote-seg">
            Experience is at the <span className="desk-foot-quote-heart">heart</span> of being human.
          </span>{' '}
            <span className="desk-foot-quote-seg">I try to make it better everyday.</span>
          </span>
        </p>
      ) : null}
      <p className="desk-foot-meta" aria-label={label}>
        <svg
          className="desk-foot-pin"
          viewBox="0 0 16 16"
          width="11"
          height="11"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M8 1C5.24 1 3 3.24 3 6c0 3.55 4.15 8.35 4.55 8.8a.6.6 0 0 0 .9 0C8.85 14.35 13 9.55 13 6c0-2.76-2.24-5-5-5Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
          />
        </svg>
        <span aria-hidden="true">India, Earth</span>
        <span className="desk-foot-dot" aria-hidden="true">·</span>
        {/* Fixed-width, equal-width digits: the line never shifts as the seconds tick. */}
        <span className="desk-foot-time" aria-hidden="true" data-pending={time ? undefined : 'true'}>
          <FooterClock time={time || '00:00:00'} />
        </span>
      </p>
    </div>
  );
}
