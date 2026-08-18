'use client';

import { useRef } from 'react';
import { useBlackHole } from './hooks/useBlackHole';

export function BlackHole() {
  const mountRef = useRef<HTMLDivElement>(null);
  useBlackHole(mountRef);

  return (
    <div
      ref={mountRef}
      className="v2-black-hole"
      aria-hidden="true"
      role="presentation"
    />
  );
}
