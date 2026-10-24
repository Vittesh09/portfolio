import { TldrExperience } from '@/src/components/v2/archive/TldrExperience';
import { getProjectCards } from '@/src/config/v2/caseStudies';
import { v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: 'TL;DR, Vittesh Sinha, Senior Product Designer',
    description:
      'One-screen snapshot of Vittesh Sinha: selected work, contact, and how to reach him.',
    path: '/tldr/'
  })
};

export default function TldrPage() {
  return <TldrExperience cards={getProjectCards()} />;
}
