import Link from 'next/link';
import Image from 'next/image';
import { type Project } from '@/src/config/v2/caseStudies';

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
      <div className="grid gap-5 p-5 md:grid-cols-12 md:p-7">
        <div className="md:col-span-7">
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{project.title}</h3>
          <p className="mt-2 text-sm text-text-secondary">
            {project.company} · {project.cardRole}
          </p>
          <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>
        </div>
        <div className="md:col-span-4">
          <p className="v2-card-outcome text-sm text-accent-pop">{project.outcomeLine}</p>
          <Label>{project.tags.join(' / ')}</Label>
          <p className="mt-2 text-sm">{project.year}</p>
        </div>
        <span className="text-2xl text-accent-pop md:col-span-1 md:text-right">↗</span>
      </div>
    </Link>
  );
}
