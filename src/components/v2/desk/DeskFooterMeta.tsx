'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function formatLocalTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

/** Common IANA zones → country, used when reverse geocode is unavailable. */
const ZONE_COUNTRY: Record<string, string> = {
  'Asia/Kolkata': 'India',
  'Asia/Calcutta': 'India',
  'Asia/Dubai': 'United Arab Emirates',
  'Asia/Singapore': 'Singapore',
  'Asia/Tokyo': 'Japan',
  'Asia/Seoul': 'South Korea',
  'Asia/Shanghai': 'China',
  'Asia/Hong_Kong': 'Hong Kong',
  'Asia/Bangkok': 'Thailand',
  'Asia/Jakarta': 'Indonesia',
  'Asia/Manila': 'Philippines',
  'Asia/Karachi': 'Pakistan',
  'Asia/Dhaka': 'Bangladesh',
  'Asia/Colombo': 'Sri Lanka',
  'Asia/Kathmandu': 'Nepal',
  'Europe/London': 'United Kingdom',
  'Europe/Paris': 'France',
  'Europe/Berlin': 'Germany',
  'Europe/Amsterdam': 'Netherlands',
  'Europe/Madrid': 'Spain',
  'Europe/Rome': 'Italy',
  'Europe/Zurich': 'Switzerland',
  'Europe/Stockholm': 'Sweden',
  'Europe/Dublin': 'Ireland',
  'America/New_York': 'United States',
  'America/Chicago': 'United States',
  'America/Denver': 'United States',
  'America/Los_Angeles': 'United States',
  'America/Toronto': 'Canada',
  'America/Vancouver': 'Canada',
  'America/Sao_Paulo': 'Brazil',
  'America/Mexico_City': 'Mexico',
  'Australia/Sydney': 'Australia',
  'Australia/Melbourne': 'Australia',
  'Pacific/Auckland': 'New Zealand',
  'Africa/Johannesburg': 'South Africa',
  'Africa/Cairo': 'Egypt',
  'Africa/Lagos': 'Nigeria'
};

function countryFromTimeZone(timeZone: string) {
  if (ZONE_COUNTRY[timeZone]) return ZONE_COUNTRY[timeZone];
  const parts = timeZone.split('/');
  if (parts[0] === 'America' && parts[1] === 'Argentina') return 'Argentina';
  if (parts[0] === 'America' && parts[1] === 'Indiana') return 'United States';
  if (parts[0] === 'America' && parts[1] === 'Kentucky') return 'United States';
  if (parts[0] === 'America' && parts[1] === 'North_Dakota') return 'United States';
  return null;
}

async function countryFromCoords(latitude: number, longitude: number) {
  const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('localityLanguage', 'en');
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = (await response.json()) as { countryName?: string };
  return data.countryName?.trim() || null;
}

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 600_000,
  timeout: 20_000
};

export function DeskFooterMeta() {
  const pathname = usePathname() || '';
  const isLanding = pathname === '/';
  const [time, setTime] = useState('');
  const [country, setCountry] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!('geolocation' in navigator)) return;

    const resolveCountry = async (position: GeolocationPosition) => {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fromZone = countryFromTimeZone(zone);
      if (!cancelled && fromZone) setCountry(fromZone);

      try {
        const fromCoords = await countryFromCoords(
          position.coords.latitude,
          position.coords.longitude
        );
        if (!cancelled && fromCoords) setCountry(fromCoords);
      } catch {
        // Keep timezone country if reverse geocode fails.
      }
    };

    const onSuccess = (position: GeolocationPosition) => {
      if (cancelled) return;
      setAllowed(true);
      void resolveCountry(position);
    };

    const onError = () => {
      if (cancelled) return;
      setAllowed(false);
      setCountry(null);
    };

    const request = () => {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, GEO_OPTIONS);
    };

    request();

    let permission: PermissionStatus | null = null;
    const onPermissionChange = () => {
      if (!permission || cancelled) return;
      if (permission.state === 'granted') request();
      if (permission.state === 'denied') onError();
    };

    if (navigator.permissions?.query) {
      void navigator.permissions
        .query({ name: 'geolocation' })
        .then((status) => {
          if (cancelled) return;
          permission = status;
          if (status.state === 'granted') request();
          status.addEventListener('change', onPermissionChange);
        })
        .catch(() => {
          // Permissions API unavailable — getCurrentPosition already ran.
        });
    }

    return () => {
      cancelled = true;
      permission?.removeEventListener('change', onPermissionChange);
    };
  }, []);

  useEffect(() => {
    if (!allowed) {
      setTime('');
      return;
    }
    const tick = () => setTime(formatLocalTime(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [allowed]);

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

  const text = allowed
    ? `${country ? `${country}, ` : ''}Earth · ${time || formatLocalTime(new Date())}`
    : 'Earth, Milkyway';

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
      <p className="desk-foot-meta" aria-label={text}>
        {allowed ? null : (
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
        )}
        <span>{text}</span>
      </p>
    </div>
  );
}
