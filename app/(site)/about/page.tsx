import { AboutExperience } from '@/src/components/v2/archive/AboutExperience';
import { v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: 'About, Vittesh Sinha, Senior Product Designer',
    description:
      "Senior product designer with 8 years across automotive, logistics, cloud and VR. How I work, where I've worked, and what I'm best at.",
    path: '/about/'
  })
};

export default function V2AboutPage() {
  return <AboutExperience />;
}
