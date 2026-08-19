'use client';

import dynamic from 'next/dynamic';

/** Three.js + bloom stay out of the main v2 bundle until a desktop hero/lab actually mounts. */
export const BlackHoleLazy = dynamic(() => import('./BlackHole'), { ssr: false });
