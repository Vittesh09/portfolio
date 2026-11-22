import { DeskHome } from '@/src/components/v2/desk/DeskHome';
import { getProjectCards } from '@/src/config/v2/caseStudies';
import { metaDescription } from '@/src/config/v2/profile';
import { DESK_TAB_TITLE, v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: 'Vittesh Sinha, Senior Product Designer, automotive and VR',
    tabTitle: DESK_TAB_TITLE,
    description: metaDescription,
    path: '/'
  })
};

export default function HomePage() {
  return <DeskHome cards={getProjectCards()} />;
}
