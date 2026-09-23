'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useV2Theme } from '@/src/components/v2/layout/ThemeProvider';

type ThemeToggleProps = {
  className?: string;
};

const LABELS = {
  system: {
    current: 'Appearance: system',
    next: 'Switch to paper'
  },
  light: {
    current: 'Appearance: paper',
    next: 'Switch to ink'
  },
  dark: {
    current: 'Appearance: ink',
    next: 'Switch to system'
  }
} as const;

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { preference, toggleTheme } = useV2Theme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mode = mounted ? preference : 'system';
  const labels = LABELS[mode];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle p-2.5 text-accent-pop transition-[color,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-pop hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      aria-label={labels.next}
      title={labels.current}
      suppressHydrationWarning
    >
      {mode === 'dark' ? (
        <Sun size={14} strokeWidth={1.5} aria-hidden />
      ) : mode === 'light' ? (
        <Moon size={14} strokeWidth={1.5} aria-hidden />
      ) : (
        <Monitor size={14} strokeWidth={1.5} aria-hidden />
      )}
    </button>
  );
}
