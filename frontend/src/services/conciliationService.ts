import { apiFetch } from '@/lib/api';
import { CitationStatusApi, ConciliationRequest, ConciliationResponse } from '@/types/api';

export const conciliationService = {
  byAssociate: (associateId: number) =>
    apiFetch<ConciliationResponse[]>(`/conciliations/associate/${associateId}`),

  nextAudiences: (dias = 7) =>
    apiFetch<ConciliationResponse[]>(`/conciliations/next-audiences?dias=${dias}`),

  create: (data: ConciliationRequest) =>
    apiFetch<ConciliationResponse>('/conciliations', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: ConciliationRequest) =>
    apiFetch<ConciliationResponse>(`/conciliations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateStatus: (id: number, status: CitationStatusApi) =>
    apiFetch<ConciliationResponse>(`/conciliations/${id}/citation-status?status=${status}`, {
      method: 'PATCH',
    }),

  remove: (id: number) => apiFetch<void>(`/conciliations/${id}`, { method: 'DELETE' }),
};
