import type { ComponentType } from 'react';
import type { UserRole } from '../../types';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import SupervisorDashboard from '../pages/dashboard/SupervisorDashboard';
import WarehouseDashboard from '../pages/dashboard/WarehouseDashboard';
import Inventory from '../pages/inventory/Inventory';
import Entries from '../pages/movements/Entries';
import Exits from '../pages/movements/Exits';
import Transfers from '../pages/movements/Transfers';
import Adjustments from '../pages/movements/Adjustments';
import PhysicalCount from '../pages/movements/PhysicalCount';
import Authorizations from '../pages/authorizations/Authorizations';
import Machinery from '../pages/machinery/Machinery';
import Traceability from '../pages/traceability/Traceability';
import Analytics from '../pages/analytics/Analytics';
import Audit from '../pages/audit/Audit';
import Reports from '../pages/reports/Reports';
import Products from '../pages/catalog/Products';
import Suppliers from '../pages/catalog/Suppliers';
import Categories from '../pages/catalog/Categories';
import Units from '../pages/catalog/Units';
import Locations from '../pages/locations/Locations';
import Users from '../pages/admin/Users';
import RolesPermissions from '../pages/admin/RolesPermissions';
import Parameters from '../pages/admin/Parameters';
import Integrations from '../pages/integrations/Integrations';
import Alerts from '../pages/alerts/Alerts';
import Profile from '../pages/profile/Profile';
import Continuity from '../pages/continuity/Continuity';

export type RouteId =
  | 'login' | 'dashboard' | 'inventory'
  | 'movements' | 'entries' | 'exits' | 'transfers' | 'adjustments' | 'physical-count' | 'physical-count-title'
  | 'catalog' | 'products' | 'categories' | 'units' | 'suppliers'
  | 'locations' | 'machinery' | 'traceability' | 'history' | 'authorizations'
  | 'reports' | 'audit' | 'analytics'
  | 'administration' | 'users' | 'roles' | 'parameters'
  | 'integrations' | 'continuity' | 'alerts' | 'profile'
  | 'responsibles-title' | 'cost-centers-title' | 'movement-types-title';

export type RouteStatus = 'core' | 'demo' | 'disconnected' | 'mobile-evidence';
export type RouteViewport = '<md' | 'md+';

export interface RouteDefinition {
  id: RouteId;
  path: string;
  aliases: readonly string[];
  component: ComponentType | null;
  componentsByRole?: Partial<Record<UserRole, ComponentType>>;
  requiredModule: string | null;
  requiredAction: 'view' | null;
  guard: 'module' | 'none';
  renderable: boolean;
  reachable: boolean;
  producers: readonly string[];
  roles: readonly UserRole[];
  viewport: readonly RouteViewport[];
  title: string;
  navigationLabel: string;
  breadcrumbs: readonly string[];
  fallback: 'generic-dashboard' | null;
  status: RouteStatus;
}

const ALL_ROLES: readonly UserRole[] = ['admin', 'supervisor', 'warehouse'];
const ADMIN_SUPERVISOR: readonly UserRole[] = ['admin', 'supervisor'];
const REPORT_ROLES: readonly UserRole[] = ['admin', 'supervisor', 'warehouse'];
const SUPPLIER_ROLES: readonly UserRole[] = ['admin', 'supervisor', 'warehouse'];
const ALL_VIEWPORTS: readonly RouteViewport[] = ['<md', 'md+'];

const route = (
  definition: Omit<RouteDefinition, 'aliases' | 'requiredAction' | 'viewport' | 'fallback'> &
    Partial<Pick<RouteDefinition, 'aliases' | 'requiredAction' | 'viewport' | 'fallback'>>,
): RouteDefinition => ({
  aliases: [],
  requiredAction: definition.requiredModule ? 'view' : null,
  viewport: ALL_VIEWPORTS,
  fallback: null,
  ...definition,
});

/**
 * Registry descriptivo de la navegación observada en la baseline 2B.
 *
 * Los aliases son evidencia, no redirects. `reachable` describe si existe un
 * productor UI real; no concede permisos ni conecta rutas desconectadas.
 */
