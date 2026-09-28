import type { User } from '../../domain/entities/User';

export const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Carlos', lastName: 'Mendoza', username: 'admin', email: 'admin@siga.demo', phone: '+51 999 001 001', role: 'admin', status: 'active', scope: 'Global', createdAt: '2024-01-15', lastAccess: '2025-08-24 08:32' },
  { id: 'u2', name: 'Patricia', lastName: 'Torres', username: 'supervisor', email: 'supervisor@siga.demo', phone: '+51 999 002 002', role: 'supervisor', status: 'active', scope: 'Almacén Principal', createdAt: '2024-02-01', lastAccess: '2025-08-24 07:58' },
  { id: 'u3', name: 'Jorge', lastName: 'Quispe', username: 'almacen', email: 'almacen@siga.demo', phone: '+51 999 003 003', role: 'warehouse', status: 'active', scope: 'Almacén Principal', createdAt: '2024-02-15', lastAccess: '2025-08-23 16:45' },
  { id: 'u6', name: 'Ana', lastName: 'Ríos', username: 'arios', email: 'arios@siga.demo', phone: '+51 999 006 006', role: 'warehouse', status: 'inactive', scope: 'Almacén Principal', createdAt: '2024-01-20', lastAccess: '2025-06-10 14:00' },
];
