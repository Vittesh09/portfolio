'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';

export const KISS_MODE_STORAGE_KEY = 'v2-kiss-mode';
export const KISS_MODE_CHANGE_EVENT = 'v2-kiss-mode-change';

type KissModeContextValue = {
  kissMode: boolean;
  setKissMode: (enabled: boolean) => void;
  toggleKissMode: () => void;
  hydrated: boolean;
};

const KissModeContext = createContext<KissModeContextValue | null>(null);

function persistKissMode(enabled: boolean) {
  window.sessionStorage.setItem(KISS_MODE_STORAGE_KEY, enabled ? 'true' : 'false');
  window.dispatchEvent(
    new CustomEvent(KISS_MODE_CHANGE_EVENT, { detail: { enabled } })
  );
  if (enabled) {
    window.dispatchEvent(new CustomEvent('v2-cosmos-reveal'));
  }
}

/** Landing-page-only alternate view; does not restyle the global v2 shell. */
export function KissModeProvider({ children }: { children: ReactNode }) {
  const [kissMode, setKissModeState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(KISS_MODE_STORAGE_KEY) === 'true';
    setKissModeState(stored);
    setHydrated(true);
  }, []);

  const setKissMode = useCallback((enabled: boolean) => {
    setKissModeState(enabled);
    persistKissMode(enabled);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleKissMode = useCallback(() => {
    setKissModeState((prev) => {
      const next = !prev;
      // Persist after this updater finishes — never notify during render/setState
      queueMicrotask(() => {
        persistKissMode(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ kissMode, setKissMode, toggleKissMode, hydrated }),
    [kissMode, setKissMode, toggleKissMode, hydrated]
  );

  return <KissModeContext.Provider value={value}>{children}</KissModeContext.Provider>;
}

export function useKissMode() {
  const ctx = useContext(KissModeContext);
  if (!ctx) {
    throw new Error('useKissMode must be used within KissModeProvider');
  }
  return ctx;
}
