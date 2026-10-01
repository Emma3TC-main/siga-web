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
  if (
    item.id === 'historial' &&
    (currentUser?.role === 'admin' || currentUser?.role === 'supervisor')
  ) return null;

  if (
    item.id === 'trazabilidad' &&
    currentUser?.role === 'warehouse'
  ) return null;

  const active = isActive(item.route);
  const expanded = expandedItems.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;
  const isSupervisorAuth =
    isSupervisor && item.id === 'autorizaciones';

  return (
    <div key={item.id}>

      {isSupervisorAuth && !sidebarCollapsed && (
        <div className="mx-2 mb-1 mt-2 px-1">
          <div className="h-px bg-[#6FD1D7]/20" />
        </div>
      )}

      <div
        className={`
          relative flex items-center gap-3
          px-3 py-2.5
          rounded-lg
          cursor-pointer
          transition-all duration-200

          ${depth > 0 ? 'ml-5 pl-3' : ''}

          ${
            active && !hasChildren
              ? 'bg-white/10 text-white'
              : 'text-white/65 hover:text-white hover:bg-white/5'
          }

          ${
            isSupervisorAuth
              ? 'border border-[#6FD1D7]/25 bg-[#6FD1D7]/5'
              : ''
          }
        `}
        onClick={() => {
          if (hasChildren) toggleExpand(item.id);
          else navigate(item.route);
        }}
      >

        {/* Barra lateral para opción activa */}
        {active && !hasChildren && (
          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#6FD1D7]" />
        )}

        {/* Icono */}
        <span
          className={`
            flex-shrink-0
            w-8 h-8
            rounded-lg
            flex items-center justify-center
            transition-colors

            ${
              active
                ? 'bg-[#6FD1D7]/15 text-[#6FD1D7]'
                : isSupervisorAuth
                ? 'bg-[#6FD1D7]/10 text-[#6FD1D7]'
                : 'text-white/55'
            }
          `}
        >
          {item.icon}
        </span>

        {!sidebarCollapsed && (
          <>

            {/* Texto */}
            <span
              className={`
                flex-1 text-sm

                ${
                  active
                    ? 'font-semibold text-white'
                    : isSupervisorAuth
                    ? 'text-[#6FD1D7] font-semibold'
                    : 'font-medium'
                }
              `}
            >
              {item.label}
            </span>

            {/* Badge */}
            {item.badge !== undefined && item.badge > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500/90 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}

            {/* Flecha */}
            {hasChildren && (
              <span className="ml-auto text-white/40">
                {expanded
                  ? <ChevronDownIcon size={14} />
                  : <ChevronRightIcon size={14} />
                }
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

      {/* Submenú */}
      {hasChildren && expanded && !sidebarCollapsed && (
        <div className="mt-1 space-y-1">
          {item.children!.map(child =>
            renderItem(child, depth + 1)
          )}
        </div>
      )}

    </div>
  );
}

return (
  <aside
    className={`flex flex-col h-full transition-all duration-200 border-r border-white/5 shadow-xl ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}
    style={{
      background:
        'linear-gradient(180deg, #093C5D 0%, #082F49 100%)',
    }}
  >

    {/* Logo */}
    <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0 bg-white/[0.02]">

      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6FD1D7] to-[#5DF8D8] flex items-center justify-center flex-shrink-0 shadow-md">

        <span className="text-[#093C5D] font-bold text-xs font-display">
          S
        </span>

      </div>

      {!sidebarCollapsed && (
        <div>

          <div className="text-white font-bold text-sm font-display leading-none">
            SIGA
          </div>

          <div className="text-white/40 text-[10px] leading-none mt-1 font-mono">
            WMS v1.0
          </div>

        </div>
      )}

    </div>


    {/* Navegación */}
    <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">

      {navItems.map(item =>
        renderItem(item)
      )}

    </nav>


    {/* Alertas */}
    {!sidebarCollapsed && unreadAlerts > 0 && (

      <div
        className="mx-3 mb-3 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-400/20 cursor-pointer hover:bg-red-500/15 transition-colors"
        onClick={() =>
          navigate(routePath('alerts'))
        }
      >

        <div className="flex items-center gap-2">

          <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center">

            <AlertIcon
              size={14}
              className="text-red-300"
            />

          </div>

          <span className="text-red-200 text-xs font-medium">
            {unreadAlerts} alertas activas
          </span>

        </div>

      </div>
    )}


    {/* Información de usuario */}
    {currentUser && (

      <div
        className={`border-t border-white/10 p-3 flex-shrink-0 bg-black/5 ${
          sidebarCollapsed
            ? 'flex justify-center'
            : ''
        }`}
      >

        {sidebarCollapsed ? (

          <div className="w-9 h-9 rounded-xl bg-[#3B7597] flex items-center justify-center text-white text-xs font-bold shadow-sm">

            {currentUser.name[0]}
            {currentUser.lastName[0]}

          </div>

        ) : (

          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-[#3B7597] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">

              {currentUser.name[0]}
              {currentUser.lastName[0]}

            </div>

            {/* Datos */}
            <div className="min-w-0">

              <div className="text-white text-xs font-semibold truncate">

                {currentUser.name} {currentUser.lastName}

              </div>

              <div className="text-white/40 text-[10px] capitalize truncate">

                {currentUser.role === 'admin'
                  ? 'Administrador'
                  : currentUser.role === 'supervisor'
                  ? 'Supervisor de Almacén'
                  : 'Encargado de Almacén'}

              </div>

            </div>

          </div>
        )}

      </div>
    )}

  </aside>
);
}
