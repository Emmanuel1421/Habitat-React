import { apiFetch } from '@/lib/api';
import { LoginRequest, LoginResponse } from '@/types/api';

export const authService = {
  login: (data: LoginRequest) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: false,
    }),
};
