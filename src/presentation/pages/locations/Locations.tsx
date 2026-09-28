import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useLocations } from '../../hooks/useLocations';
import { useProducts } from '../../hooks/useProducts';
import { getLocationDescendantIds } from '../../../domain/rules/inventoryRules';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import {
  PageHeader, formatNumber,
  MapPinIcon, ChevronRightIcon,
} from '../../components/ui';
import type { Location } from '../../../domain/entities/Location';
import type { StockEntry } from '../../../domain/entities/Stock';

const TYPE_LABELS: Record<string, string> = {
  almacen: 'Almacén', zona: 'Zona', rack: 'Rack', nivel: 'Nivel',
  patio: 'Patio', taller: 'Taller', recepcion: 'Recepción', cuarentena: 'Cuarentena', despacho: 'Despacho',
};
const TYPE_COLORS: Record<string, string> = {
  almacen: '#093C5D', zona: '#3B7597', rack: '#6FD1D7', nivel: '#5DF8D8',
  patio: '#D97706', taller: '#7C3AED', recepcion: '#059669', cuarentena: '#DC2626', despacho: '#0891B2',
};

interface NodeProps {
  loc: Location;
  depth: number;
  selected: string | null;
  expandedIds: Set<string>;
  locations: Location[];
  stock: StockEntry[];
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}

