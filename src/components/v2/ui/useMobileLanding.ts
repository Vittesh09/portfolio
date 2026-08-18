'use client';

import { useSyncExternalStore } from 'react';

function subscribeMobile(onStoreChange: () => void) {
  const widthQuery = window.matchMedia('(max-width: 768px)');
  const coarseQuery = window.matchMedia('(pointer: coarse)');
  const onChange = () => onStoreChange();
  widthQuery.addEventListener('change', onChange);
  coarseQuery.addEventListener('change', onChange);
  return () => {
    widthQuery.removeEventListener('change', onChange);
    coarseQuery.removeEventListener('change', onChange);
  };
}

function getMobileSnapshot() {
  return (
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

/** SSR / hydration assume desktop so the singularity tree matches the HTML. */
function getServerMobileSnapshot() {
  return false;
}

/** True for narrow viewports or coarse pointers (phones / tablets). */
export function useMobileLanding() {
  return useSyncExternalStore(subscribeMobile, getMobileSnapshot, getServerMobileSnapshot);
}
