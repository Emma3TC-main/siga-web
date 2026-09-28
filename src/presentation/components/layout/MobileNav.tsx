import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useAuthorizations } from '../../hooks/useAuthorizations';
import {
  ActivityIcon, AdjustIcon, ArrowDownIcon, ArrowUpIcon, ArrowsIcon, BarChartIcon,
  BellIcon, ClipboardIcon, EyeIcon, FolderIcon, HomeIcon, MapPinIcon,
  MenuIcon, PackageIcon, QrIcon, SettingsIcon, ShieldIcon,
  TruckIcon, UserIcon, UsersIcon, XIcon,
} from '../ui';

// ── Full module catalogue ──────────────────────────────────────────────────
type NavEntry = { label: string; route: string; module: string; icon: React.ReactNode };

const GROUPS: { title: string; items: NavEntry[] }[] = [
  {
    title: 'Movimientos',
    items: [
      { label: 'Entradas',        route: '/movimientos/entradas',       module: 'entries',       icon: <ArrowDownIcon size={18} /> },
      { label: 'Salidas',         route: '/movimientos/salidas',        module: 'exits',         icon: <ArrowUpIcon size={18} /> },
      { label: 'Transferencias',  route: '/movimientos/transferencias', module: 'transfers',     icon: <ArrowsIcon size={18} /> },
      { label: 'Ajustes',         route: '/movimientos/ajustes',        module: 'adjustments',   icon: <AdjustIcon size={18} /> },
      { label: 'Conteos físicos', route: '/movimientos/conteo',         module: 'inventory',     icon: <ClipboardIcon size={18} /> },
    ],
  },
  {
    title: 'Catálogo',
    items: [
      { label: 'Productos',         route: '/catalogo/productos',   module: 'catalogs',  icon: <PackageIcon size={18} /> },
      { label: 'Categorías',        route: '/catalogo/categorias',  module: 'catalogs',  icon: <FolderIcon size={18} /> },
      { label: 'Unidades de medida',route: '/catalogo/unidades',    module: 'catalogs',  icon: <AdjustIcon size={18} /> },
      { label: 'Proveedores',       route: '/catalogo/proveedores', module: 'suppliers', icon: <TruckIcon size={18} /> },
    ],
  },
  {
    title: 'Consultas',
    items: [
      { label: 'Historial',    route: '/historial',   module: 'history',    icon: <EyeIcon size={18} /> },
      { label: 'Trazabilidad', route: '/trazabilidad',module: 'history',    icon: <EyeIcon size={18} /> },
      { label: 'Reportes',     route: '/reportes',    module: 'reports',    icon: <ClipboardIcon size={18} /> },
      { label: 'Indicadores',  route: '/indicadores', module: 'analytics',  icon: <BarChartIcon size={18} /> },
    ],
  },
  {
    title: 'Gestión',
    items: [
      { label: 'Autorizaciones', route: '/autorizaciones', module: 'authorizations', icon: <ShieldIcon size={18} /> },
      { label: 'Auditoría',      route: '/auditoria',      module: 'audit',          icon: <ActivityIcon size={18} /> },
      { label: 'Maquinaria',     route: '/maquinaria',     module: 'inventory',      icon: <TruckIcon size={18} /> },
      { label: 'Ubicaciones',    route: '/ubicaciones',    module: 'inventory',      icon: <MapPinIcon size={18} /> },
      { label: 'Alertas',        route: '/alertas',        module: '',               icon: <BellIcon size={18} /> },
    ],
  },
  {
    title: 'Administración',
    items: [
      { label: 'Usuarios',       route: '/admin/usuarios',    module: 'users',         icon: <UsersIcon size={18} /> },
      { label: 'Roles y permisos',route: '/admin/roles',      module: 'users',         icon: <ShieldIcon size={18} /> },
      { label: 'Parámetros',     route: '/admin/parametros',  module: 'config',        icon: <SettingsIcon size={18} /> },
    ],
  },
  {
    title: 'Personal',
    items: [
      { label: 'Mi perfil', route: '/perfil', module: '', icon: <UserIcon size={18} /> },
    ],
  },
];

