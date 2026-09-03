'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { getMachinePlainText } from '@/src/config/v2/machine';

/** Unstyled plain-text profile for visiting AI agents */
export function MachinePageView() {
  const text = useMemo(() => getMachinePlainText(), []);
  const [copied, setCopied] = useState(false);

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={copyAll}
            aria-live="polite"
            style={{
              font: 'inherit',
              padding: '8px 16px',
              cursor: 'pointer',
              border: '1px solid #111',
              background: '#111',
              color: '#fff',
              minHeight: 44
            }}
          >
            {copied ? 'Copied' : 'Copy to clipboard'}
          </button>
          <Link
            href="/v2/classic/workbench/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 16px',
              color: '#111',
              border: '1px solid #d4d4d4',
              textDecoration: 'none'
            }}
          >
            Open archived Workbench →
          </Link>
        </div>
      </div>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', font: 'inherit' }}>
        {text}
      </pre>
    </div>
  );
}
