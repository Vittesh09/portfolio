'use client';

import dynamic from 'next/dynamic';

export const BlackHoleLazy = dynamic(() => import('./BlackHole'), { ssr: false });
