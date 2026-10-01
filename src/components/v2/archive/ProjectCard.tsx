'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { type Project } from '@/src/config/v2/caseStudies';
import { GravityLens } from '@/src/components/v2/ui/GravityLens';
import { triggerHaptic } from '@/src/components/v2/ui/haptics';
import { IosHapticSwitch } from '@/src/components/v2/ui/IosHapticSwitch';

const FRAME_MS = 1800;

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const cycleRef = useRef(0);
  const frames = project.cardImages?.length ? project.cardImages : [project.image];
  const [frame, setFrame] = useState(0);

  const stopCycle = () => {
    window.clearInterval(cycleRef.current);
    cycleRef.current = 0;
    setFrame(0);
  };

  const onCardEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse' || frames.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.clearInterval(cycleRef.current);
    cycleRef.current = window.setInterval(() => {
      setFrame((current) => (current + 1) % frames.length);
    }, FRAME_MS);
  };

  useEffect(() => () => window.clearInterval(cycleRef.current), []);

  return (
    <div className="archive-project-card relative flex flex-col md:col-span-8 md:col-start-3 md:-mx-24">
    <Link
      href={`/v2/work/${project.slug}/`}
      className="group flex flex-col"
      onPointerEnter={onCardEnter}
      onPointerLeave={stopCycle}
      onClick={() => triggerHaptic('medium')}
    >
      <div className="archive-project-stage">
        <div className="archive-project-thumb relative aspect-[8/3] w-full overflow-hidden">
          {frames.map((src, index) => {
            const cover = Boolean(project.cardCover) || index === 0;
            return (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                loading="lazy"
                decoding="async"
                className={
                  frames.length > 1
                    ? `archive-image archive-project-frame ${cover ? 'object-cover' : 'object-contain'}${index === frame ? ' is-shown' : ''}`
                    : 'archive-image object-contain'
                }
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            );
          })}
          <GravityLens
            mode="image"
            src={frames[frame]}
            fit={project.cardCover || (frames.length > 1 && frame === 0) ? 'cover' : 'contain'}
          />
        </div>
      </div>
      <div className="archive-project-caption">
        <div className="archive-project-caption-main">
          <h3 className="archive-display text-text-primary group-hover:text-accent-pop">{project.title}</h3>
          <p className="archive-project-meta">
            {project.cardRole} · {project.year}
          </p>
        </div>
        <p className="archive-project-outcome">
          {project.outcomeLine.split('\n').map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>
      </div>
    </Link>
    <IosHapticSwitch onActivate={() => router.push(`/v2/work/${project.slug}/`)} />
    </div>
  );
}
