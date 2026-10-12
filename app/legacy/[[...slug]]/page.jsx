import LegacyRedirect from './redirect';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Redirecting'
};

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['about'] },
    { slug: ['work'] },
    { slug: ['work-pages', 'virtual-humans'] }
  ];
}

export default function LegacyRedirectPage() {
  return <LegacyRedirect />;
}
