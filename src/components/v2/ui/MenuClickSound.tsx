'use client';

import { useEffect } from 'react';
import { MENU_CLICK_SOUND, playUiSound, preloadUiSound } from '@/src/components/v2/ui/playUiSound';

const MENU_CLICK_VOLUME = 0.3;

const ACTION_SELECTOR = [
  'a[href]',
  'button',
  'summary',
  '[role="button"]',
  '[role="link"]',
  '[role="tab"]',
  '[role="menuitem"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'input[type="checkbox"]',
  'input[type="radio"]'
].join(', ');

function isActionClick(event: MouseEvent) {
  if (event.button !== 0) return false;
  const target = event.target;
  if (!(target instanceof Element)) return false;
  const control = target.closest(ACTION_SELECTOR);
  if (!control) return false;
  if (control instanceof HTMLButtonElement && control.disabled) return false;
  if (control instanceof HTMLInputElement && control.disabled) return false;
  if (control.getAttribute('aria-disabled') === 'true') return false;
  if (control.closest('[data-sound="copy-email"]')) return false;
  return true;
}

/** Plays menu-click.wav when a control is activated, not on empty space or text. */
export function MenuClickSound() {
  useEffect(() => {
    preloadUiSound(MENU_CLICK_SOUND);

    const onClick = (event: MouseEvent) => {
      if (!isActionClick(event)) return;
      playUiSound(MENU_CLICK_SOUND, MENU_CLICK_VOLUME);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
