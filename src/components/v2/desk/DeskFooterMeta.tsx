'use client';

import { useEffect, useState } from 'react';

const TIME_ZONE = 'Asia/Kolkata';

function formatIndiaTime(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

export function DeskFooterMeta() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(formatIndiaTime(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="desk-foot-meta-wrap">
      <p className="desk-foot-quote">
        Experience is at the heart of being human. I try to make it better everyday.
      </p>
      <p className="desk-foot-meta" aria-label={time ? `India, ${time}` : 'India'}>
        India{time ? ` · ${time}` : ''}
      </p>
    </div>
  );
}
