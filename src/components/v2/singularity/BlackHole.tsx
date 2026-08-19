'use client';

import { useRef, type RefObject } from 'react';
import { useBlackHole } from './hooks/useBlackHole';
import type { BlackHoleOptions } from './lib/params';
import '@/src/styles/singularity.css';

type Props = {
  heroRef: RefObject<HTMLElement | null>;
  mode?: BlackHoleOptions['mode'];
  paramsRef?: BlackHoleOptions['paramsRef'];
  className?: string;
};

export function BlackHole({ heroRef, mode = 'hero', paramsRef, className = '' }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  useBlackHole(mountRef, heroRef, { mode, paramsRef });

  return (
    <div
      ref={mountRef}
      className={`bh-mount ${className}`.trim()}
      aria-hidden={mode === 'lab' ? undefined : true}
      role="presentation"
    />
  );
}

export default BlackHole;
