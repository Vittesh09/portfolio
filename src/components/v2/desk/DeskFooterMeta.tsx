'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  const text = allowed
    ? `${country ? `${country}, ` : ''}Earth · ${time || formatLocalTime(new Date())}`
    : 'Earth, Milkyway';

  return (
    <div className="desk-foot-meta-wrap">
      {isLanding ? (
        <p className="desk-foot-quote">
          <span className="desk-foot-quote-seg">Experience is at the heart of being human.</span>{' '}
          <span className="desk-foot-quote-seg">I try to make it better everyday.</span>
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
