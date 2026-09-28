export type UserRole = 'admin' | 'supervisor' | 'warehouse';

export interface User {
  id: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  scope?: string;
  createdAt: string;
  lastAccess?: string;
  avatar?: string;
}

/** Datos para dar de alta un usuario. `id` y `createdAt` los asigna la fuente de datos. */
export type NewUser = Omit<User, 'id' | 'createdAt'>;

/** Campos editables de un usuario existente. */
export type UserChanges = Partial<Omit<User, 'id' | 'createdAt'>>;
