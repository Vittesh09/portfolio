'use client';

import { useEffect, useState } from 'react';

type IndiaTimeProps = {
  className?: string;
};

export function IndiaTime({ className = '' }: IndiaTimeProps) {
  const [label, setLabel] = useState('IST');

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const tick = () => setLabel(`${formatter.format(new Date())} IST`);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {label}
    </span>
  );
}
