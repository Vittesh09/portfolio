'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { BlackHoleLazy } from '@/src/components/v2/singularity/BlackHoleLazy';

export function NotFoundExperience() {
  const stageRef = useRef<HTMLElement>(null);

  return (
    <div className="v2-root dark notfound-screen">
      <section ref={stageRef} className="notfound-stage" aria-label="Page not found">
        <BlackHoleLazy heroRef={stageRef} mode="lab" />
        <div className="notfound-copy">
          <p className="archive-label notfound-code">404</p>
          <h1 className="archive-display notfound-title">It seems you’re lost</h1>
          <p className="notfound-line">Only those who wander discover what they’re seeking.</p>
          <Link href="/" className="archive-label notfound-home">
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
