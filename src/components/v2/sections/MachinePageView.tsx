import Link from 'next/link';
import { machineMeta } from '@/src/config/v2/agentDocuments';
import { SITE_URL } from '@/src/config/v2/profile';

type MachinePageViewProps = {
  text: string;
};

/** Unstyled plain-text profile for visiting AI agents. Text is server-rendered. */
export function MachinePageView({ text }: MachinePageViewProps) {
  return (
    <div
      className="v2-machine-plain"
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: 13,
        lineHeight: 1.5,
        color: '#111',
        background: '#fff',
        maxWidth: 820,
        margin: '0 auto',
        padding: '24px 16px'
      }}
    >
      <p style={{ margin: '0 0 16px', maxWidth: '62ch' }}>{machineMeta.explainer}</p>
      <p style={{ margin: '0 0 24px' }}>
        <a href={`${SITE_URL}/llms.txt`}>/llms.txt</a>
        {' · '}
        <a href={`${SITE_URL}/llms-full.txt`}>/llms-full.txt</a>
        {' · '}
        <a href={`${SITE_URL}/machine.json`}>/machine.json</a>
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '1px solid #e5e5e5'
        }}
      >
        <Link
          href="/v2/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#111',
            fontWeight: 500,
            textDecoration: 'none'
          }}
        >
          ← Back to portfolio
        </Link>
      </div>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', font: 'inherit' }}>
        {text}
      </pre>
    </div>
  );
}
