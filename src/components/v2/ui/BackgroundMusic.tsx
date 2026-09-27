'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const SRC = '/assets/event-horizon.mp3';
const FULL = 0.1;
const QUIET = 0.02;
const SCROLL_FADE_MS = 1800;
const STUDY_FADE_MS = 2200;

const WAVE =
  'M0 8C1 7.6 2 7.17 3 6.79C4 6.42 5 6.06 6 5.77C7 5.49 8 5.24 9 5.09C10 4.94 11 4.85 12 4.85C13 4.85 14 4.94 15 5.09C16 5.24 17 5.49 18 5.77C19 6.06 20 6.42 21 6.79C22 7.17 23 7.6 24 8C25 8.4 26 8.83 27 9.21C28 9.58 29 9.94 30 10.23C31 10.51 32 10.76 33 10.91C34 11.06 35 11.15 36 11.15C37 11.15 38 11.06 39 10.91C40 10.76 41 10.51 42 10.23C43 9.94 44 9.58 45 9.21C46 8.83 47 8.4 48 8C49 7.6 50 7.17 51 6.79C52 6.42 53 6.06 54 5.77C55 5.49 56 5.24 57 5.09C58 4.94 59 4.85 60 4.85C61 4.85 62 4.94 63 5.09C64 5.24 65 5.49 66 5.77C67 6.06 68 6.42 69 6.79C70 7.17 71 7.6 72 8C73 8.4 74 8.83 75 9.21C76 9.58 77 9.94 78 10.23C79 10.51 80 10.76 81 10.91C82 11.06 83 11.15 84 11.15C85 11.15 86 11.06 87 10.91C88 10.76 89 10.51 90 10.23C91 9.94 92 9.58 93 9.21C94 8.83 95 8.4 96 8';

function isCaseStudy(pathname: string) {
  return /\/v2\/work\/[^/]+/.test(pathname);
}

