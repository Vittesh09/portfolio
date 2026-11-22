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

function actionControl(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const control = target.closest(ACTION_SELECTOR);
  if (!control) return null;
  if (control instanceof HTMLButtonElement && control.disabled) return null;
  if (control instanceof HTMLInputElement && control.disabled) return null;
  if (control.getAttribute('aria-disabled') === 'true') return null;
  if (control.closest('[data-sound="copy-email"]')) return null;
  return control;
}

/** Draggable areas: a press there may become a drag, so wait for the real click. */
const DRAG_AREA = '.desk-work-rail-scroller';

/** Plays menu-click.wav when a control is pressed, not on empty space or text. */
export function MenuClickSound() {
  useEffect(() => {
    // Keep the 87 KB click sound out of the page load: fetch it once the page is
    // loaded and idle, or on the first press if that comes sooner.
    let preloaded = false;
    let idle = 0;
    const preload = () => {
      if (preloaded) return;
      preloaded = true;
      preloadUiSound(MENU_CLICK_SOUND);
    };
    const preloadWhenIdle = () => {
      idle = window.requestIdleCallback?.(preload, { timeout: 4000 }) ?? 0;
      if (!idle) preload();
    };
    if (document.readyState === 'complete') preloadWhenIdle();
    else window.addEventListener('load', preloadWhenIdle, { once: true });
    document.addEventListener('pointerdown', preload, { capture: true, once: true });

    // Mouse: sound on press, like a physical button, instead of after release.
    // Touch/pen and keyboard: on click, because a touch press may turn into a scroll.
    let pressed: Element | null = null;
    let pressedAt = 0;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      const control = actionControl(event.target);
      if (!control || control.closest(DRAG_AREA)) return;
      pressed = control;
      pressedAt = performance.now();
      playUiSound(MENU_CLICK_SOUND, MENU_CLICK_VOLUME);
    };
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const control = actionControl(event.target);
      const pressedThis = pressed !== null && pressed === control && performance.now() - pressedAt < 2000;
      pressed = null;
      if (!control || pressedThis) return;
      // The click that ends a rail drag is swallowed by the rail; stay silent too.
      if (control.closest('[data-suppress-click="1"]')) return;
      playUiSound(MENU_CLICK_SOUND, MENU_CLICK_VOLUME);
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointerdown', preload, true);
      window.removeEventListener('load', preloadWhenIdle);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  return null;
}
