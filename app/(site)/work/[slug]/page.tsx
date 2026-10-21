import { notFound } from 'next/navigation';
import { CaseStudyExperience } from '@/src/components/v2/archive/CaseStudyExperience';
import { getAllSlugs, getProject, isPublished, projects } from '@/src/config/v2/caseStudies';
import { v2PageMetadata } from '@/src/config/v2/seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Case study' };
  return v2PageMetadata({
    title: project.seoTitle ?? `${project.title} | Vittesh Sinha`,
    description: project.summary,
    path: `/work/${slug}/`
  });
}

export default async function V2CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const open = projects.filter(isPublished);
  const index = open.findIndex((item) => item.slug === project.slug);
  const next = open[(index + 1) % open.length];
  return (
    <CaseStudyExperience
      key={project.slug}
      project={project}
      nextProject={{ slug: next.slug, title: next.title }}
    />
  );
}
