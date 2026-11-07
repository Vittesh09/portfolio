import { DeskHome } from '@/src/components/v2/desk/DeskHome';
import { getProjectCards } from '@/src/config/v2/caseStudies';

export const metadata = {
  title: 'Desk · Vittesh Sinha',
  description: 'Desk lab — singularity stage with selected work. Not the live site.',
  robots: { index: false, follow: false }
};

export default function DeskPage() {
  return <DeskHome cards={getProjectCards()} />;
}
