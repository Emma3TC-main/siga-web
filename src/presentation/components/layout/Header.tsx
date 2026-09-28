import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../state/AppContext';
import { useProducts } from '../../hooks/useProducts';
import { useMovements } from '../../hooks/useMovements';
import { useLocations } from '../../hooks/useLocations';
import { SearchIcon, BellIcon, MenuIcon, UserIcon, LogOutIcon, AlertIcon, XIcon } from '../ui';
import { actionRoutePath, getHeaderTitle, routePath } from '../../navigation/routeRegistry';

export default function Header() {
  const { state, navigate, logout, toggleSidebar, markAlertRead, canAccess } = useApp();
  const { currentUser, alerts, activeRoute } = state;
  const { products } = useProducts();
  const { movements } = useMovements();
  const { locations } = useLocations();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const unread = alerts.filter(a => !a.read).length;

  const currentTitle = getHeaderTitle(activeRoute);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Search results
  const movementAccess = (type: string) => type === 'entrada' ? canAccess('entries') : type === 'salida' ? canAccess('exits') : type === 'transferencia' ? canAccess('transfers') : canAccess('adjustments');
  const movementRoute = (type: string) => type === 'entrada' ? routePath('entries') : type === 'salida' ? routePath('exits') : type === 'transferencia' ? routePath('transfers') : routePath('adjustments');
  const searchResults = searchQuery.length > 1 ? [
    ...products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(p => ({ type: 'Producto', label: p.name, sub: p.sku, action: () => navigate(routePath('inventory')) })),
    ...movements.filter(m => movementAccess(m.type) && m.id.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(m => ({ type: 'Movimiento', label: m.id, sub: m.type, action: () => navigate(movementRoute(m.type)) })),
    ...locations.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(l => ({ type: 'Ubicación', label: l.name, sub: l.code, action: () => navigate(routePath('locations')) })),
  ] : [];

  return (
    <header className="bg-white border-b border-gray-200 flex-shrink-0 z-30 flex flex-col">
      {/* Safe-area spacer — height = env(safe-area-inset-top) on notch/Dynamic Island devices, 0 elsewhere.
          This is the ONLY element that moves; it pushes the content row down without disturbing it. */}
      <div className="siga-header-safe" />

      {/* Content row — always exactly 56 px, unchanged on all screen sizes */}
      <div className="h-14 flex items-center gap-3 px-4">
        {/* Sidebar toggle */}
        <button onClick={toggleSidebar} className="hidden md:block p-1.5 rounded-md text-gray-400 hover:text-[#093C5D] hover:bg-gray-100 transition-colors">
          <MenuIcon size={18} />
        </button>

        {/* Page title — visible at all breakpoints so the user always has orientation, truncated on narrow screens */}
        <span className="font-semibold text-[#093C5D] text-sm truncate max-w-[40vw] sm:max-w-none">{currentTitle}</span>

        {/* Search */}
        <div className="relative flex-1 max-w-md ml-auto mr-2">
          {searchOpen ? (
            <div className="relative">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => { setTimeout(() => { setSearchOpen(false); setSearchQuery(''); }, 200); }}
                className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#3B7597] focus:ring-2 focus:ring-[#3B7597]/20 bg-gray-50"
                placeholder="Buscar producto, SKU, movimiento..." />
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                  {searchResults.map((r, i) => (
                    <button key={i} onClick={r.action} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-left">
                      <span className="text-xs bg-[#6FD1D7]/20 text-[#093C5D] px-1.5 py-0.5 rounded font-medium">{r.type}</span>
                      <div><div className="text-sm text-gray-800 font-medium">{r.label}</div><div className="text-xs text-gray-400">{r.sub}</div></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 text-gray-400 hover:text-[#3B7597] text-sm px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <SearchIcon size={16} />
              <span className="hidden md:block">Búsqueda global...</span>
              <kbd className="hidden md:block text-xs bg-gray-100 border border-gray-200 rounded px-1">⌘K</kbd>
            </button>
          )}
        </div>

        {/* Alerts */}
        <div className="relative">
          <button onClick={() => { setAlertsOpen(!alertsOpen); setUserMenuOpen(false); }}
            className="relative p-2 rounded-lg text-gray-500 hover:text-[#093C5D] hover:bg-gray-100 transition-colors">
            <BellIcon size={18} />
            {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{unread > 9 ? '9+' : unread}</span>}
          </button>
          {alertsOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 max-w-[calc(100vw-1rem)] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-semibold text-sm text-[#093C5D]">Alertas {unread > 0 && <span className="text-red-500">({unread})</span>}</span>
                <button onClick={() => { setAlertsOpen(false); navigate(routePath('alerts')); }} className="text-xs text-[#3B7597] hover:underline">Ver todas</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {alerts.slice(0, 6).map(alert => (
                  <div key={alert.id} onClick={() => { markAlertRead(alert.id); setAlertsOpen(false); if (alert.actionRoute) navigate(actionRoutePath(alert.actionRoute)); }}
                    className={`flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${!alert.read ? 'bg-blue-50/30' : ''}`}>
                    <span className={`flex-shrink-0 mt-0.5 ${alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>
                      <AlertIcon size={14} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-700 truncate">{alert.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{alert.description}</div>
                    </div>
                    {!alert.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button onClick={() => { setUserMenuOpen(!userMenuOpen); setAlertsOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#093C5D] flex items-center justify-center text-white text-xs font-bold">
              {currentUser?.name[0]}{currentUser?.lastName[0]}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">{currentUser?.name}</span>
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 max-w-[calc(100vw-1rem)] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50">
                <div className="font-semibold text-sm text-[#093C5D]">{currentUser?.name} {currentUser?.lastName}</div>
                <div className="text-xs text-gray-400 mt-0.5">{currentUser?.email}</div>
              </div>
              <div className="py-1">
                <button onClick={() => { setUserMenuOpen(false); navigate(routePath('profile')); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <UserIcon size={15} /> Mi perfil
                </button>
                <button onClick={() => { setUserMenuOpen(false); logout(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOutIcon size={15} /> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
