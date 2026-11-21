import { DeskBlogIndex } from '@/src/components/v2/desk/DeskBlog';

export const metadata = {
  title: 'Desk blog · Vittesh Sinha',
  description: 'Desk lab blog. Not the live site.',
  robots: { index: false, follow: false }
};

export default function DeskBlogPage() {
  return <DeskBlogIndex />;
}
