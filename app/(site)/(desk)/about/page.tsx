import { DeskAbout } from '@/src/components/v2/desk/DeskAbout';
import { DESK_TAB_TITLE, v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: 'About, Vittesh Sinha, Senior Product Designer',
    tabTitle: DESK_TAB_TITLE,
    description:
      "Senior product designer with 7+ years across automotive, logistics, cloud and VR. How I work, where I've worked, and what I'm best at.",
    path: '/about/'
  })
};

export default function AboutPage() {
  return <DeskAbout />;
}
