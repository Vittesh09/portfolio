'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, type CSSProperties } from 'react';
import { type ProjectCardData } from '@/src/config/v2/caseStudies';
import { triggerHaptic } from '@/src/components/v2/ui/haptics';
import { IosHapticSwitch } from '@/src/components/v2/ui/IosHapticSwitch';

export function ProjectCard({ project, index }: { project: ProjectCardData; index: number }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const src = project.cardImages?.[0] ?? project.image;
  const cover = Boolean(project.cardCover || project.cardImages?.length);
  const tag = [String(index + 1).padStart(2, '0'), ...project.cardRole.split(' '), project.year];

  if (project.comingSoon) {
    return (
      <div className="archive-project-card is-locked relative flex flex-col md:col-span-8 md:col-start-3 md:-mx-24">
        <div className="flex flex-col" aria-labelledby={`project-${project.slug}`}>
          <div className="archive-project-stage">
            <div className="archive-project-thumb relative aspect-[8/3] w-full overflow-hidden">
              <Image
                src={src}
                alt=""
                fill
                loading="lazy"
                decoding="async"
                className="archive-image object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <p className="archive-project-soon">{String(index + 1).padStart(2, '0')}</p>
            </div>
          </div>
          <div className="archive-project-caption">
            <div className="archive-project-caption-main">
              <h3 id={`project-${project.slug}`} className="archive-display text-text-primary">
                {project.title}
              </h3>
              <p className="archive-project-meta">Coming soon</p>
            </div>
            <p className="archive-project-outcome">
              {project.outcomeLine.split('\n').map((line, lineIndex) => (
                <span key={line}>
                  {lineIndex > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="archive-project-card relative flex flex-col md:col-span-8 md:col-start-3 md:-mx-24">
    <Link
      ref={linkRef}
      href={`/work/${project.slug}/`}
      className="group flex flex-col"
      onClick={() => triggerHaptic('medium')}
    >
      <div className="archive-project-stage">
        <div className="archive-project-thumb relative aspect-[8/3] w-full overflow-hidden">
          <Image
            src={src}
            alt=""
            fill
            loading="lazy"
            decoding="async"
            className={`archive-image ${cover ? 'object-cover' : 'object-contain'}`}
            sizes="(max-width: 768px) 100vw, 66vw"
          />
          <p className="archive-project-tag" aria-hidden>
            {tag.map((word, i) => (
              <span key={`${word}-${i}`} className="archive-project-tag-mask">
                <span className="archive-project-tag-word" style={{ '--i': i } as CSSProperties}>
                  {word}
                </span>
              </span>
            ))}
          </p>
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
          {project.outcomeLine.split('\n').map((line, lineIndex) => (
            <span key={line}>
              {lineIndex > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>
      </div>
    </Link>
    <IosHapticSwitch onActivate={() => linkRef.current?.click()} />
    </div>
  );
}
