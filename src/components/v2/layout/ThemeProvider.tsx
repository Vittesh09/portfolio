'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

/** light = cream paper default; dark = ink alternate */
export type V2Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: V2Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
export const V2_THEME_KEY = 'v2-theme';

function applyTheme(theme: V2Theme) {
  const root = document.querySelector('.v2-root');
  if (!root) return;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.remove('light');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<V2Theme>('light');

  useEffect(() => {
    const saved = window.localStorage.getItem(V2_THEME_KEY);
    const next: V2Theme = saved === 'dark' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: V2Theme = prev === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        window.localStorage.setItem(V2_THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useV2Theme() {
  return (
    useContext(ThemeContext) ?? {
      theme: 'light' as V2Theme,
      toggleTheme: () => {}
    }
  );
}
