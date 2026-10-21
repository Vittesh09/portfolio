import V2ToLiveRedirect from './redirect';

export const metadata = {
  robots: { index: false, follow: true },
  title: 'Redirecting'
};

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['about'] },
    { slug: ['machine'] },
    { slug: ['classic'] },
    { slug: ['classic', 'workbench'] },
    { slug: ['singularity'] },
    { slug: ['workbench'] },
    { slug: ['work', 'vr-eeg-analytics'] },
    { slug: ['work', 'fleet-track'] },
    { slug: ['work', 'b2b-configurator'] }
  ];
}

export default function V2RedirectPage() {
  return <V2ToLiveRedirect />;
}
