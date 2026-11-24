import { notFound } from 'next/navigation';
import { DeskBlogPost, DeskTalk } from '@/src/components/v2/desk/DeskWriting';
import { blogPosts, getBlogPost, getTalk, talks } from '@/src/config/v2/publishing';
import { DESK_TAB_TITLE, v2PageMetadata } from '@/src/config/v2/seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...blogPosts, ...talks].map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const entry = getBlogPost(slug) ?? getTalk(slug);
  if (!entry) return { title: { absolute: DESK_TAB_TITLE } };
  return v2PageMetadata({
    title: `${entry.title}, Vittesh Sinha`,
    tabTitle: DESK_TAB_TITLE,
    description: entry.description,
    path: `/writing/${entry.slug}/`
  });
}

export default async function WritingEntryPage({ params }: PageProps) {
  const { slug } = await params;
  if (getTalk(slug)) return <DeskTalk slug={slug} />;
  if (getBlogPost(slug)) return <DeskBlogPost slug={slug} />;
  notFound();
}
