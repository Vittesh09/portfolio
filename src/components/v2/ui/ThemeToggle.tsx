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
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle p-2.5 text-accent-pop transition-[color,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-pop hover:text-white ${className}`}
      aria-label={labels.next}
      title={labels.current}
      suppressHydrationWarning
    >
      {mode === 'dark' ? (
        <Sun size={14} strokeWidth={1.5} />
      ) : mode === 'light' ? (
        <Moon size={14} strokeWidth={1.5} />
      ) : (
        <Monitor size={14} strokeWidth={1.5} />
      )}
    </button>
  );
}
