'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { type ProjectCardData } from '@/src/config/v2/caseStudies';
import { noOrphan, v2Path } from '@/src/config/v2/profile';
import { triggerHaptic } from '@/src/components/v2/ui/haptics';
import { IosHapticSwitch } from '@/src/components/v2/ui/IosHapticSwitch';

function ProjectCardBody({
  project,
  index,
  headingId,
  locked
}: {
  project: ProjectCardData;
  index: number;
  headingId: string;
  locked: boolean;
}) {
  const src = project.cardImages?.[0] ?? project.image;
  const cover = Boolean(project.cardCover || project.cardImages?.length);
  const tag = [String(index + 1).padStart(2, '0'), ...project.cardRole.split(' '), project.year];

  return (
    <>
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
          {locked ? (
            <span className="archive-project-lock" aria-hidden>
              <Lock size={18} strokeWidth={1.75} />
            </span>
          ) : null}
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
          <h3 id={headingId} className="archive-display text-text-primary group-hover:text-accent-pop">
            {noOrphan(project.title)}
          </h3>
          <p className="archive-project-meta">
            {locked ? `Coming soon · ${project.year}` : `${project.cardRole} · ${project.year}`}
          </p>
        </div>
        <p className="archive-project-outcome">
          {project.outcomeLine.split('\n').map((line, lineIndex) => (
            <span key={`${lineIndex}-${line}`}>
              {lineIndex > 0 ? <br /> : null}
              {noOrphan(line)}
            </span>
          ))}
        </p>
      </div>
    </>
  );
}

export function ProjectCard({ project, index }: { project: ProjectCardData; index: number }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const locked = Boolean(project.comingSoon);
  const headingId = `project-${project.slug}`;
  const body: ReactNode = (
    <ProjectCardBody project={project} index={index} headingId={headingId} locked={locked} />
  );

  if (locked) {
    return (
      <div className="archive-project-card is-locked group relative flex flex-col md:col-span-8 md:col-start-3 md:-mx-24">
        <div className="flex flex-col" aria-labelledby={headingId}>
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className="archive-project-card relative flex flex-col md:col-span-8 md:col-start-3 md:-mx-24">
      <Link
        ref={linkRef}
        href={v2Path(`/work/${project.slug}/`)}
        className="group flex flex-col"
        onClick={() => triggerHaptic('medium')}
      >
        {body}
      </Link>
      <IosHapticSwitch onActivate={() => linkRef.current?.click()} />
    </div>
  );
}
