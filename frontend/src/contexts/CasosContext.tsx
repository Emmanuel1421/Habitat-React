import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Caso } from '@/types';
import { mockCasos } from '@/data/mockData';

interface CasosContextType {
  casos: Caso[];
  setCasos: React.Dispatch<React.SetStateAction<Caso[]>>;
  addCaso: (caso: Caso) => void;
  updateCaso: (id: string, updates: Partial<Caso>) => void;
}

const CasosContext = createContext<CasosContextType | undefined>(undefined);

export const CasosProvider = ({ children }: { children: ReactNode }) => {
  const [casos, setCasos] = useState<Caso[]>(mockCasos);

  const addCaso = (caso: Caso) => setCasos(prev => [...prev, caso]);

  const updateCaso = (id: string, updates: Partial<Caso>) => {
    setCasos(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <CasosContext.Provider value={{ casos, setCasos, addCaso, updateCaso }}>
      {children}
    </CasosContext.Provider>
  );
};

export const useCasos = () => {
  const ctx = useContext(CasosContext);
  if (!ctx) throw new Error('useCasos must be used within CasosProvider');
  return ctx;
};
