
"use client"

import { createContext, useContext, useEffect, type ReactNode } from 'react';

const PwaContext = createContext<undefined>(undefined);

export function usePwa() {
  const context = useContext(PwaContext);
  if (context === undefined) {
    throw new Error('usePwa must be used within a PwaProvider');
  }
  return context;
}

export function PwaProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  return (
    <PwaContext.Provider value={undefined}>
      {children}
    </PwaContext.Provider>
  );
}