export const ROUTE_REGISTRY: readonly RouteDefinition[] = [
  route({ id: 'login', path: '/login', component: Login, requiredModule: null, guard: 'none', renderable: true, reachable: true, producers: ['initialState', 'logout'], roles: [], title: 'SIGA', navigationLabel: 'Login', breadcrumbs: [], status: 'demo' }),
  route({ id: 'dashboard', path: '/dashboard', component: Dashboard, componentsByRole: { supervisor: SupervisorDashboard, warehouse: WarehouseDashboard }, requiredModule: null, guard: 'none', renderable: true, reachable: true, producers: ['login', 'Sidebar', 'MobileNav', 'breadcrumbs', 'ForbiddenPage'], roles: ALL_ROLES, title: 'Dashboard', navigationLabel: 'Dashboard', breadcrumbs: ['Dashboard'], status: 'core' }),
  route({ id: 'inventory', path: '/inventario', component: Inventory, requiredModule: 'inventory', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'Header.search', 'Dashboard', 'WarehouseDashboard', 'Alert.actionRoute'], roles: ALL_ROLES, title: 'Inventario', navigationLabel: 'Inventario', breadcrumbs: ['Inicio', 'Inventario'], status: 'core' }),

  route({ id: 'movements', path: '/movimientos', component: null, requiredModule: null, guard: 'none', renderable: false, reachable: false, producers: ['Sidebar.expand'], roles: ALL_ROLES, title: 'SIGA', navigationLabel: 'Movimientos', breadcrumbs: ['Dashboard', 'Movimientos'], status: 'demo' }),
  route({ id: 'entries', path: '/movimientos/entradas', component: Entries, requiredModule: 'entries', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'Header.search', 'Dashboard', 'WarehouseDashboard', 'Inventory'], roles: ALL_ROLES, title: 'Entradas', navigationLabel: 'Entradas', breadcrumbs: ['Dashboard', 'Movimientos', 'Entradas'], status: 'core' }),
  route({ id: 'exits', path: '/movimientos/salidas', component: Exits, requiredModule: 'exits', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'Header.search', 'Dashboard', 'WarehouseDashboard', 'Inventory'], roles: ALL_ROLES, title: 'Salidas', navigationLabel: 'Salidas', breadcrumbs: ['Dashboard', 'Movimientos', 'Salidas'], status: 'core' }),
  route({ id: 'transfers', path: '/movimientos/transferencias', component: Transfers, requiredModule: 'transfers', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'Header.search', 'WarehouseDashboard', 'Inventory'], roles: ALL_ROLES, title: 'Transferencias', navigationLabel: 'Transferencias', breadcrumbs: ['Dashboard', 'Movimientos', 'Transferencias'], status: 'core' }),
  route({ id: 'adjustments', path: '/movimientos/ajustes', component: Adjustments, requiredModule: 'adjustments', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'Header.search', 'SupervisorDashboard'], roles: ADMIN_SUPERVISOR, title: 'Ajustes', navigationLabel: 'Ajustes', breadcrumbs: ['Dashboard', 'Movimientos', 'Ajustes de inventario'], status: 'core' }),
  route({ id: 'physical-count', path: '/movimientos/conteo', aliases: ['/movimientos/conteos'], component: PhysicalCount, requiredModule: 'inventory', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav'], roles: ALL_ROLES, title: 'SIGA', navigationLabel: 'Conteos físicos', breadcrumbs: ['Dashboard', 'Movimientos', 'Conteo Físico'], status: 'core' }),
  route({ id: 'physical-count-title', path: '/movimientos/conteos', aliases: ['/movimientos/conteo'], component: null, requiredModule: null, requiredAction: null, guard: 'none', renderable: false, reachable: false, producers: ['Header.title-map'], roles: [], title: 'Conteos físicos', navigationLabel: 'Conteos físicos', breadcrumbs: [], status: 'demo' }),

  route({ id: 'catalog', path: '/catalogo', component: null, requiredModule: null, guard: 'none', renderable: false, reachable: false, producers: ['Sidebar.expand'], roles: ALL_ROLES, title: 'SIGA', navigationLabel: 'Catálogo', breadcrumbs: ['Dashboard', 'Catálogo'], status: 'demo' }),
  route({ id: 'products', path: '/catalogo/productos', component: Products, requiredModule: 'catalogs', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav'], roles: ALL_ROLES, title: 'Catálogo de Productos', navigationLabel: 'Productos', breadcrumbs: ['Dashboard', 'Catálogo', 'Productos'], status: 'core' }),
  route({ id: 'categories', path: '/catalogo/categorias', component: Categories, requiredModule: 'catalogs', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav'], roles: ALL_ROLES, title: 'Categorías', navigationLabel: 'Categorías', breadcrumbs: ['Dashboard', 'Catálogo', 'Categorías'], status: 'core' }),
  route({ id: 'units', path: '/catalogo/unidades', component: Units, requiredModule: 'catalogs', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav'], roles: ALL_ROLES, title: 'Unidades de Medida', navigationLabel: 'Unidades de medida', breadcrumbs: ['Dashboard', 'Catálogo', 'Unidades de medida'], status: 'core' }),
  route({ id: 'suppliers', path: '/catalogo/proveedores', component: Suppliers, requiredModule: 'suppliers', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav'], roles: SUPPLIER_ROLES, title: 'SIGA', navigationLabel: 'Proveedores', breadcrumbs: ['Dashboard', 'Catálogo', 'Proveedores'], status: 'core' }),

  route({ id: 'locations', path: '/ubicaciones', component: Locations, requiredModule: 'inventory', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'Header.search', 'Dashboard', 'WarehouseDashboard'], roles: ALL_ROLES, title: 'Ubicaciones', navigationLabel: 'Ubicaciones', breadcrumbs: ['Dashboard', 'Ubicaciones'], status: 'core' }),
  route({ id: 'machinery', path: '/maquinaria', component: Machinery, requiredModule: 'inventory', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'Dashboard', 'WarehouseDashboard', 'Alert.actionRoute'], roles: ALL_ROLES, title: 'Maquinaria y Activos', navigationLabel: 'Maquinaria y activos', breadcrumbs: ['Dashboard', 'Maquinaria'], status: 'core' }),
  route({ id: 'traceability', path: '/trazabilidad', aliases: ['/historial'], component: Traceability, requiredModule: 'history', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar.admin/supervisor', 'MobileNav.admin/supervisor'], roles: ALL_ROLES, title: 'Trazabilidad', navigationLabel: 'Trazabilidad', breadcrumbs: ['Dashboard', 'Trazabilidad'], status: 'core' }),
  route({ id: 'history', path: '/historial', aliases: ['/trazabilidad'], component: Traceability, requiredModule: 'history', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar.warehouse', 'MobileNav.warehouse', 'WarehouseDashboard'], roles: ALL_ROLES, title: 'SIGA', navigationLabel: 'Historial', breadcrumbs: ['Dashboard', 'Trazabilidad'], status: 'core' }),
  route({ id: 'authorizations', path: '/autorizaciones', component: Authorizations, requiredModule: 'authorizations', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'Dashboard', 'SupervisorDashboard', 'Alert.actionRoute'], roles: ADMIN_SUPERVISOR, title: 'Autorizaciones', navigationLabel: 'Autorizaciones', breadcrumbs: ['Dashboard', 'Autorizaciones'], status: 'core' }),
  route({ id: 'reports', path: '/reportes', component: Reports, requiredModule: 'reports', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'Dashboard', 'SupervisorDashboard'], roles: REPORT_ROLES, title: 'Reportes', navigationLabel: 'Reportes', breadcrumbs: ['Dashboard', 'Reportes'], status: 'core' }),
  route({ id: 'audit', path: '/auditoria', component: Audit, requiredModule: 'audit', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'SupervisorDashboard'], roles: ADMIN_SUPERVISOR, title: 'Auditoría', navigationLabel: 'Auditoría', breadcrumbs: ['Dashboard', 'Auditoría'], status: 'core' }),
  route({ id: 'analytics', path: '/indicadores', component: Analytics, requiredModule: 'analytics', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav', 'SupervisorDashboard'], roles: ADMIN_SUPERVISOR, title: 'Indicadores Analíticos', navigationLabel: 'Indicadores', breadcrumbs: ['Dashboard', 'Indicadores'], status: 'core' }),

  route({ id: 'administration', path: '/administracion', component: null, requiredModule: 'users', guard: 'module', renderable: false, reachable: false, producers: ['Sidebar.expand'], roles: ['admin'], title: 'SIGA', navigationLabel: 'Administración', breadcrumbs: ['Dashboard', 'Administración'], status: 'demo' }),
  route({ id: 'users', path: '/admin/usuarios', component: Users, requiredModule: 'users', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav'], roles: ['admin'], title: 'Usuarios', navigationLabel: 'Usuarios', breadcrumbs: ['Dashboard', 'Administración', 'Usuarios'], status: 'core' }),
  route({ id: 'roles', path: '/admin/roles', component: RolesPermissions, requiredModule: 'users', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav'], roles: ['admin'], title: 'Roles y Permisos', navigationLabel: 'Roles y permisos', breadcrumbs: ['Dashboard', 'Administración', 'Roles y Permisos'], status: 'core' }),
  route({ id: 'parameters', path: '/admin/parametros', component: Parameters, requiredModule: 'config', guard: 'module', renderable: true, reachable: true, producers: ['Sidebar', 'MobileNav'], roles: ['admin'], title: 'Parámetros', navigationLabel: 'Parámetros', breadcrumbs: ['Dashboard', 'Administración', 'Parámetros'], status: 'core' }),
  route({ id: 'responsibles-title', path: '/administracion/responsables', component: null, requiredModule: null, requiredAction: null, guard: 'none', renderable: false, reachable: false, producers: ['Header.title-map'], roles: [], title: 'Responsables', navigationLabel: 'Responsables', breadcrumbs: [], status: 'demo' }),
  route({ id: 'cost-centers-title', path: '/administracion/centros-costo', component: null, requiredModule: null, requiredAction: null, guard: 'none', renderable: false, reachable: false, producers: ['Header.title-map'], roles: [], title: 'Centros de Costo', navigationLabel: 'Centros de Costo', breadcrumbs: [], status: 'demo' }),
  route({ id: 'movement-types-title', path: '/administracion/tipos-movimiento', component: null, requiredModule: null, requiredAction: null, guard: 'none', renderable: false, reachable: false, producers: ['Header.title-map'], roles: [], title: 'Tipos de Movimiento', navigationLabel: 'Tipos de Movimiento', breadcrumbs: [], status: 'demo' }),

  route({ id: 'integrations', path: '/integraciones', component: Integrations, requiredModule: 'integrations', guard: 'module', renderable: true, reachable: false, producers: ['App.activeRoute'], roles: ['admin'], title: 'Integraciones', navigationLabel: 'Integraciones', breadcrumbs: ['Dashboard', 'Integraciones'], status: 'disconnected' }),
  route({ id: 'continuity', path: '/continuidad', component: Continuity, requiredModule: 'continuity', guard: 'module', renderable: true, reachable: false, producers: ['App.activeRoute'], roles: ['admin'], title: 'Continuidad y Monitoreo', navigationLabel: 'Continuidad', breadcrumbs: ['Dashboard', 'Continuidad'], status: 'disconnected' }),
  route({ id: 'alerts', path: '/alertas', component: Alerts, requiredModule: null, requiredAction: null, guard: 'none', renderable: true, reachable: true, producers: ['Header', 'Sidebar.indicator', 'MobileNav', 'Dashboard', 'SupervisorDashboard'], roles: ALL_ROLES, title: 'Centro de Alertas', navigationLabel: 'Alertas', breadcrumbs: ['Dashboard', 'Alertas'], status: 'core' }),
  route({ id: 'profile', path: '/perfil', component: Profile, requiredModule: null, requiredAction: null, guard: 'none', renderable: true, reachable: true, producers: ['Header', 'MobileNav'], roles: ALL_ROLES, title: 'Mi Perfil', navigationLabel: 'Mi perfil', breadcrumbs: ['Dashboard', 'Perfil'], status: 'core' }),
] as const;

const ROUTES_BY_ID = new Map(ROUTE_REGISTRY.map(definition => [definition.id, definition]));
const ROUTES_BY_PATH = new Map(ROUTE_REGISTRY.map(definition => [definition.path, definition]));

export const UNKNOWN_ROUTE_FALLBACK = {
  component: Dashboard,
  title: 'SIGA',
  preservesActiveRoute: true,
  behavior: 'generic-dashboard',
} as const;

export function getRouteById(id: RouteId): RouteDefinition {
  const definition = ROUTES_BY_ID.get(id);
  if (!definition) throw new Error(`Route registry entry not found: ${id}`);
  return definition;
}

export function routePath(id: RouteId): string {
  return getRouteById(id).path;
}

/** Exact lookup only: aliases remain descriptive and never redirect. */
export function getRouteByPath(path: string): RouteDefinition | undefined {
  return ROUTES_BY_PATH.get(path);
}

export function getHeaderTitle(path: string): string {
  return getRouteByPath(path)?.title ?? UNKNOWN_ROUTE_FALLBACK.title;
}

export function getRouteComponent(definition: RouteDefinition, role: UserRole): ComponentType | null {
  return definition.componentsByRole?.[role] ?? definition.component;
}

export type RegistryBreadcrumb = { label: string; onClick?: () => void };

export function getBreadcrumbs(id: RouteId, navigate: (path: string) => void): RegistryBreadcrumb[] {
  const definition = getRouteById(id);
  return definition.breadcrumbs.map((label, index) => index === 0 && definition.path !== '/dashboard'
    ? { label, onClick: () => navigate(routePath('dashboard')) }
    : { label });
}

/** Preserve runtime actionRoute strings; this is validation, not normalization. */
export function isRegisteredActionRoute(path: string): boolean {
  return Boolean(getRouteByPath(path)?.renderable);
}

/**
 * Consults the registry without normalizing or rejecting the stored value.
 * Unknown action routes must retain the baseline generic-dashboard fallback.
 */
export function actionRoutePath(path: string): string {
  isRegisteredActionRoute(path);
  return path;
}
