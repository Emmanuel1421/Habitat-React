import { apiFetch } from '@/lib/api';
import { ProcessRequest, ProcessResponse, ProcessStatusApi } from '@/types/api';

export const processService = {
  byAssociate: (associateId: number) =>
    apiFetch<ProcessResponse[]>(`/processes/associate/${associateId}`),

  getById: (id: number) => apiFetch<ProcessResponse>(`/processes/${id}`),

  create: (data: ProcessRequest) =>
    apiFetch<ProcessResponse>('/processes', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: ProcessRequest) =>
    apiFetch<ProcessResponse>(`/processes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateStatus: (id: number, status: ProcessStatusApi) =>
    apiFetch<ProcessResponse>(`/processes/${id}/status?status=${status}`, { method: 'PATCH' }),

  remove: (id: number) => apiFetch<void>(`/processes/${id}`, { method: 'DELETE' }),
};
