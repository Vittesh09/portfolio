import { LandingExperienceSingularity } from '@/src/components/v2/archive/LandingExperienceSingularity';
import { getProjectCards } from '@/src/config/v2/caseStudies';
import { metaDescription } from '@/src/config/v2/profile';
import { v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: 'Vittesh Sinha — Senior Product Designer, automotive and VR',
    description: metaDescription,
    path: '/'
  })
};

export default function V2HomePage() {
  return <LandingExperienceSingularity cards={getProjectCards()} />;
}
