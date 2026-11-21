import { notFound } from 'next/navigation';
import { DeskBlogPost } from '@/src/components/v2/desk/DeskBlog';
import { blogPosts, getBlogPost } from '@/src/config/v2/publishing';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Desk blog' };
  return {
    title: `${post.title} · Desk`,
    description: post.description,
    robots: { index: false, follow: false }
  };
}

export default async function DeskBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  if (!getBlogPost(slug)) notFound();
  return <DeskBlogPost slug={slug} />;
}
