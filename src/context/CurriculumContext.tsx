'use client';

import React, { createContext, useRef, useContext, ReactNode } from 'react';
import { useStore } from 'zustand';
import { createCurriculumStore, CurriculumState } from '../store/curriculumStore';

export type CurriculumStore = ReturnType<typeof createCurriculumStore>;

export const CurriculumContext = createContext<CurriculumStore | null>(null);

export interface CurriculumProviderProps {
  children: ReactNode;
}

export const CurriculumProvider = ({ children }: CurriculumProviderProps) => {
  const storeRef = useRef<CurriculumStore>(null);
  if (!storeRef.current) {
    storeRef.current = createCurriculumStore();
  }

  return (
    <CurriculumContext.Provider value={storeRef.current}>
      {children}
    </CurriculumContext.Provider>
  );
};

export function useCurriculum<T>(
  selector: (state: CurriculumState) => T,
): T {
  const store = useContext(CurriculumContext);
  if (!store) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return useStore(store, selector);
}
