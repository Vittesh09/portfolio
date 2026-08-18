'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/** Gentle momentum scroll on fine-pointer desktops only (native scroll on mobile). */
export function useLenisSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Touch / coarse pointers: keep native scroll. Lenis can fight mobile browsers.
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const lenis = new Lenis({
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

    // Keep sticky chrome (header) in sync while Lenis interpolates scroll
    const onLenisScroll = (instance: Lenis) => {
      window.dispatchEvent(
        new CustomEvent('v2-lenis-scroll', { detail: { velocity: instance.velocity } })
      );
    };
    lenis.on('scroll', onLenisScroll);

    document.documentElement.classList.add('v2-smooth-scroll');

    return () => {
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
      document.documentElement.classList.remove('v2-smooth-scroll');
    };
  }, [enabled]);
}
