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

    <div className="p-4 sm:p-6 space-y-6">

      {/* KPIs operativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {[
          {
            icon: <ArrowDownIcon size={18} />,
            value: String(
              myMovements.filter(m => m.type === 'entrada').length
            ),
            label: 'Mis entradas',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'bg-emerald-500',
          },
          {
            icon: <ArrowUpIcon size={18} />,
            value: String(
              myMovements.filter(m => m.type === 'salida').length
            ),
            label: 'Mis salidas',
            color: 'text-[#3B7597]',
            bg: 'bg-[#3B7597]/10',
            border: 'bg-[#3B7597]',
          },
          {
            icon: <ArrowsIcon size={18} />,
            value: String(
              myMovements.filter(m => m.type === 'transferencia').length
            ),
            label: 'Mis transferencias',
            color: 'text-[#3B7597]',
            bg: 'bg-[#6FD1D7]/15',
            border: 'bg-[#6FD1D7]',
          },
          {
            icon: <PackageIcon size={18} />,
            value: String(pendingMovements),
            label: 'Pendientes autorización',
            color:
              pendingMovements > 0
                ? 'text-amber-600'
                : 'text-gray-500',
            bg:
              pendingMovements > 0
                ? 'bg-amber-50'
                : 'bg-gray-100',
            border:
              pendingMovements > 0
                ? 'bg-amber-400'
                : 'bg-gray-300',
          },
        ].map(kpi => (

          <div
            key={kpi.label}
            className="relative overflow-hidden bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >

            <div
              className={`absolute top-0 left-0 right-0 h-1 ${kpi.border}`}
            />

            <div
              className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color} mb-4`}
            >
              {kpi.icon}
            </div>

            <div
              className={`text-2xl font-bold font-display ${kpi.color}`}
            >
              {kpi.value}
            </div>

            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
              {kpi.label}
            </div>

          </div>

        ))}

      </div>


      {/* Acciones rápidas */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">

        <h2 className="font-semibold text-[#093C5D] mb-4">
          Acciones rápidas
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

          {[
            {
              label: 'Registrar entrada',
              icon: <ArrowDownIcon size={16} />,
              route: routePath('entries'),
              color:
                'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
            },
            {
              label: 'Registrar salida',
              icon: <ArrowUpIcon size={16} />,
              route: routePath('exits'),
              color:
                'bg-[#3B7597]/10 text-[#3B7597] hover:bg-[#3B7597]/20 border-[#3B7597]/20'
            },
            {
              label: 'Transferir',
              icon: <ArrowsIcon size={16} />,
              route: routePath('transfers'),
              color:
                'bg-[#6FD1D7]/10 text-[#093C5D] hover:bg-[#6FD1D7]/20 border-[#6FD1D7]/20'
            },
            {
              label: 'Ver inventario',
              icon: <PackageIcon size={16} />,
              route: routePath('inventory'),
              color:
                'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
            },
            {
              label: 'Ubicaciones',
              icon: <MapPinIcon size={16} />,
              route: routePath('locations'),
              color:
                'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
            },
            {
              label: 'Maquinaria',
              icon: <TruckIcon size={16} />,
              route: routePath('machinery'),
              color:
                'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
            },

          ].map(action => (

            <button
              key={action.route}
              onClick={() => navigate(action.route)}
              className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${action.color}`}
            >
              <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                {action.icon}
              </div>

              {action.label}
            </button>

          ))}

        </div>

      </section>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Productos con stock bajo */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">

            <h2 className="font-semibold text-[#093C5D] text-sm">
              Atención de stock
            </h2>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(routePath('inventory'))}
            >
              Ver inventario
            </Button>

          </div>


          {lowStockProducts.length === 0 ? (

            <div className="p-6 text-center text-sm text-gray-400">
              Stock en buen estado
            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {lowStockProducts.map(product => {

  const qty = stock
    .filter(s => s.productId === product.id)
    .reduce((t, s) => t + s.quantity, 0);

  const status =
    qty <= 0
      ? 'sin_stock' as const
      : 'bajo_stock' as const;

  const unit = units.find(
    u => u.id === product.unitId
  );

  const isZeroStock = qty <= 0;

  return (
    <div
      key={product.id}
      className="px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50/70 transition-colors"
    >

      <div
        className={`
          w-10 h-10 rounded-xl
          flex items-center justify-center
          flex-shrink-0
          ${
            isZeroStock
              ? 'bg-red-50'
              : 'bg-amber-50'
          }
        `}
      >
        <PackageIcon
          size={16}
          className={
            isZeroStock
              ? 'text-red-500'
              : 'text-amber-500'
          }
        />
      </div>

      <div className="flex-1 min-w-0">

        <div className="font-semibold text-xs text-[#093C5D] truncate">
          {product.name}
        </div>

        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
          {product.sku}
        </div>

      </div>

      <div className="text-right flex-shrink-0">

        <div
          className={`text-sm font-bold ${
            isZeroStock
              ? 'text-red-600'
              : 'text-amber-600'
          }`}
        >
          {formatNumber(qty)} {unit?.code}
        </div>

        <div className="mt-1">
          <InventoryStatusBadge status={status} />
        </div>

      </div>

    </div>
  );

})}

            </div>

          )}

        </section>


        {/* Últimos movimientos */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">

            <h2 className="font-semibold text-[#093C5D] text-sm">
              Últimos movimientos
            </h2>

            <span className="text-xs text-gray-400">
              {confirmedToday} confirmados hoy
            </span>

          </div>


          <div className="divide-y divide-gray-100">

            {todayMovements.slice(0, 6).map(m => {

  const product = products.find(
    p => p.id === m.productId
  );

  const typeMap: Record<
    string,
    {
      label: string;
      color: string;
      iconBg: string;
      iconColor: string;
      icon: React.ReactNode;
    }
  > = {

    entrada: {
      label: 'Entrada',
      color: 'text-emerald-700 bg-emerald-50',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      icon: <ArrowDownIcon size={14} />
    },

    salida: {
      label: 'Salida',
      color: 'text-[#3B7597] bg-[#3B7597]/10',
      iconBg: 'bg-[#3B7597]/10',
      iconColor: 'text-[#3B7597]',
      icon: <ArrowUpIcon size={14} />
    },

    transferencia: {
      label: 'Transfer',
      color: 'text-[#3B7597] bg-[#6FD1D7]/10',
      iconBg: 'bg-[#6FD1D7]/10',
      iconColor: 'text-[#3B7597]',
      icon: <ArrowsIcon size={14} />
    },

    ajuste_positivo: {
      label: 'Ajuste+',
      color: 'text-blue-600 bg-blue-50',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      icon: <PackageIcon size={14} />
    },

    ajuste_negativo: {
      label: 'Ajuste-',
      color: 'text-red-600 bg-red-50',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      icon: <PackageIcon size={14} />
    },

  };

  const t =
    typeMap[m.type] ?? {
      label: m.type,
      color: 'text-gray-600 bg-gray-50',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-500',
      icon: <PackageIcon size={14} />
    };

  return (
    <div
      key={m.id}
      className="px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50/70 transition-colors"
    >

      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.iconBg} ${t.iconColor}`}
      >
        {t.icon}
      </div>

      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-2">

          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.color}`}
          >
            {t.label}
          </span>

          <div className="text-xs font-semibold text-[#093C5D] truncate">
            {product?.name ?? m.productId}
          </div>

        </div>

        <div className="text-[10px] text-gray-400 mt-1">
          {m.quantity} uds · {m.createdAt.slice(0, 10)}
        </div>

      </div>

    </div>
  );

})}

          </div>


          <div className="p-3 border-t border-gray-100">

            <Button
              size="sm"
              variant="ghost"
              className="w-full"
              onClick={() =>
                navigate(routePath('history'))
              }
            >
              Ver historial completo
            </Button>

          </div>

        </section>

      </div>


      {/* Info adicional */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm p-5">

          <div className="absolute top-0 left-0 right-0 h-1 bg-[#6FD1D7]" />

          <div className="w-9 h-9 rounded-lg bg-[#6FD1D7]/15 flex items-center justify-center mb-3">
            <MapPinIcon
              size={16}
              className="text-[#3B7597]"
            />
          </div>

          <div className="text-xl font-bold text-[#093C5D]">
            {totalLocations}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            Ubicaciones activas
          </div>

        </div>


        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm p-5">

          <div className="absolute top-0 left-0 right-0 h-1 bg-[#3B7597]" />

          <div className="w-9 h-9 rounded-lg bg-[#3B7597]/10 flex items-center justify-center mb-3">
            <PackageIcon
              size={16}
              className="text-[#3B7597]"
            />
          </div>

          <div className="text-xl font-bold text-[#093C5D]">
            {formatCurrency(
              stock.reduce(
                (t, s) =>
                  t + s.quantity * s.avgCost,
                0
              )
            )}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            Valor total en stock
          </div>

        </div>


        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm p-5">

          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />

          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
            <PackageIcon
              size={16}
              className="text-emerald-600"
            />
          </div>

          <div className="text-xl font-bold text-[#093C5D]">
            {
              products.filter(
                p => p.status === 'active'
              ).length
            }
          </div>

          <div className="text-xs text-gray-400 mt-1">
            Productos activos
          </div>

        </div>

      </div>

    </div>

  </div>
);
}
