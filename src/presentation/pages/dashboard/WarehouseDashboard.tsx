import { useApp } from '../../state/AppContext';
import { useProducts } from '../../hooks/useProducts';
import { useMovements } from '../../hooks/useMovements';
import { useStock } from '../../hooks/useStock';
import { useLocations } from '../../hooks/useLocations';
import { useUnits } from '../../hooks/useUnits';
import { Button, PageHeader, PackageIcon, ArrowDownIcon, ArrowUpIcon, ArrowsIcon, formatNumber, formatCurrency, InventoryStatusBadge } from '../../components/ui';
import { MapPinIcon, TruckIcon } from '../../components/ui';
import { routePath } from '../../navigation/routeRegistry';

export default function WarehouseDashboard() {
  const { state, navigate } = useApp();
  const user = state.currentUser!;
  const { products } = useProducts();
  const { movements } = useMovements();
  const { stock } = useStock();
  const { locations } = useLocations();
  const { units } = useUnits();

  const myMovements = movements.filter(m => m.registeredBy === user.id);
  const todayMovements = movements.slice(0, 10);
  const lowStockProducts = products.filter(p => {
    const qty = stock.filter(s => s.productId === p.id).reduce((t, s) => t + s.quantity, 0);
    return qty <= p.minStock && p.status === 'active';
  }).slice(0, 6);
  const totalLocations = locations.filter(l => l.status === 'active').length;
  const pendingMovements = myMovements.filter(m => m.status === 'pendiente_autorizacion').length;
  const confirmedToday = myMovements.filter(m => m.status === 'confirmado').length;

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={`Operaciones — ${user.name} ${user.lastName}`}
        description="Encargado de Almacén · Panel de operación diaria"
        breadcrumbs={[{ label: 'Inicio' }]}
      />

      <div className="p-4 sm:p-6 space-y-5">

        {/* KPIs operativos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: <ArrowDownIcon size={18} />, value: String(myMovements.filter(m => m.type === 'entrada').length), label: 'Mis entradas', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: <ArrowUpIcon size={18} />, value: String(myMovements.filter(m => m.type === 'salida').length), label: 'Mis salidas', color: 'text-[#3B7597]', bg: 'bg-[#3B7597]/10' },
            { icon: <ArrowsIcon size={18} />, value: String(myMovements.filter(m => m.type === 'transferencia').length), label: 'Mis transferencias', color: 'text-[#6FD1D7]', bg: 'bg-[#6FD1D7]/10' },
            { icon: <PackageIcon size={18} />, value: String(pendingMovements), label: 'Pendientes autorización', color: pendingMovements > 0 ? 'text-amber-600' : 'text-gray-500', bg: pendingMovements > 0 ? 'bg-amber-50' : '' },
          ].map(kpi => (
            <div key={kpi.label} className="siga-card p-4">
              <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color} mb-2`}>{kpi.icon}</div>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Acciones rápidas */}
        <section className="siga-card p-4 sm:p-5">
          <h2 className="font-semibold text-[#093C5D] mb-3">Acciones rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Registrar entrada', icon: <ArrowDownIcon size={16} />, route: routePath('entries'), color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
              { label: 'Registrar salida', icon: <ArrowUpIcon size={16} />, route: routePath('exits'), color: 'bg-[#3B7597]/10 text-[#3B7597] hover:bg-[#3B7597]/20 border-[#3B7597]/20' },
              { label: 'Transferir', icon: <ArrowsIcon size={16} />, route: routePath('transfers'), color: 'bg-[#6FD1D7]/10 text-[#093C5D] hover:bg-[#6FD1D7]/20 border-[#6FD1D7]/20' },
              { label: 'Ver inventario', icon: <PackageIcon size={16} />, route: routePath('inventory'), color: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200' },
              { label: 'Ubicaciones', icon: <MapPinIcon size={16} />, route: routePath('locations'), color: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200' },
              { label: 'Maquinaria', icon: <TruckIcon size={16} />, route: routePath('machinery'), color: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200' },
            ].map(action => (
              <button key={action.route} onClick={() => navigate(action.route)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${action.color}`}>
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Productos con stock bajo */}
          <section className="siga-card overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#093C5D] text-sm">Atención de stock</h2>
              <Button size="sm" variant="outline" onClick={() => navigate(routePath('inventory'))}>Ver inventario</Button>
            </div>
            {lowStockProducts.length === 0 ? (
              <div className="p-5 text-center text-sm text-gray-400">Stock en buen estado</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {lowStockProducts.map(product => {
                  const qty = stock.filter(s => s.productId === product.id).reduce((t, s) => t + s.quantity, 0);
                  const status = qty <= 0 ? 'sin_stock' as const : 'bajo_stock' as const;
                  const unit = units.find(u => u.id === product.unitId);
                  return (
                    <div key={product.id} className="p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#093C5D]/5 flex items-center justify-center flex-shrink-0">
                        <PackageIcon size={15} className="text-[#3B7597]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs text-[#093C5D] truncate">{product.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{product.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#093C5D]">{formatNumber(qty)} {unit?.code}</div>
                        <InventoryStatusBadge status={status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Últimos movimientos */}
          <section className="siga-card overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#093C5D] text-sm">Últimos movimientos</h2>
              <span className="text-xs text-gray-400">{confirmedToday} confirmados hoy</span>
            </div>
            <div className="divide-y divide-gray-100">
              {todayMovements.slice(0, 6).map(m => {
                const product = products.find(p => p.id === m.productId);
                const typeMap: Record<string, { label: string; color: string }> = {
                  entrada: { label: 'Entrada', color: 'text-emerald-600 bg-emerald-50' },
                  salida: { label: 'Salida', color: 'text-[#3B7597] bg-[#3B7597]/10' },
                  transferencia: { label: 'Transfer', color: 'text-[#6FD1D7] bg-[#6FD1D7]/10' },
                  ajuste_positivo: { label: 'Ajuste+', color: 'text-blue-600 bg-blue-50' },
                  ajuste_negativo: { label: 'Ajuste-', color: 'text-red-600 bg-red-50' },
                };
                const t = typeMap[m.type] ?? { label: m.type, color: 'text-gray-600 bg-gray-50' };
                return (
                  <div key={m.id} className="p-3 flex items-center gap-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.color} flex-shrink-0`}>{t.label}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#093C5D] truncate">{product?.name ?? m.productId}</div>
                      <div className="text-[10px] text-gray-400">{m.quantity} uds · {m.createdAt.slice(0, 10)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t border-gray-100">
              <Button size="sm" variant="ghost" className="w-full" onClick={() => navigate(routePath('history'))}>Ver historial completo</Button>
            </div>
          </section>
        </div>

        {/* Info adicional */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="siga-card p-4">
            <div className="text-xl font-bold text-[#093C5D]">{totalLocations}</div>
            <div className="text-xs text-gray-400 mt-0.5">Ubicaciones activas</div>
          </div>
          <div className="siga-card p-4">
            <div className="text-xl font-bold text-[#093C5D]">{formatCurrency(stock.reduce((t, s) => t + s.quantity * s.avgCost, 0))}</div>
            <div className="text-xs text-gray-400 mt-0.5">Valor total en stock</div>
          </div>
          <div className="siga-card p-4 col-span-2 sm:col-span-1">
            <div className="text-xl font-bold text-[#093C5D]">{products.filter(p => p.status === 'active').length}</div>
            <div className="text-xs text-gray-400 mt-0.5">Productos activos</div>
          </div>
        </div>
      </div>
    </div>
  );
}
