import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useProducts } from '../../hooks/useProducts';
import { useMovements } from '../../hooks/useMovements';
import { useLocations } from '../../hooks/useLocations';
import { useUnits } from '../../hooks/useUnits';
import { useStock } from '../../hooks/useStock';
import { useUsers } from '../../hooks/useUsers';
import { stockEntriesOfProduct } from '../../../domain/rules/inventoryRules';
import { getProductTimeline, searchProducts } from '../../../domain/rules/traceabilityRules';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import {
  PageHeader, Badge, Input, Select, EmptyState, formatCurrency, formatNumber,
  PackageIcon, SearchIcon, MovementStatusBadge,
} from '../../components/ui';

export default function Traceability() {
  const { navigate } = useApp();
  const { users } = useUsers();
  const { products } = useProducts();
  const { movements } = useMovements();
  const { locations } = useLocations();
  const { units } = useUnits();
  const { stock } = useStock();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const matchingProducts = searchProducts(products, search);

  const activeProduct = selectedProduct ? products.find(p => p.id === selectedProduct) : null;
  const productMovements = activeProduct ? getProductTimeline(movements, activeProduct.id) : [];
  const productStock = activeProduct ? stockEntriesOfProduct(stock, activeProduct.id) : [];
  const unit = activeProduct ? units.find(u => u.id === activeProduct.unitId) : null;

  const typeColors: Record<string, string> = {
    entrada: 'bg-emerald-100 border-emerald-300 text-emerald-700',
    salida: 'bg-red-100 border-red-300 text-red-700',
    transferencia: 'bg-blue-100 border-blue-300 text-blue-700',
    ajuste_positivo: 'bg-purple-100 border-purple-300 text-purple-700',
    ajuste_negativo: 'bg-orange-100 border-orange-300 text-orange-700',
  };
  const typeLabels: Record<string, string> = {
    entrada: 'Entrada', salida: 'Salida', transferencia: 'Transferencia', ajuste_positivo: 'Ajuste +', ajuste_negativo: 'Ajuste −',
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Trazabilidad" description="Rastro completo del ciclo de vida de productos"
        breadcrumbs={getBreadcrumbs('traceability', navigate)}
      />

      <div className="flex gap-3 px-6 py-4 border-b border-gray-200 bg-white">
        <div className="relative flex-1 max-w-md">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setSelectedProduct(''); }}
            placeholder="Buscar producto por nombre o SKU..." className="siga-input pl-8 h-9" />
          {matchingProducts.length > 0 && !selectedProduct && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 z-10 max-h-48 overflow-auto">
              {matchingProducts.map(p => (
                <button key={p.id} onClick={() => { setSelectedProduct(p.id); setSearch(p.name); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#6FD1D7]/10 flex items-center gap-3 border-b border-gray-50 last:border-0">
                  <PackageIcon size={16} className="text-[#3B7597] flex-shrink-0" />
                  <div><div className="font-medium text-sm">{p.name}</div><div className="text-xs font-mono text-gray-400">{p.sku}</div></div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {!activeProduct && (
          <EmptyState icon={<PackageIcon size={48} />} title="Busque un producto" description="Ingrese el nombre o SKU para ver su trazabilidad completa" />
        )}

        {activeProduct && (
          <div className="space-y-5">
            {/* Product info */}
            <div className="siga-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#093C5D]">{activeProduct.name}</h2>
                  <div className="font-mono text-sm text-gray-400 mt-0.5">{activeProduct.sku}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Stock total</div>
                  <div className="text-2xl font-bold text-[#093C5D]">{formatNumber(productStock.reduce((s, e) => s + e.quantity, 0))} <span className="text-base font-normal text-gray-400">{unit?.code}</span></div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {productStock.map(s => {
                  const loc = locations.find(l => l.id === s.locationId);
                  return (
                    <div key={`${s.productId}-${s.locationId}`} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="text-xs text-gray-400">{loc?.name ?? s.locationId}</div>
                      <div className="font-bold text-[#093C5D]">{formatNumber(s.quantity)} {unit?.code}</div>
                      {s.batch && <div className="text-[10px] font-mono text-gray-400">Lote: {s.batch}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-semibold text-[#093C5D] mb-4">Línea de tiempo de movimientos ({productMovements.length})</h3>
              {productMovements.length === 0 && (
                <div className="text-center text-gray-400 py-8">No hay movimientos registrados para este producto</div>
              )}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />
                <div className="space-y-4">
                  {productMovements.map((mv, idx) => {
                    const fromLoc = locations.find(l => l.id === mv.fromLocationId);
                    const toLoc = locations.find(l => l.id === mv.toLocationId);
                    const user = users.find(u => u.id === mv.registeredBy);
                    const colorClass = typeColors[mv.type] ?? 'bg-gray-100 border-gray-200 text-gray-600';

                    return (
                      <div key={mv.id} className="flex gap-4 relative">
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold ${colorClass}`}>
                          {mv.type === 'entrada' ? '↓' : mv.type === 'salida' ? '↑' : mv.type === 'transferencia' ? '⇄' : '±'}
                        </div>
                        <div className="flex-1 siga-card p-4 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>{typeLabels[mv.type] ?? mv.type}</span>
                              <span className="font-mono text-xs text-gray-400">{mv.id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MovementStatusBadge status={mv.status} />
                              <span className="text-xs text-gray-400">{mv.createdAt.split(' ')[0]}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div><div className="text-xs text-gray-400">Cantidad</div><div className="font-bold text-[#093C5D]">{formatNumber(mv.quantity)} {unit?.code}</div></div>
                            {fromLoc && <div><div className="text-xs text-gray-400">Desde</div><div className="font-medium">{fromLoc.name}</div></div>}
                            {toLoc && <div><div className="text-xs text-gray-400">Hacia</div><div className="font-medium">{toLoc.name}</div></div>}
                            <div><div className="text-xs text-gray-400">Registrado por</div><div className="font-medium">{user?.name} {user?.lastName}</div></div>
                            {mv.totalCost && <div><div className="text-xs text-gray-400">Valor</div><div className="font-semibold text-[#3B7597]">{formatCurrency(mv.totalCost)}</div></div>}
                            {mv.documentNumber && <div><div className="text-xs text-gray-400">Documento</div><div className="font-mono text-xs">{mv.documentNumber}</div></div>}
                            {mv.motive && <div className="col-span-2"><div className="text-xs text-gray-400">Motivo</div><div className="text-xs text-gray-600">{mv.motive}</div></div>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
