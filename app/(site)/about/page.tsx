import { AboutExperience } from '@/src/components/v2/archive/AboutExperience';
import { profile } from '@/src/config/v2/profile';
import { v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: `About · ${profile.name}`,
    description: profile.aboutShort,
    path: '/about/'
  })
};

export default function V2AboutPage() {
  return <AboutExperience />;
}
