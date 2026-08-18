import { MachinePageView } from '@/src/components/v2/sections/MachinePageView';
import { getMachineJsonLd, getMachinePlainText, machineMeta } from '@/src/config/v2/machine';

export const metadata = {
  title: 'Machine · Agent profile',
  description: machineMeta.purpose
};

export default function V2MachinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getMachineJsonLd()) }}
      />
      <noscript>
        <pre>{getMachinePlainText()}</pre>
      </noscript>
      <MachinePageView />
    </>
  );
}
