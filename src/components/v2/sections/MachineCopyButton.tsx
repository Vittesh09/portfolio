'use client';

import { useEffect, useState } from 'react';

export function MachineCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      const input = document.createElement('textarea');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="v2-machine-copy"
      aria-label={copied ? 'Copied' : 'Copy profile to clipboard'}
    >
      <span className="v2-visually-hidden" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
      {copied ? 'Copied' : 'Copy to clipboard'}
    </button>
  );
}
