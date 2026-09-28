import type { UserRole } from '../entities/User';

/**
 * Matriz de permisos por rol: para cada módulo, las acciones permitidas.
 * Es la única fuente de verdad de RBAC en este frontend; un backend futuro
 * debe validar los mismos permisos del lado del servidor (ver §14 del prompt).
 */
export const ROLE_PERMISSIONS: Record<UserRole, Record<string, string[]>> = {
  admin: {
    inventory: ['view', 'create', 'edit', 'delete'],
    entries: ['view', 'create'],
    exits: ['view', 'create', 'authorize'],
    transfers: ['view', 'create'],
    adjustments: ['view', 'create', 'authorize'],
    authorizations: ['view', 'authorize'],
    reports: ['view', 'export'],
    history: ['view'],
    audit: ['view'],
    users: ['view', 'create', 'edit', 'delete'],
    catalogs: ['view', 'create', 'edit', 'delete'],
    suppliers: ['view', 'create', 'edit'],
    config: ['view', 'edit'],
    costs: ['view'],
    analytics: ['view'],
    integrations: ['view'],
    continuity: ['view'],
  },
  supervisor: {
    inventory: ['view'],
    entries: ['view', 'create'],
    exits: ['view', 'create', 'authorize'],
    transfers: ['view', 'create'],
    adjustments: ['view', 'create', 'authorize'],
    authorizations: ['view', 'authorize'],
    reports: ['view', 'export'],
    history: ['view'],
    audit: ['view'],
    users: [],
    catalogs: ['view'],
    suppliers: ['view'],
    config: [],
    costs: ['view'],
    analytics: ['view'],
    integrations: [],
    continuity: [],
  },
  warehouse: {
    inventory: ['view'],
    entries: ['view', 'create'],
    exits: ['view', 'create'],
    transfers: ['view', 'create'],
    adjustments: [],
    authorizations: [],
    reports: ['view'],
    history: ['view'],
    audit: [],
    users: [],
    catalogs: ['view'],
    suppliers: ['view'],
    config: [],
    costs: [],
    analytics: [],
    integrations: [],
    continuity: [],
  },
};

/** ¿Puede este rol realizar `action` (por defecto "view") sobre `module`? */
export function hasPermission(role: UserRole | undefined, module: string, action = 'view'): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] ?? {};
  return (permissions[module] ?? []).includes(action);
}

/** ¿Tiene este rol alguna acción permitida sobre `module`? (para mostrar u ocultar, no para autorizar una acción concreta). */
export function hasAnyPermission(role: UserRole | undefined, module: string): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] ?? {};
  return (permissions[module] ?? []).length > 0;
}
