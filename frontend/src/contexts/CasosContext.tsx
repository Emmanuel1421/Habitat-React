import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Caso, CaseStatus, TipoAtendimento } from '@/types';
import { associateService } from '@/services/associateService';
import { AssociateRequest, AssociateResponse } from '@/types/api';
import { useAuth } from './AuthContext';

const mapAssociateToCaso = (a: AssociateResponse, existing?: Caso): Caso => ({
  id: String(a.id),
  morador: {
    nome: a.name,
    cpf: a.cpf,
    telefone: a.phone,
    endereco: a.address,
  },
  descricao: a.caseReport || '',
  tipo: (a.attendanceType as TipoAtendimento) || 'judicial',
  status: (a.attendanceStatus as CaseStatus) || 'triagem',
  estagiarioId: a.internId != null ? String(a.internId) : '',
  coordenadorId: a.coordinatorId != null ? String(a.coordinatorId) : '',
  dataCriacao: a.createdAt ? a.createdAt.split('T')[0] : '',
  dataAtualizacao: a.updatedAt ? a.updatedAt.split('T')[0] : '',
  anotacoes: existing?.anotacoes || [],
  documentos: existing?.documentos || [],
  timeline: existing?.timeline || [],
  legalGuidance: a.legalGuidance,
});

const casoToAssociateRequest = (c: Caso): AssociateRequest => ({
  name: c.morador.nome,
  cpf: c.morador.cpf,
  address: c.morador.endereco,
  phone: c.morador.telefone,
  caseReport: c.descricao,
  legalGuidance: c.legalGuidance,
  attendanceStatus: c.status,
  attendanceType: c.tipo,
  coordinatorId: c.coordenadorId ? Number(c.coordenadorId) : null,
  internId: c.estagiarioId ? Number(c.estagiarioId) : null,
});

export interface NovoAtendimentoInput {
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
  descricao: string;
  tipo: TipoAtendimento;
  estagiarioId: string;
  coordenadorId: string;
}

interface CasosContextType {
  casos: Caso[];
  loading: boolean;
  error: string | null;
  refreshCasos: () => Promise<void>;
  addCaso: (data: NovoAtendimentoInput) => Promise<Caso>;
  updateCaso: (id: string, updates: Partial<Caso>) => Promise<void>;
  removeCaso: (id: string) => Promise<void>;
}

const CasosContext = createContext<CasosContextType | undefined>(undefined);

export const CasosProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCasos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await associateService.list({ size: 1000, sort: 'name' });
      setCasos((prev) => page.content.map((a) => mapAssociateToCaso(a, prev.find((c) => c.id === String(a.id)))));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar casos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCasos();
    } else {
      setCasos([]);
    }
  }, [isAuthenticated, refreshCasos]);

  const addCaso = async (data: NovoAtendimentoInput): Promise<Caso> => {
    const request: AssociateRequest = {
      name: data.nome,
      cpf: data.cpf,
      address: data.endereco,
      phone: data.telefone,
      caseReport: data.descricao,
      attendanceStatus: 'triagem',
      attendanceType: data.tipo,
      coordinatorId: data.coordenadorId ? Number(data.coordenadorId) : null,
      internId: data.estagiarioId ? Number(data.estagiarioId) : null,
    };
    const created = await associateService.create(request);
    const caso = mapAssociateToCaso(created);
    setCasos((prev) => [...prev, caso]);
    return caso;
  };

  const updateCaso = async (id: string, updates: Partial<Caso>) => {
    const current = casos.find((c) => c.id === id);
    if (!current) return;
    const merged: Caso = { ...current, ...updates };
    const updated = await associateService.update(Number(id), casoToAssociateRequest(merged));
    setCasos((prev) => prev.map((c) => (c.id === id ? mapAssociateToCaso(updated, c) : c)));
  };

  const removeCaso = async (id: string) => {
    await associateService.remove(Number(id));
    setCasos((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CasosContext.Provider value={{ casos, loading, error, refreshCasos, addCaso, updateCaso, removeCaso }}>
      {children}
    </CasosContext.Provider>
  );
};

export const useCasos = () => {
  const ctx = useContext(CasosContext);
  if (!ctx) throw new Error('useCasos must be used within CasosProvider');
  return ctx;
};
