import { WorkbenchExperience } from '@/src/components/v2/archive/WorkbenchExperience';
import { workbenchMeta } from '@/src/config/v2/workbench';

export const metadata = {
  title: 'Workbench · V2 Archive',
  description: workbenchMeta.description,
  robots: { index: false, follow: false }
};

/** Archived workbench — kept for reference / lab use. */
export default function V2ClassicWorkbenchPage() {
  return <WorkbenchExperience />;
}
