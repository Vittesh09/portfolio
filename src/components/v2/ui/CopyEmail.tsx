'use client';

import { useCallback, useEffect, useState } from 'react';
import { siteConfig } from '@/src/config/v2/site';
import { ctaBase, ctaClass, type CtaVariant } from '@/src/components/v2/ui/ctaStyles';
import { COPY_EMAIL_SOUND, playUiSound } from '@/src/components/v2/ui/playUiSound';

type CopyEmailProps = {
  email?: string;
  variant?: CtaVariant;
  className?: string;
};

export function CopyEmail({
  email = siteConfig.email,
  variant = 'surface',
  className = ''
}: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = useCallback(async () => {
    playUiSound(COPY_EMAIL_SOUND);
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      const input = document.createElement('textarea');
      input.value = email;
      input.setAttribute('readonly', '');
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
    }
  }, [email]);

  return (
    <button
      type="button"
      onClick={copy}
      className={`${ctaBase} w-full max-w-full gap-4 text-left md:justify-between ${ctaClass(variant, 'primary')} ${className}`}
      aria-label={copied ? 'Email copied to clipboard' : `Copy email ${email}`}
    >
      <span className="font-normal normal-case tracking-normal md:hidden">
        {copied ? 'Copied' : 'Copy email'}
      </span>
      <span className="hidden min-w-0 truncate font-normal normal-case tracking-normal md:inline">
        {email}
      </span>
      <span className="hidden shrink-0 uppercase md:inline" aria-hidden>
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
}