// Reusable tab button — encapsulates active state, indicator, and touch area
const NavTab = ({ label, icon, active, onClick }: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`relative flex-1 flex flex-col items-center justify-center gap-[3px] py-2 transition-colors min-w-0 ${active ? 'text-[#093C5D]' : 'text-gray-400'}`}
  >
    {active && <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-7 bg-[#6FD1D7]/15 rounded-full" />}
    <span className="relative z-10">{icon}</span>
    <span className={`relative z-10 text-[9.5px] font-semibold leading-none tracking-tight truncate max-w-full px-0.5 ${active ? 'text-[#093C5D]' : 'text-gray-400'}`}>
      {label}
    </span>
    {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2.5px] bg-[#6FD1D7] rounded-full" />}
  </button>
);

// Primary bar always shows these 5 slots (some are role-aware)
const PRIMARY_ROUTES = ['/dashboard', '/inventario', '/movimientos/entradas', '/movimientos/salidas'];

export default function MobileNav() {
  const { state, navigate, canAccess, showToast } = useApp();
  const { authorizations } = useAuthorizations();
  const [moreOpen, setMoreOpen] = useState(false);
  const { activeRoute } = state;
  const pendingAuth = authorizations.filter(a => a.status === 'pendiente').length;

  const hasAccess = (module: string) => !module || canAccess(module);

  // Deduplicate Historial / Trazabilidad per role
  const role = state.currentUser?.role;
  const showHistorial = role === 'warehouse';
  const showTrazabilidad = role === 'admin' || role === 'supervisor';

  // Build groups filtered by permissions + role
  const filteredGroups = GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (!hasAccess(item.module)) return false;
      if (item.route === '/historial' && !showHistorial) return false;
      if (item.route === '/trazabilidad' && !showTrazabilidad) return false;
      return true;
    }),
  })).filter(g => g.items.length > 0);

  function go(route: string) {
    navigate(route);
    setMoreOpen(false);
  }

  function handleScan() {
    showToast('info', 'Escáner QR no disponible en el modo prototipo.');
  }

  // Primary tabs: fixed slots, show scan only if role can do entries
  const canEntries = canAccess('entries');
  const canExits = canAccess('exits');

  // For the primary bar: Inicio | Inventario | Movimientos | Escanear | Más
  // "Movimientos" navigates to the most relevant movement for the role
  const movRoute = canEntries ? '/movimientos/entradas' : canExits ? '/movimientos/salidas' : '/movimientos/transferencias';
  const movActive = activeRoute.startsWith('/movimientos');

  return (
    <div className="md:hidden">
      {/* ── "Más" panel ───────────────────────────────────────────────── */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-[#0D1B2A]/60 flex flex-col justify-end" onClick={() => setMoreOpen(false)}>
          <div
            className="bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle + header */}
            <div className="flex-shrink-0 pt-3 pb-2 px-4 border-b border-gray-100">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#093C5D] text-sm">Todos los módulos</span>
                <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" onClick={() => setMoreOpen(false)} aria-label="Cerrar">
                  <XIcon size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable groups */}
            <div className="overflow-y-auto flex-1 px-4 py-3 space-y-5">
              {filteredGroups.map(group => (
                <div key={group.title}>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    {group.title}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {group.items.map(item => {
                      const isActive = activeRoute === item.route || (item.route !== '/dashboard' && activeRoute.startsWith(item.route));
                      const hasBadge = item.route === '/autorizaciones' && pendingAuth > 0;
                      return (
                        <button
                          key={item.route}
                          onClick={() => go(item.route)}
                          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl text-center transition-colors ${
                            isActive
                              ? 'bg-[#093C5D] text-white'
                              : 'bg-gray-50 text-[#4A5568] active:bg-[#6FD1D7]/20'
                          }`}
                        >
                          <span className={isActive ? 'text-[#6FD1D7]' : 'text-[#3B7597]'}>{item.icon}</span>
                          <span className="text-[10px] font-medium leading-tight line-clamp-2">{item.label}</span>
                          {hasBadge && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                              {pendingAuth > 9 ? '9+' : pendingAuth}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {/* Safe-area bottom padding — ensures last item clears the gesture bar */}
              <div className="h-8" />
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom navigation bar ─────────────────────────────────────── */}
      <nav className="siga-nav-safe fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(9,60,93,0.08)]">
        <div className="h-[60px] flex items-stretch px-1">

          {/* Inicio */}
          <NavTab
            label="Inicio"
            icon={<HomeIcon size={21} />}
            active={activeRoute === '/dashboard'}
            onClick={() => go('/dashboard')}
          />

          {/* Inventario */}
          {canAccess('inventory') && (
            <NavTab
              label="Inventario"
              icon={<PackageIcon size={21} />}
              active={activeRoute === '/inventario'}
              onClick={() => go('/inventario')}
            />
          )}

          {/* Movimientos */}
          {(canEntries || canExits || canAccess('transfers')) && (
            <NavTab
              label="Movimientos"
              icon={<ArrowsIcon size={21} />}
              active={movActive}
              onClick={() => go(movRoute)}
            />
          )}

          {/* Escanear */}
          <NavTab
            label="Escanear"
            icon={<QrIcon size={21} />}
            active={false}
            onClick={handleScan}
          />

          {/* Más */}
          <NavTab
            label="Más"
            icon={<MenuIcon size={21} />}
            active={moreOpen}
            onClick={() => setMoreOpen(true)}
          />

        </div>
      </nav>
    </div>
  );
}
