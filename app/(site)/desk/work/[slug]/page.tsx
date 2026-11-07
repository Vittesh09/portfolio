import { notFound } from 'next/navigation';
import { DeskCaseStudy } from '@/src/components/v2/desk/DeskCaseStudy';
import { getAllSlugs, getProject, isPublished, projects } from '@/src/config/v2/caseStudies';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Desk case study · Vittesh Sinha' };
  return {
    title: `Desk · ${project.title} · Vittesh Sinha`,
    description: project.summary,
    robots: { index: false, follow: false }
  };
}

export default async function DeskCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const open = projects.filter(isPublished);
  const index = open.findIndex((item) => item.slug === project.slug);
  const next = open[(index + 1) % open.length];

  return (
    <DeskCaseStudy
      project={project}
      nextProject={{ slug: next.slug, title: next.title }}
    />
  );
}
