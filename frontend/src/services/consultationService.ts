import { apiFetch, buildQuery } from '@/lib/api';
import { ApiPage, ConsultationRequest, ConsultationResponse } from '@/types/api';

export const consultationService = {
  byAssociate: (associateId: number, params?: { page?: number; size?: number }) =>
    apiFetch<ApiPage<ConsultationResponse>>(
      `/consultations/associate/${associateId}${buildQuery({
        page: params?.page ?? 0,
        size: params?.size ?? 100,
      })}`,
    ),

  create: (data: ConsultationRequest) =>
    apiFetch<ConsultationResponse>('/consultations', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: ConsultationRequest) =>
    apiFetch<ConsultationResponse>(`/consultations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  remove: (id: number) => apiFetch<void>(`/consultations/${id}`, { method: 'DELETE' }),
};