function LocationNode({ loc, depth, selected, expandedIds, locations, stock, onSelect, onToggle }: NodeProps) {
  const children = locations.filter(l => l.parentId === loc.id);
  const expanded = expandedIds.has(loc.id);
  const locQty = stock.filter(s => s.locationId === loc.id).reduce((sum, s) => sum + s.quantity, 0);
  const color = TYPE_COLORS[loc.type] ?? '#093C5D';

  const subtreeIds = getLocationDescendantIds(loc.id, locations);
  const subtreeCount = stock.filter(s => subtreeIds.includes(s.locationId)).length;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2.5 cursor-pointer hover:bg-gray-50 border-b border-gray-50 ${selected === loc.id ? 'bg-[#6FD1D7]/10 border-l-2 border-l-[#6FD1D7]' : ''}`}
        style={{ paddingLeft: `${16 + depth * 20}px` }}
        onClick={() => onSelect(loc.id)}
      >
        {children.length > 0 ? (
          <button className="w-4 h-4 flex items-center justify-center flex-shrink-0" onClick={e => { e.stopPropagation(); onToggle(loc.id); }}>
            <ChevronRightIcon size={12} className={`transition-transform text-gray-400 ${expanded ? 'rotate-90' : ''}`} />
          </button>
        ) : <div className="w-4 flex-shrink-0" />}
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-[#093C5D] truncate">{loc.name}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0" style={{ background: color }}>
              {TYPE_LABELS[loc.type] ?? loc.type}
            </span>
          </div>
          {loc.code && <div className="text-[10px] text-gray-400 font-mono">{loc.code}</div>}
        </div>
        <div className="flex items-center gap-3 text-xs flex-shrink-0 pr-3">
          {subtreeCount > 0 && <span className="text-[#3B7597] font-semibold">{subtreeCount} ítems</span>}
          {locQty > 0 && <span className="text-[#093C5D] font-bold">{formatNumber(locQty)}</span>}
          {loc.capacity && locQty > 0 && <span className="text-gray-400">{Math.round((locQty / loc.capacity) * 100)}%</span>}
        </div>
      </div>
      {expanded && children.map(c => (
        <LocationNode key={c.id} loc={c} depth={depth + 1} selected={selected} expandedIds={expandedIds}
          locations={locations} stock={stock} onSelect={onSelect} onToggle={onToggle} />
      ))}
    </div>
  );
}

export default function Locations() {
  const { state, navigate } = useApp();
  const { stock } = state;
  const { locations } = useLocations();
  const { products } = useProducts();
  const [selected, setSelected] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['loc1', 'loc9']));

  const detail = selected ? locations.find(l => l.id === selected) : null;
  const roots = locations.filter(l => !l.parentId);

  function toggle(id: string) {
    setExpandedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  const detailStock = detail ? stock.filter(s => s.locationId === detail.id) : [];
  const detailSubtreeIds = detail ? getLocationDescendantIds(detail.id, locations) : [];
  const detailSubtreeCount = stock.filter(s => detailSubtreeIds.includes(s.locationId)).length;
  const detailQty = detailStock.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Ubicaciones" description={`${locations.length} ubicaciones en ${roots.length} almacenes`}
        breadcrumbs={getBreadcrumbs('locations', navigate)}
      />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Tree panel — full width and height-capped above the detail panel on mobile, fixed side column on desktop */}
        <div className="w-full md:w-96 max-h-64 md:max-h-none border-b md:border-b-0 md:border-r border-gray-200 overflow-auto flex-shrink-0">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Jerarquía de ubicaciones</div>
          </div>
          {roots.map(loc => (
            <LocationNode key={loc.id} loc={loc} depth={0} selected={selected} expandedIds={expandedIds}
              locations={locations} stock={stock} onSelect={setSelected} onToggle={toggle} />
          ))}
        </div>

        {/* Detail panel */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {!detail && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MapPinIcon size={48} className="mb-3 opacity-30" />
              <div className="font-medium">Seleccione una ubicación</div>
              <div className="text-sm mt-1">para ver sus detalles y el stock almacenado</div>
            </div>
          )}

          {detail && (
            <div className="space-y-5">
              <div className="siga-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-[#093C5D] text-xl">{detail.name}</div>
                    {detail.code && <div className="font-mono text-sm text-gray-400 mt-0.5">{detail.code}</div>}
                  </div>
                  <span className="text-sm font-bold px-3 py-1.5 rounded-full text-white" style={{ background: TYPE_COLORS[detail.type] ?? '#093C5D' }}>
                    {TYPE_LABELS[detail.type] ?? detail.type}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#093C5D]">{detailSubtreeCount}</div>
                    <div className="text-xs text-gray-400 mt-0.5">ítems en árbol</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#3B7597]">{formatNumber(detailQty)}</div>
                    <div className="text-xs text-gray-400 mt-0.5">cantidad en ubicación</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#6FD1D7]">
                      {detail.capacity ? `${Math.round((detailQty / detail.capacity) * 100)}%` : '—'}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">ocupación</div>
                  </div>
                </div>
              </div>

              {detailStock.length > 0 && (
                <div className="siga-card">
                  <div className="p-4 border-b border-gray-100 font-semibold text-[#093C5D]">Stock en esta ubicación</div>
                  <table className="siga-table">
                    <thead><tr><th>Producto</th><th>SKU</th><th>Lote</th><th className="text-right">Cantidad</th><th>Vence</th></tr></thead>
                    <tbody>
                      {detailStock.map(s => {
                        const prod = products.find(p => p.id === s.productId);
                        return (
                          <tr key={`${s.productId}-${s.locationId}`}>
                            <td className="font-medium text-sm">{prod?.name ?? '—'}</td>
                            <td className="font-mono text-xs text-[#3B7597]">{prod?.sku ?? '—'}</td>
                            <td className="font-mono text-xs text-gray-500">{s.batch ?? '—'}</td>
                            <td className="text-right font-semibold text-[#093C5D]">{formatNumber(s.quantity)}</td>
                            <td className="text-xs">
                              {s.expiryDate
                                ? <span className={new Date(s.expiryDate) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-500'}>{s.expiryDate}</span>
                                : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {detailStock.length === 0 && (
                <div className="siga-card p-8 text-center text-gray-400">
                  <MapPinIcon size={32} className="mx-auto mb-2 opacity-30" />
                  <div>No hay stock registrado en esta ubicación</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
