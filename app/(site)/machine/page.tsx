import { MachinePageView } from '@/src/components/v2/sections/MachinePageView';
import {
  assertAgentFactsMatchPages,
  getMachinePlainText,
  machineMeta
} from '@/src/config/v2/agentDocuments';
import { v2PageMetadata } from '@/src/config/v2/seo';

assertAgentFactsMatchPages();

export const metadata = {
  ...v2PageMetadata({
    title: `For agents · ${machineMeta.audience}`,
    description: machineMeta.purpose,
    path: '/machine/'
  })
};

export default function V2MachinePage() {
  const text = getMachinePlainText();
  return <MachinePageView text={text} />;
}
