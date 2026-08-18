'use client';

const cache = new Map<string, HTMLAudioElement>();

function getAudio(src: string) {
  let audio = cache.get(src);
  if (!audio) {
    audio = new Audio(src);
    audio.preload = 'auto';
    cache.set(src, audio);
  }
  return audio;
}

/** Fire-and-forget UI sound. Safe to call from click handlers. */
export function playUiSound(src: string, volume = 0.2) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    const audio = getAudio(src);
    audio.volume = volume;
    audio.currentTime = 0;
    void audio.play().catch(() => {
      /* autoplay / gesture policies — ignore */
    });
  } catch {
    /* ignore */
  }
}

export const COPY_EMAIL_SOUND = '/assets/copyemail.mp3';
export const MENU_CLICK_SOUND = '/assets/menu-click.wav';
