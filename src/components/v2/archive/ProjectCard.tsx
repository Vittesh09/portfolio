'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import type { PointerEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { type Project } from '@/src/config/v2/caseStudies';
import { isUnconfirmed } from '@/src/config/v2/profile';

const TILT = { stiffness: 260, damping: 28, mass: 0.4 };
const MAX_TILT_X = 6;
const MAX_TILT_Y = 8;

export function ProjectCard({ project }: { project: Project }) {
  const bounds = useRef<DOMRect | null>(null);
  const reduceMotion = useRef(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const tiltX = useSpring(rotateX, TILT);
  const tiltY = useSpring(rotateY, TILT);
  const meta = isUnconfirmed(project.company)
    ? project.cardRole
    : `${project.company} · ${project.cardRole}`;

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bounds.current = event.currentTarget.getBoundingClientRect();
    event.currentTarget.classList.add('is-active');
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !bounds.current || reduceMotion.current) return;
    const { left, top, width, height } = bounds.current;
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;
    rotateY.set(x * MAX_TILT_Y);
    rotateX.set(-y * MAX_TILT_X);
  };

  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    bounds.current = null;
    rotateX.set(0);
    rotateY.set(0);
    event.currentTarget.classList.remove('is-active');
  };

  return (
    <Link
      href={`/v2/work/${project.slug}/`}
      className="archive-project-card group flex h-full flex-col"
    >
      <div className="archive-project-stage bg-[#070707]">
        <motion.div
          className="archive-project-thumb relative h-44 w-full overflow-hidden md:h-56"
          style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
          onPointerEnter={onPointerEnter}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <Image
            src={project.image}
            alt=""
            fill
            loading="lazy"
            decoding="async"
            className="archive-image object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <p className="archive-label text-text-muted">Case {project.index}</p>
        <h3 className="mt-2 line-clamp-2 h-14 text-2xl font-semibold leading-7 tracking-tight group-hover:text-accent-pop">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-1 h-5 text-sm leading-5 text-text-secondary">{meta}</p>
        <p className="mt-3 line-clamp-3 h-[4.875rem] text-sm leading-relaxed text-text-secondary">
          {project.outcomeLine}
        </p>
      </div>
    </Link>
  );
}
