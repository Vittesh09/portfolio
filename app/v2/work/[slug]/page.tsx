import { notFound } from 'next/navigation';
import { CaseStudyExperience } from '@/src/components/v2/archive/CaseStudyExperience';
import { getAllSlugs, getProject } from '@/src/config/v2/caseStudies';
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
    title: `${project.title} · Case study`,
    description: project.summary,
    path: `/work/${slug}/`
  });
}

export default async function V2CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudyExperience project={project} />;
}
