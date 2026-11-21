import { getAllSlugs } from '@/src/config/v2/caseStudies';
import { blogPosts } from '@/src/config/v2/publishing';
import DeskToRootRedirect from './redirect';

export const metadata = {
  robots: { index: false, follow: true },
  title: 'Redirecting'
};

/** The desk lab is now the live site at `/`. Old `/desk/*` links land on the same page at the root. */
export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['about'] },
    { slug: ['work'] },
    { slug: ['blog'] },
    ...getAllSlugs().map((slug) => ({ slug: ['work', slug] })),
    ...blogPosts.map((post) => ({ slug: ['blog', post.slug] }))
  ];
}

export default function DeskRedirectPage() {
  return <DeskToRootRedirect />;
}
