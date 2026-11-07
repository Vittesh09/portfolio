'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useV2Theme } from '@/src/components/v2/layout/ThemeProvider';

export function DeskThemeToggle() {
  const { theme, setThemePreference } = useV2Theme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolved = mounted ? theme : 'dark';
  const next = resolved === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="desk-theme-icon"
      aria-label={`Switch to ${next} mode`}
      title={`Appearance: ${resolved}`}
      suppressHydrationWarning
      onClick={() => setThemePreference(next)}
    >
      {resolved === 'dark' ? (
        <Sun size={14} strokeWidth={1.5} aria-hidden />
      ) : (
        <Moon size={14} strokeWidth={1.5} aria-hidden />
      )}
    </button>
  );
}
