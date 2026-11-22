'use client';

/*
 * UI sounds go through the Web Audio API: a decoded AudioBuffer starts within a few
 * milliseconds of the call. <audio> elements (the old path) take tens to hundreds of
 * milliseconds to start, worst on iOS, which is what made taps sound late. The
 * <audio> path stays only as a fallback until a buffer is decoded, or where Web Audio
 * is missing.
 */

type Ctx = AudioContext;

let ctx: Ctx | null = null;
let unlockBound = false;
const buffers = new Map<string, AudioBuffer>();
/** Where audible sound starts in each buffer (skips MP3 encoder padding). */
const offsets = new Map<string, number>();
const loading = new Map<string, Promise<void>>();
const fallbacks = new Map<string, HTMLAudioElement>();

function getContext(): Ctx | null {
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor({ latencyHint: 'interactive' });
  } catch {
    return null;
  }
  bindUnlock();
  return ctx;
}

/**
 * Browsers start an AudioContext suspended until a user gesture. Resume it on the
 * first gesture of any kind (pointerup/touchend/keydown count as activation on iOS;
 * pointerdown does for mice), so it is already running when the click sound fires.
 */
function bindUnlock() {
  if (unlockBound) return;
  unlockBound = true;
  const events = ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click'] as const;
  const unlock = () => {
    if (!ctx) return;
    if (ctx.state !== 'running') {
      void ctx.resume().catch(() => {});
      return;
    }
    for (const type of events) document.removeEventListener(type, unlock, true);
  };
  for (const type of events) document.addEventListener(type, unlock, true);
}

function firstAudibleSecond(buffer: AudioBuffer) {
  const threshold = 0.004;
  let first = buffer.length;
  for (let c = 0; c < buffer.numberOfChannels; c += 1) {
    const data = buffer.getChannelData(c);
    const limit = Math.min(first, data.length);
    for (let i = 0; i < limit; i += 1) {
      if (Math.abs(data[i]) > threshold) {
        first = i;
        break;
      }
    }
  }
  if (first >= buffer.length) return 0;
  // Keep a hair of lead-in so the attack is not clipped.
  return Math.max(0, first - 32) / buffer.sampleRate;
}

function load(src: string) {
  const existing = loading.get(src);
  if (existing) return existing;
  const context = getContext();
  if (!context) return Promise.resolve();
  const task = fetch(src)
    .then((res) => {
      if (!res.ok) throw new Error(`sound ${res.status}`);
      return res.arrayBuffer();
    })
    .then(
      (bytes) =>
        new Promise<AudioBuffer>((resolve, reject) => {
          // Callback form too: older Safari has no promise-returning decodeAudioData.
          const result = context.decodeAudioData(bytes, resolve, reject);
          if (result && typeof result.then === 'function') result.then(resolve, reject);
        })
    )
    .then((buffer) => {
      buffers.set(src, buffer);
      offsets.set(src, firstAudibleSecond(buffer));
    })
    .catch(() => {
      // Let a later call retry.
      loading.delete(src);
    });
  loading.set(src, task);
  return task;
}

function fallbackAudio(src: string) {
  let audio = fallbacks.get(src);
  if (!audio) {
    audio = new Audio(src);
    audio.preload = 'auto';
    fallbacks.set(src, audio);
  }
  return audio;
}

export function preloadUiSound(src: string) {
  if (typeof window === 'undefined') return;
  if (getContext()) void load(src);
  else fallbackAudio(src);
}

/** Fire-and-forget UI sound. Safe to call from any event handler. */
export function playUiSound(src: string, volume = 0.2) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    const context = getContext();
    const buffer = buffers.get(src);
    if (context && buffer) {
      if (context.state !== 'running') void context.resume().catch(() => {});
      const source = context.createBufferSource();
      source.buffer = buffer;
      const gain = context.createGain();
      gain.gain.value = volume;
      source.connect(gain).connect(context.destination);
      source.start(0, offsets.get(src) ?? 0);
      return;
    }
    // Not decoded yet (or no Web Audio): start decoding for next time and play this
    // one through <audio> so the gesture is never silent.
    if (context) void load(src);
    const audio = fallbackAudio(src);
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
