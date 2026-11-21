import { getAllSlugs } from '@/src/config/v2/caseStudies';
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
    ...getAllSlugs().map((slug) => ({ slug: ['work', slug] }))
  ];
}

export default function DeskRedirectPage() {
  return <DeskToRootRedirect />;
}
