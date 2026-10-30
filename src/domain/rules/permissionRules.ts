import type { UserRole } from '../entities/User';
import type { User } from '../entities/User';

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
    counts: ['view'],
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
    counts: ['view'],
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
    counts: ['view'],
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

const CAPABILITIES: Record<string, Record<string, string[]>> = {
  inventory: { view: ['INVENTORY_READ'] },
  locationAdmin: { view: ['LOCATION_MANAGE'], create: ['LOCATION_MANAGE'], edit: ['LOCATION_MANAGE'] },
  traceabilityAdmin: {
    view: ['INVENTORY_READ', 'TRACEABILITY_MANAGE'],
    create: ['TRACEABILITY_MANAGE'],
    edit: ['TRACEABILITY_MANAGE'],
  },
  entries: { view: ['INVENTORY_READ'], create: ['MOVEMENT_CREATE'] },
  exits: { view: ['INVENTORY_READ'], create: ['MOVEMENT_CREATE'] },
  transfers: { view: ['INVENTORY_READ'], create: ['MOVEMENT_CREATE'] },
  adjustments: { view: ['INVENTORY_READ'], create: ['INVENTORY_ADJUST'], authorize: ['MOVEMENT_AUTHORIZE'] },
  counts: { view: ['INVENTORY_COUNT'] },
  authorizations: { view: ['MOVEMENT_AUTHORIZE'], authorize: ['MOVEMENT_AUTHORIZE'] },
  reports: { view: ['REPORT_READ'] },
  analytics: { view: ['REPORT_READ'] },
  users: { view: ['USER_MANAGE'], create: ['USER_MANAGE'], edit: ['USER_MANAGE'] },
  roles: { view: ['ROLE_MANAGE'] },
  categories: { view: ['CATALOG_READ', 'PRODUCT_WRITE'], create: ['PRODUCT_WRITE'] },
  units: { view: ['CATALOG_READ', 'PRODUCT_WRITE'], create: ['PRODUCT_WRITE'] },
  products: { view: ['CATALOG_READ', 'PRODUCT_WRITE'], create: ['PRODUCT_WRITE'], edit: ['PRODUCT_WRITE'] },
  suppliers: {
    view: ['CATALOG_READ', 'SUPPLIER_MANAGE'],
    create: ['SUPPLIER_MANAGE'],
    edit: ['SUPPLIER_MANAGE'],
  },
};

export function hasUserPermission(user: User | null | undefined, module: string, action = 'view'): boolean {
  if (!user) return false;
  const required = CAPABILITIES[module]?.[action];
  const effectivePermissions = user.permissions;
  if (required) {
    const grantedByClaim = effectivePermissions?.some(permission => required.includes(permission));
    if (module === 'suppliers' || module === 'categories' || module === 'units' || module === 'products' || module === 'traceabilityAdmin') return grantedByClaim ?? false;
    return grantedByClaim ?? hasPermission(user.role, module, action);
  }
  return hasPermission(user.role, module, action);
}

/** ¿Tiene este rol alguna acción permitida sobre `module`? (para mostrar u ocultar, no para autorizar una acción concreta). */
export function hasAnyPermission(role: UserRole | undefined, module: string): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] ?? {};
  return (permissions[module] ?? []).length > 0;
}
