import Link from 'next/link';
import Image from 'next/image';
import { type Project } from '@/src/config/v2/caseStudies';
import { isUnconfirmed } from '@/src/config/v2/profile';

type ProjectCardProps = {
  project: Project;
  index: number;
};

function Label({ children }: { children: React.ReactNode }) {
  return <p className="archive-label text-text-muted">{children}</p>;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link
      href={`/v2/work/${project.slug}/`}
      className="archive-project-card group block border border-border-subtle bg-bg-surface"
    >
      <div
        className={`relative overflow-hidden bg-[#070707] ${
          index === 0 ? 'aspect-[16/7]' : 'aspect-[4/3]'
        }`}
      >
        <Image
          src={project.image}
          alt=""
          fill
          loading="lazy"
          decoding="async"
          className="archive-image object-contain p-4 group-hover:scale-[1.02] md:p-8"
          sizes={index === 0 ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
        />
        <span className="archive-label absolute right-3 top-3 bg-bg-primary px-3 py-2">
          Case {project.index}
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-4 p-5 md:grid md:grid-cols-12 md:gap-5 md:p-7">
        <div className="min-w-0 md:col-span-7">
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{project.title}</h3>
          <p className="mt-2 break-words text-sm text-text-secondary">
            {isUnconfirmed(project.company)
              ? project.role
              : `${project.company} · ${project.role}`}
          </p>
          <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>
        </div>
        <div className="min-w-0 md:col-span-4">
          <p className="v2-card-outcome mb-3 text-sm text-accent-pop">{project.outcomeLine}</p>
          <Label>{project.tags.join(' / ')}</Label>
          <p className="mt-2 text-sm">{project.year}</p>
        </div>
        <span className="hidden text-2xl text-accent-pop md:col-span-1 md:block md:text-right">
          ↗
        </span>
      </div>
    </Link>
  );
}
