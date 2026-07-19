import { apiFetch } from '@/lib/api';
import { RegisterRequest, UserResponse, UserRoleApi, UserUpdateRequest } from '@/types/api';

export const userService = {
  list: () => apiFetch<UserResponse[]>('/users'),

  getById: (id: number) => apiFetch<UserResponse>(`/users/${id}`),

  byRole: (role: UserRoleApi) => apiFetch<UserResponse[]>(`/users/role/${role}`),

  internsByCoordinator: (coordinatorId: number) =>
    apiFetch<UserResponse[]>(`/users/coordinator/${coordinatorId}/estagiarios`),

  create: (data: RegisterRequest) =>
    apiFetch<UserResponse>('/users', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: UserUpdateRequest) =>
    apiFetch<UserResponse>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  /** No backend isso não apaga o usuário: apenas marca status=false (inativa). */
  inactivate: (id: number) => apiFetch<void>(`/users/${id}`, { method: 'DELETE' }),
};
