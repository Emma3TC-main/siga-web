import type { Authorization } from '../entities/Authorization';

export type AuthorizationStatus = Authorization['status'];

export function filterAuthorizationsByStatus(authorizations: readonly Authorization[], status: string): Authorization[] {
  return authorizations.filter(authorization => authorization.status === status);
}

export function countAuthorizationsByStatus(authorizations: readonly Authorization[]): Record<'pendiente' | 'aprobado' | 'rechazado', number> {
  return {
    pendiente: filterAuthorizationsByStatus(authorizations, 'pendiente').length,
    aprobado: filterAuthorizationsByStatus(authorizations, 'aprobado').length,
    rechazado: filterAuthorizationsByStatus(authorizations, 'rechazado').length,
  };
}
