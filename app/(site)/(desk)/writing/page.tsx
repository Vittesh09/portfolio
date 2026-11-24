import { DeskWritingIndex } from '@/src/components/v2/desk/DeskWriting';
import { DESK_TAB_TITLE, v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: 'Writing & Speaking, Vittesh Sinha',
    tabTitle: DESK_TAB_TITLE,
    description: 'Essays, notes and talks by Vittesh Sinha.',
    path: '/writing/'
  })
};

export default function WritingPage() {
  return <DeskWritingIndex />;
}