function scrollOffset() {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function setVolume(audio: HTMLAudioElement, value: number) {
  const next = Math.min(1, Math.max(0, value));
  try {
    audio.volume = next;
  } catch {
    /* Safari rejects volume changes until playback is allowed. */
  }
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

let sharedAudio: HTMLAudioElement | null = null;
let userStopped = false;

function isField(node: EventTarget | null) {
  if (!(node instanceof HTMLElement)) return false;
  if (node.isContentEditable) return true;
  const tag = node.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

function isTypingTarget(target: EventTarget | null) {
  return isField(target) || isField(document.activeElement);
}

function isMuteShortcut(event: KeyboardEvent) {
  if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return false;
  if (event.key !== 'm' && event.key !== 'M') return false;
  return !isTypingTarget(event.target);
}

function siteAudio() {
  if (!sharedAudio) {
    const existing = document.getElementById('v2-site-audio');
    if (existing instanceof HTMLAudioElement) {
      sharedAudio = existing;
    } else {
      sharedAudio = new Audio(SRC);
      sharedAudio.volume = FULL;
    }
    sharedAudio.loop = true;
    sharedAudio.preload = 'auto';
  }
  return sharedAudio;
}

/** Looping site music. On until the floater is pressed. */
export function BackgroundMusic() {
  const pathname = usePathname() ?? '';
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const enabledRef = useRef(!userStopped);
  const pathnameRef = useRef(pathname);
  const targetRef = useRef(FULL);
  const rafRef = useRef(0);
  const quietRef = useRef(false);
  const playRef = useRef<(fadeIn?: boolean) => void>(() => {});
  const fadeOutRef = useRef<() => void>(() => {});
  const firstPathRef = useRef(true);
  const toggleRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(() => Boolean(sharedAudio && !sharedAudio.paused && !userStopped));

  pathnameRef.current = pathname;

  useLayoutEffect(() => {
    const audio = siteAudio();
    audioRef.current = audio;

    const stopRamp = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };

    const restingLevel = () => {
      const y = scrollOffset();
      if (quietRef.current) {
        if (y < 32) quietRef.current = false;
      } else if (y > 96) {
        quietRef.current = true;
      }
      return quietRef.current ? QUIET : FULL;
    };

    let fadeToken = 0;

    const fadeTo = (target: number, duration: number, onDone?: () => void) => {
      const node = audioRef.current;
      if (!node || !enabledRef.current) return;
      if (Math.abs(targetRef.current - target) < 0.0008) {
        if (rafRef.current) return;
        if (Math.abs(node.volume - target) < 0.004) {
          onDone?.();
          return;
        }
      }
      const token = ++fadeToken;
      targetRef.current = target;
      const from = node.volume;
      if (duration <= 0 || Math.abs(from - target) < 0.0008) {
        stopRamp();
        setVolume(node, target);
        onDone?.();
        return;
      }

      stopRamp();
      const start = performance.now();
      const tick = (now: number) => {
        if (token !== fadeToken) return;
        const current = audioRef.current;
        if (!current || !enabledRef.current) return;
        const t = Math.min(1, (now - start) / duration);
        setVolume(current, from + (target - from) * smoothstep(t));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        rafRef.current = 0;
        onDone?.();
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const fadeOut = () => {
      fadeTo(0, STUDY_FADE_MS, () => {
        // Stay playing at silence. pause() here makes the next play() need a
        // fresh gesture, so the homepage comes back muted.
        const node = audioRef.current;
        if (!node || userStopped) return;
        if (node.paused) node.play().catch(() => {});
        if (!isCaseStudy(pathnameRef.current)) fadeTo(restingLevel(), SCROLL_FADE_MS);
      });
    };

    const playNow = (fadeIn = false) => {
      if (userStopped || !enabledRef.current) return;
      const study = isCaseStudy(pathnameRef.current);
      const next = study ? 0 : restingLevel();
      const swell = () => {
        if (fadeIn && !study) fadeTo(next, SCROLL_FADE_MS);
      };
      if (!audio.paused) {
        setPlaying(!study);
        fadeTo(next, study ? STUDY_FADE_MS : SCROLL_FADE_MS);
        return;
      }
      setVolume(audio, fadeIn ? 0 : next);
      let pending: Promise<void>;
      try {
        pending = audio.play();
      } catch {
        setPlaying(false);
        return;
      }
      pending.then(() => {
        setPlaying(!audio.paused);
        swell();
      }).catch((error: unknown) => {
        setPlaying(!audio.paused);
        const blocked = error instanceof DOMException && error.name === 'NotAllowedError';
        if (blocked || userStopped || !audio.paused) return;
        window.setTimeout(() => {
          if (!userStopped && audio.paused) playNow(false);
        }, 250);
      });
    };

    const onScroll = () => {
      if (!enabledRef.current || audio.paused) return;
      if (isCaseStudy(pathnameRef.current)) {
        if (targetRef.current !== 0) fadeOut();
        return;
      }
      fadeTo(restingLevel(), SCROLL_FADE_MS);
    };

    playRef.current = playNow;
    fadeOutRef.current = fadeOut;

    let resumeBurst = 0;
    let lastResume = 0;

    const syncPlaying = () => {
      const node = audioRef.current;
      if (node) setPlaying(!node.paused);
    };

    const onPause = () => {
      syncPlaying();
      if (userStopped) return;
      const now = performance.now();
      resumeBurst = now - lastResume < 500 ? resumeBurst + 1 : 0;
      if (resumeBurst > 6) return;
      lastResume = now;
      window.setTimeout(() => {
        if (userStopped || !audio.paused) return;
        // Resume the same element. playNow() would retarget the volume and
        // undo a fade that is already in flight.
        audio.play().catch(() => {});
      }, 80);
    };

    const retryIfPaused = () => {
      if (userStopped || !audio.paused) return;
      playNow(false);
    };

    audio.addEventListener('play', syncPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('canplay', retryIfPaused);
    const level = isCaseStudy(pathnameRef.current) ? 0 : restingLevel();
    targetRef.current = level;
    setVolume(audio, level);
    if (userStopped) {
      enabledRef.current = false;
      if (!audio.paused) audio.pause();
      setPlaying(false);
    } else if (audio.paused) {
      playNow(false);
    } else {
      setPlaying(true);
    }

    const onStudyClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const href = target.closest('a')?.getAttribute('href') ?? '';
      if (!/\/v2\/work\/[^/?#]+/.test(href)) return;
      fadeOut();
    };

    window.addEventListener('pointerdown', onUnlock, true);
    window.addEventListener('keydown', onUnlock, true);
    window.addEventListener('keydown', onMuteKey);
    window.addEventListener('click', onStudyClick, true);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('v2-lenis-scroll', onScroll);
    window.addEventListener('load', retryIfPaused);
    window.addEventListener('pageshow', retryIfPaused);

    function onUnlock(event: Event) {
      if (event instanceof KeyboardEvent && isMuteShortcut(event)) return;
      if (!enabledRef.current || !audio.paused) return;
      const target = event.target;
      if (target instanceof Element && target.closest('.v2-sound-floater')) return;
      playNow(false);
    }

    function onMuteKey(event: KeyboardEvent) {
      if (!isMuteShortcut(event)) return;
      event.preventDefault();
      toggleRef.current();
    }

    return () => {
      window.removeEventListener('pointerdown', onUnlock, true);
      window.removeEventListener('keydown', onUnlock, true);
      window.removeEventListener('keydown', onMuteKey);
      window.removeEventListener('click', onStudyClick, true);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('v2-lenis-scroll', onScroll);
      window.removeEventListener('load', retryIfPaused);
      window.removeEventListener('pageshow', retryIfPaused);
      audio.removeEventListener('play', syncPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('canplay', retryIfPaused);
      stopRamp();
    };
  }, []);

  useEffect(() => {
    if (firstPathRef.current) {
      firstPathRef.current = false;
      return;
    }
    if (!audioRef.current || !enabledRef.current) return;
    if (isCaseStudy(pathname)) {
      fadeOutRef.current();
      return;
    }
    playRef.current(true);
  }, [pathname]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      userStopped = true;
      enabledRef.current = false;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      audio.pause();
      return;
    }
    userStopped = false;
    enabledRef.current = true;
    playRef.current(false);
  };

  toggleRef.current = toggle;

  return (
    <>
      {isCaseStudy(pathname) ? null : (
        <button
          type="button"
          className="v2-sound-floater"
          data-playing={playing ? 'true' : 'false'}
          aria-pressed={playing}
          aria-keyshortcuts="M"
          aria-label={playing ? 'Turn background music off' : 'Turn background music on'}
          onClick={toggle}
        >
          <span className="v2-sound-wave" aria-hidden="true">
            <svg viewBox="0 0 96 16" fill="none">
              <path d={WAVE} />
            </svg>
          </span>
          <kbd className="v2-sound-key" aria-hidden="true">
            M
          </kbd>
        </button>
      )}
    </>
  );
}
