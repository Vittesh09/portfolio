import { LandingExperienceSingularity } from '@/src/components/v2/archive/LandingExperienceSingularity';
import { metaDescription, profile } from '@/src/config/v2/profile';
import { v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: `${profile.name} | ${profile.title}`,
    description: metaDescription,
    path: '/'
  })
};

/** Primary archive homepage — singularity landing + v2 site chrome. */
export default function V2HomePage() {
  return <LandingExperienceSingularity />;
}
