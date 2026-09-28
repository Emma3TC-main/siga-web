import type { User } from '../entities/User';

export interface UserFilters {
  search: string;
  role: string;
}

export function filterUsers(users: readonly User[], filters: UserFilters): User[] {
  const query = filters.search.toLowerCase();
  return users.filter(user => {
    if (query
      && !user.name.toLowerCase().includes(query)
      && !user.lastName.toLowerCase().includes(query)
      && !user.email.toLowerCase().includes(query)) return false;
    if (filters.role && user.role !== filters.role) return false;
    return true;
  });
}

/** Un usuario nuevo sin nombre de usuario usa la parte local de su correo. */
export function defaultUsername(username: string, email: string): string {
  return username || email.split('@')[0];
}

export function validateUserIdentity(user: Pick<User, 'name' | 'email'>): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!user.name.trim()) errs.name = 'Nombre requerido.';
  if (!user.email.trim()) errs.email = 'Correo requerido.';
  return errs;
}
