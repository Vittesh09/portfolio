'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const showToast = useCallback((next: string) => {
    setMessage(next);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 2800);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="v2-toast-region" aria-live="polite" aria-atomic="true">
        {message ? (
          <p className="v2-toast" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (message: string) => {
        if (typeof window !== 'undefined') window.alert(message);
      }
    };
  }
  return ctx;
}
