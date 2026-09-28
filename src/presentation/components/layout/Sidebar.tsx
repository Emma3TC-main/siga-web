import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useAuthorizations } from '../../hooks/useAuthorizations';
import { hasAnyPermission } from '../../../domain/rules/permissionRules';
import { getRouteById, routePath, type RouteId } from '../../navigation/routeRegistry';
import {
  HomeIcon, PackageIcon, ArrowDownIcon, ArrowUpIcon, ArrowsIcon, AdjustIcon, ClipboardIcon,
  FolderIcon, MapPinIcon, TruckIcon, EyeIcon, ShieldIcon, BarChartIcon, ActivityIcon,
  UsersIcon, SettingsIcon, ChevronDownIcon, ChevronRightIcon,
  BellIcon, AlertIcon,
} from '../ui';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  badge?: number;
  requiredModule?: string;
  children?: NavItem[];
}

function navItem(routeId: RouteId, icon: React.ReactNode, options: Partial<NavItem> = {}): NavItem {
  const definition = getRouteById(routeId);
  return {
    id: options.id ?? routeId,
    label: definition.navigationLabel,
    icon,
    route: definition.path,
    requiredModule: definition.requiredModule ?? undefined,
    ...options,
  };
}

export default function Sidebar() {
  const { state, navigate, toggleSidebar } = useApp();
  const { activeRoute, sidebarCollapsed, alerts, currentUser } = state;
  const { authorizations } = useAuthorizations();
  const [expandedItems, setExpandedItems] = useState<string[]>(['movimientos']);

  const unreadAlerts = alerts.filter(a => !a.read).length;
  const pendingAuth = authorizations.filter(a => a.status === 'pendiente').length;

  const navItems: NavItem[] = [
    navItem('dashboard', <HomeIcon size={18} />, { id: 'dashboard' }),
    navItem('inventory', <PackageIcon size={18} />, { id: 'inventario' }),
    navItem('movements', <ArrowsIcon size={18} />, {
      id: 'movimientos',
      children: [
        navItem('entries', <ArrowDownIcon size={16} />, { id: 'entradas' }),
        navItem('exits', <ArrowUpIcon size={16} />, { id: 'salidas' }),
        navItem('transfers', <ArrowsIcon size={16} />, { id: 'transferencias' }),
        navItem('adjustments', <AdjustIcon size={16} />, { id: 'ajustes' }),
        navItem('physical-count', <ClipboardIcon size={16} />, { id: 'conteos' }),
      ],
    }),
    navItem('catalog', <FolderIcon size={18} />, {
      id: 'catalogo',
      children: [
        navItem('products', <PackageIcon size={16} />, { id: 'productos' }),
        navItem('categories', <FolderIcon size={16} />, { id: 'categorias' }),
        navItem('units', <AdjustIcon size={16} />, { id: 'unidades' }),
        navItem('suppliers', <TruckIcon size={16} />, { id: 'proveedores' }),
      ],
    }),
    navItem('locations', <MapPinIcon size={18} />, { id: 'ubicaciones' }),
    navItem('machinery', <TruckIcon size={18} />, { id: 'maquinaria' }),
    navItem('traceability', <EyeIcon size={18} />, { id: 'trazabilidad' }),
    navItem('history', <ClipboardIcon size={18} />, { id: 'historial' }),
    navItem('authorizations', <ShieldIcon size={18} />, { id: 'autorizaciones', badge: pendingAuth }),
    navItem('reports', <ClipboardIcon size={18} />, { id: 'reportes' }),
    navItem('audit', <ActivityIcon size={18} />, { id: 'auditoría' }),
    navItem('analytics', <BarChartIcon size={18} />, { id: 'indicadores' }),
    navItem('administration', <SettingsIcon size={18} />, {
      id: 'administracion',
      children: [
        navItem('users', <UsersIcon size={16} />, { id: 'usuarios' }),
        navItem('roles', <ShieldIcon size={16} />, { id: 'roles' }),
        navItem('parameters', <SettingsIcon size={16} />, { id: 'parametros' }),
      ],
    }),
  ];

  function hasAccess(item: NavItem): boolean {
    if (!item.requiredModule) return true;
    return hasAnyPermission(currentUser?.role, item.requiredModule);
  }

  function toggleExpand(id: string) {
    setExpandedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function isActive(route: string): boolean {
    return activeRoute === route || activeRoute.startsWith(route + '/');
  }

  const isSupervisor = currentUser?.role === 'supervisor';

  function renderItem(item: NavItem, depth = 0) {
    if (!hasAccess(item)) return null;

    // Hide Trazabilidad for roles that only have Historial; hide Historial for roles that have Trazabilidad
    if (item.id === 'historial' && (currentUser?.role === 'admin' || currentUser?.role === 'supervisor')) return null;
    if (item.id === 'trazabilidad' && currentUser?.role === 'warehouse') return null;

    const active = isActive(item.route);
    const expanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSupervisorAuth = isSupervisor && item.id === 'autorizaciones';

    return (
      <div key={item.id}>
        {isSupervisorAuth && !sidebarCollapsed && (
          <div className="mx-2 mb-1 mt-2 px-1">
            <div className="h-px bg-[#6FD1D7]/20" />
          </div>
        )}
        <div
          className={`sidebar-item ${active && !hasChildren ? 'active' : ''} ${depth > 0 ? 'pl-8' : ''} ${isSupervisorAuth ? 'border border-[#6FD1D7]/30 bg-[#6FD1D7]/5 rounded-lg mx-1' : ''}`}
          onClick={() => {
            if (hasChildren) toggleExpand(item.id);
            else navigate(item.route);
          }}
        >
          <span className={`flex-shrink-0 ${active ? 'text-[#6FD1D7]' : isSupervisorAuth ? 'text-[#6FD1D7]' : ''}`}>{item.icon}</span>
          {!sidebarCollapsed && (
            <>
              <span className={`flex-1 text-sm ${isSupervisorAuth ? 'text-[#6FD1D7] font-semibold' : ''}`}>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{item.badge > 99 ? '99+' : item.badge}</span>
              )}
              {hasChildren && (
                <span className="ml-auto opacity-50">
                  {expanded ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
                </span>
              )}
            </>
          )}
        </div>
        {isSupervisorAuth && !sidebarCollapsed && (
          <div className="mx-2 mt-1 mb-2">
            <div className="h-px bg-[#6FD1D7]/20" />
          </div>
        )}
        {hasChildren && expanded && !sidebarCollapsed && (
          <div className="mt-0.5">
            {item.children!.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className={`flex flex-col h-full transition-all duration-200 ${sidebarCollapsed ? 'w-14' : 'w-60'}`}
      style={{ backgroundColor: 'var(--sidebar-bg)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6FD1D7] to-[#5DF8D8] flex items-center justify-center flex-shrink-0">
          <span className="text-[#093C5D] font-bold text-xs font-display">S</span>
        </div>
        {!sidebarCollapsed && (
          <div>
            <div className="text-white font-bold text-sm font-display leading-none">SIGA</div>
            <div className="text-white/40 text-[10px] leading-none mt-0.5 font-mono">WMS v1.0</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(item => renderItem(item))}
      </nav>

      {/* Alert indicator */}
      {!sidebarCollapsed && unreadAlerts > 0 && (
        <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-400/30 cursor-pointer hover:bg-red-500/30 transition-colors" onClick={() => navigate(routePath('alerts'))}>
          <div className="flex items-center gap-2">
            <AlertIcon size={14} className="text-red-300" />
            <span className="text-red-200 text-xs font-medium">{unreadAlerts} alertas activas</span>
          </div>
        </div>
      )}

      {/* User info */}
      {currentUser && (
        <div className={`border-t border-white/10 p-3 flex-shrink-0 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          {sidebarCollapsed ? (
            <div className="w-8 h-8 rounded-full bg-[#3B7597] flex items-center justify-center text-white text-xs font-bold">
              {currentUser.name[0]}{currentUser.lastName[0]}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#3B7597] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {currentUser.name[0]}{currentUser.lastName[0]}
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-semibold truncate">{currentUser.name} {currentUser.lastName}</div>
                <div className="text-white/40 text-[10px] capitalize truncate">{currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'supervisor' ? 'Supervisor de Almacén' : 'Encargado de Almacén'}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
