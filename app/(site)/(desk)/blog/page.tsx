import { DeskBlogIndex } from '@/src/components/v2/desk/DeskBlog';
import { v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: 'Blog, Vittesh Sinha',
    description: 'Writing by Vittesh Sinha.',
    path: '/blog/'
  })
};

export default function BlogPage() {
  return <DeskBlogIndex />;
}
