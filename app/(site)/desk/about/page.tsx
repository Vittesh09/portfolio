import { DeskAbout } from '@/src/components/v2/desk/DeskAbout';

export const metadata = {
  title: 'Desk about · Vittesh Sinha',
  description: 'Desk lab about. Not the live site.',
  robots: { index: false, follow: false }
};

export default function DeskAboutPage() {
  return <DeskAbout />;
}
