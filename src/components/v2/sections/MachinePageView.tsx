import Link from 'next/link';
import { MachineCopyButton } from '@/src/components/v2/sections/MachineCopyButton';
import { machineMeta } from '@/src/config/v2/agentDocuments';
import { SITE_URL } from '@/src/config/v2/profile';

type MachinePageViewProps = {
  text: string;
};

/** Server-rendered profile; chrome stays outside the article. */
export function MachinePageView({ text }: MachinePageViewProps) {
  return (
    <div className="v2-machine-plain">
      <header className="v2-machine-chrome">
        <p>{machineMeta.explainer}</p>
        <p>
          <a href={`${SITE_URL}/llms.txt`}>/llms.txt</a>
          {' · '}
          <a href={`${SITE_URL}/machine.md`}>/machine.md</a>
          {' · '}
          <a href={`${SITE_URL}/machine.json`}>/machine.json</a>
        </p>
        <div className="v2-machine-actions">
          <Link href="/v2/" className="v2-machine-back">
            ← Back to portfolio
          </Link>
          <MachineCopyButton text={text} />
        </div>
      </header>
      <article>
        <pre>{text}</pre>
      </article>
    </div>
  );
}
