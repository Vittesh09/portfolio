'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useV2Theme } from '@/src/components/v2/layout/ThemeProvider';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useV2Theme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle p-2.5 text-accent-pop transition-[color,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-pop hover:text-white ${className}`}
      aria-label={isDark ? 'Switch to paper' : 'Switch to ink'}
      suppressHydrationWarning
    >
      {isDark ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
    </button>
  );
}
