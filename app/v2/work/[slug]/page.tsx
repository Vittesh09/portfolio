import { notFound } from 'next/navigation';
import { CaseStudyExperience } from '@/src/components/v2/archive/CaseStudyExperience';
import { getAllSlugs, getProject } from '@/src/config/v2/caseStudies';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Case study · V2' };
  return { title: `${project.title} · V2 Preview`, description: project.summary };
}

export default async function V2CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudyExperience project={project} />;
}
