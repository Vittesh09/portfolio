import { notFound } from 'next/navigation';
import { DeskBlogPost } from '@/src/components/v2/desk/DeskBlog';
import { blogPosts, getBlogPost } from '@/src/config/v2/publishing';
import { v2PageMetadata } from '@/src/config/v2/seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Blog' };
  return v2PageMetadata({
    title: `${post.title}, Vittesh Sinha`,
    description: post.description,
    path: `/blog/${post.slug}/`
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  if (!getBlogPost(slug)) notFound();
  return <DeskBlogPost slug={slug} />;
}
