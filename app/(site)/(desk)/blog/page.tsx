import { DeskBlogIndex } from '@/src/components/v2/desk/DeskBlog';
import { DESK_TAB_TITLE, v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: 'Blog, Vittesh Sinha',
    tabTitle: DESK_TAB_TITLE,
    description: 'Writing by Vittesh Sinha.',
    path: '/blog/'
  })
};

export default function BlogPage() {
  return <DeskBlogIndex />;
}
