import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Desk · Vittesh Sinha',
  description: 'Desk lab. Not the live site.',
  robots: { index: false, follow: false }
};

export default function DeskWorkPage() {
  redirect('/desk');
}
