import { redirect } from 'next/navigation';
import { DESK_TAB_TITLE } from '@/src/config/v2/seo';

export const metadata = {
  title: { absolute: DESK_TAB_TITLE },
  robots: { index: false, follow: true }
};

export default function WorkIndexPage() {
  redirect('/');
}
