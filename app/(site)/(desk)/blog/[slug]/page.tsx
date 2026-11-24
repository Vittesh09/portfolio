import { blogPosts } from '@/src/config/v2/publishing';
import BlogToWritingRedirect from '../redirect';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: `/writing/${slug}/` },
    title: 'Redirecting'
  };
}

export default function BlogPostRedirectPage() {
  return <BlogToWritingRedirect />;
}
