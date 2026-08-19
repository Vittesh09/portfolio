'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';

/** Gentle momentum scroll on fine-pointer desktops only (native scroll on mobile). */
export function useLenisSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let cancelled = false;
    let lenis: Lenis | null = null;
    const onLenisScroll = (instance: Lenis) => {
      window.dispatchEvent(
        new CustomEvent('v2-lenis-scroll', { detail: { velocity: instance.velocity } })
      );
    };

    void import('lenis').then(({ default: LenisCtor }) => {
      if (cancelled) return;
      lenis = new LenisCtor({
        lerp: 0.085,
        wheelMultiplier: 0.92,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: true,
        anchors: {
          offset: 60,
          lerp: 0.12
        }
      });
      lenis.on('scroll', onLenisScroll);
      document.documentElement.classList.add('v2-smooth-scroll');
    });

    return () => {
      cancelled = true;
      if (lenis) {
        lenis.off('scroll', onLenisScroll);
        lenis.destroy();
      }
      document.documentElement.classList.remove('v2-smooth-scroll');
    };
  }, [enabled]);
}
