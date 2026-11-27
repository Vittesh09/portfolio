'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export function DeskCopyEmail({ email }: { email: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const reduce = useReducedMotion();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (next: string) => {
    setMessage(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 1600);
  };

  return (
    <span className="desk-copy-wrap">
      <button
        type="button"
        className="desk-copy-email"
        aria-label={`Copy ${email}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            flash('Copied to clipboard');
          } catch {
            flash('Couldn’t copy');
          }
        }}
      >
        <span className="desk-copy-icon" data-copied={message?.startsWith('Copied') ? 'true' : undefined} aria-hidden="true">
          {/* Two stacked sheets; swaps to a tick while "Copied" shows. */}
          <svg className="desk-copy-icon-sheets" viewBox="0 0 16 16" width="12" height="12" focusable="false">
            <rect x="5.25" y="5.25" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M10.75 3.6V3.5a1.75 1.75 0 0 0-1.75-1.75H4A2.25 2.25 0 0 0 1.75 4v5c0 .97.78 1.75 1.75 1.75h.1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <svg className="desk-copy-icon-tick" viewBox="0 0 16 16" width="12" height="12" focusable="false">
            <path
              d="M3.5 8.5 6.5 11.5 12.5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {email}
      </button>
      <span className="desk-sr-only" aria-live="polite">
        {message ?? ''}
      </span>
      <AnimatePresence>
        {message ? (
          <motion.span
            key="toast"
            className="desk-toast"
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, y: 6, x: '-50%', filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, x: '-50%', filter: 'blur(0px)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, x: '-50%', filter: 'blur(4px)' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {message.startsWith('Copied') ? (
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path
                  d="M3.5 8.5 6.5 11.5 12.5 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
            {message}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
