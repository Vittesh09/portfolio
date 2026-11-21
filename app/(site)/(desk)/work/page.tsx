import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Work · Vittesh Sinha',
  robots: { index: false, follow: true }
};

export default function WorkIndexPage() {
  redirect('/');
}
