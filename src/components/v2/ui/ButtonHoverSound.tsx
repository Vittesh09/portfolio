'use client';

import { useEffect } from 'react';
import { HOVER_SOUND, playUiSound, preloadUiSound } from '@/src/components/v2/ui/playUiSound';

const HOVER_VOLUME = 0.3;

const BUTTON_SELECTOR = [
  'button',
  '[role="button"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'nav a[href]'
].join(', ');

function buttonFrom(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const control = target.closest(BUTTON_SELECTOR);
  if (!control) return null;
  if (control instanceof HTMLButtonElement && control.disabled) return null;
  if (control instanceof HTMLInputElement && control.disabled) return null;
  if (control.getAttribute('aria-disabled') === 'true') return null;
  return control;
}

/** Plays hover.mp3 when the pointer enters a button or a navigation link. */
export function ButtonHoverSound() {
  useEffect(() => {
    preloadUiSound(HOVER_SOUND);

    const onOver = (event: MouseEvent) => {
      const control = buttonFrom(event.target);
      if (!control) return;
      const related = event.relatedTarget;
      if (related instanceof Node && control.contains(related)) return;
      playUiSound(HOVER_SOUND, HOVER_VOLUME);
    };

    document.addEventListener('mouseover', onOver, true);
    return () => document.removeEventListener('mouseover', onOver, true);
  }, []);

  return null;
}
