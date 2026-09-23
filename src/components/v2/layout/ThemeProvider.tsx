'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

/** light = cream paper; dark = ink; system = OS color scheme */
export type V2Theme = 'light' | 'dark';
export type V2ThemePreference = V2Theme | 'system';

type ThemeContextValue = {
  theme: V2Theme;
  preference: V2ThemePreference;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
export const V2_THEME_KEY = 'v2-appearance';

const PREFERENCE_ORDER: V2ThemePreference[] = ['system', 'light', 'dark'];

function systemTheme(): V2Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function parsePreference(value: string | null): V2ThemePreference {
  if (value === 'dark' || value === 'light' || value === 'system') return value;
  return 'system';
}

function resolveTheme(preference: V2ThemePreference): V2Theme {
  return preference === 'system' ? systemTheme() : preference;
}

function persistPreference(preference: V2ThemePreference) {
  try {
    if (preference === 'system') {
      window.localStorage.removeItem(V2_THEME_KEY);
      return;
    }
    window.localStorage.setItem(V2_THEME_KEY, preference);
  } catch {
    /* ignore */
  }
}

function applyTheme(theme: V2Theme) {
  const root = document.querySelector('.v2-root');
  if (!root) return;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.remove('light');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<V2ThemePreference>('system');
  const [theme, setTheme] = useState<V2Theme>('light');

  useEffect(() => {
    const nextPreference = parsePreference(window.localStorage.getItem(V2_THEME_KEY));
    const nextTheme = resolveTheme(nextPreference);
    setPreference(nextPreference);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  useEffect(() => {
    if (preference !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystem = () => {
      const nextTheme = media.matches ? 'dark' : 'light';
      setTheme(nextTheme);
      applyTheme(nextTheme);
    };

    media.addEventListener('change', syncSystem);
    return () => media.removeEventListener('change', syncSystem);
  }, [preference]);

  const toggleTheme = useCallback(() => {
    setPreference((prev) => {
      const next = PREFERENCE_ORDER[(PREFERENCE_ORDER.indexOf(prev) + 1) % PREFERENCE_ORDER.length];
      const nextTheme = resolveTheme(next);
      setTheme(nextTheme);
      applyTheme(nextTheme);
      persistPreference(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, preference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useV2Theme() {
  return (
    useContext(ThemeContext) ?? {
      theme: 'light' as V2Theme,
      preference: 'system' as V2ThemePreference,
      toggleTheme: () => {}
    }
  );
}
