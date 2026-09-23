'use client';

import { useEffect, useState } from 'react';

function readMobile() {
  return (
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

/**
 * True for narrow viewports or coarse pointers.
 * Always false on the server and the first client render so SSR HTML matches.
 */
export function useMobileLanding() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const sync = () => setIsMobile(readMobile());
    sync();
    const widthQuery = window.matchMedia('(max-width: 768px)');
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    widthQuery.addEventListener('change', sync);
    coarseQuery.addEventListener('change', sync);
    return () => {
      widthQuery.removeEventListener('change', sync);
      coarseQuery.removeEventListener('change', sync);
    };
  }, []);

  return isMobile;
}
