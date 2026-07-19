import { UserRoleApi } from '@/types/api';
import { UserRole } from '@/types';

export const roleApiToFrontend = (role: UserRoleApi): UserRole => {
  switch (role) {
    case 'ADMINISTRATOR':
      return 'master';
    case 'COORDINATOR':
      return 'coordenador';
    case 'INTERN':
    default:
      return 'estagiario';
  }
};

export const roleFrontendToApi = (role: UserRole): UserRoleApi => {
  switch (role) {
    case 'master':
      return 'ADMINISTRATOR';
    case 'coordenador':
      return 'COORDINATOR';
    case 'estagiario':
    default:
      return 'INTERN';
  }
};

export const roleLabelsApi: Record<UserRoleApi, string> = {
  ADMINISTRATOR: 'Administrador',
  COORDINATOR: 'Coordenador(a)',
  INTERN: 'Estagiário(a)',
};
