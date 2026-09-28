import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useProducts } from '../../hooks/useProducts';
import { useMovements } from '../../hooks/useMovements';
import { useLocations } from '../../hooks/useLocations';
import { useStock } from '../../hooks/useStock';
import { useUsers } from '../../hooks/useUsers';
import { getMachinery, filterMachineryByStatus, countMachineryByStatus } from '../../../domain/rules/machineryRules';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import {
  Button, PageHeader, MachineryStatusBadge, MovementStatusBadge, Badge, Tabs, Modal, EmptyState,
  DetailHeader, DetailSection, DetailField,
  formatCurrency, formatNumber, TruckIcon, EyeIcon,
} from '../../components/ui';

export default function Machinery() {
  const { navigate } = useApp();
  const { products } = useProducts();
  const { movements } = useMovements();
  const { locations } = useLocations();
  const { stock } = useStock();
  const { users } = useUsers();
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const machinery = getMachinery(products);
  const filtered = filterMachineryByStatus(machinery, filterStatus);
  const detail = selected ? machinery.find(m => m.id === selected) : null;
  const detailMov = detail ? movements.filter(m => m.productId === detail.id).slice(0, 10) : [];
  const detailStock = detail ? stock.find(s => s.productId === detail.id) : null;
  const detailLoc = detailStock ? locations.find(l => l.id === detailStock.locationId) : null;

  const statusCounts = countMachineryByStatus(machinery);

  const statusColors: Record<string, string> = {
    operativo: 'border-[#5DF8D8]/40 bg-[#5DF8D8]/5',
    mantenimiento: 'border-amber-200 bg-amber-50/30',
    inoperativo: 'border-red-200 bg-red-50/30',
    transito: 'border-[#6FD1D7]/40 bg-[#6FD1D7]/5',
    fuera_servicio: 'border-gray-200 bg-gray-50',
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Maquinaria y Activos"
        description={`${machinery.length} activos controlados · ${statusCounts.operativo} operativos`}
        breadcrumbs={getBreadcrumbs('machinery', navigate)}
        actions={
          <div className="flex gap-2">
            <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
              {(['cards', 'table'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${view === v ? 'bg-white shadow text-[#093C5D]' : 'text-gray-500 hover:text-gray-700'}`}>
                  {v === 'cards' ? '⊞ Tarjetas' : '≡ Tabla'}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Status summary */}
      <div className="flex gap-2 px-6 py-3 border-b border-gray-200 bg-white flex-wrap">
        {[
          { key: '', label: 'Todos', count: machinery.length },
          { key: 'operativo', label: 'Operativo', count: statusCounts.operativo },
          { key: 'mantenimiento', label: 'Mantenimiento', count: statusCounts.mantenimiento },
          { key: 'inoperativo', label: 'Inoperativo', count: statusCounts.inoperativo },
          { key: 'transito', label: 'En tránsito', count: statusCounts.transito },
        ].map(s => (
          <button key={s.key} onClick={() => setFilterStatus(s.key)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${filterStatus === s.key ? 'bg-[#093C5D] text-white border-[#093C5D]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#3B7597]'}`}>
            {s.label} <span className={`font-bold ${filterStatus === s.key ? 'text-white' : 'text-[#093C5D]'}`}>{s.count}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {view === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(maq => {
              const stockEntry = stock.find(s => s.productId === maq.id);
              const loc = stockEntry ? locations.find(l => l.id === stockEntry.locationId) : null;
              return (
                <div key={maq.id} className={`siga-card p-5 cursor-pointer border-2 hover:shadow-md transition-all ${statusColors[maq.machineryStatus ?? 'operativo']}`}
                  onClick={() => setSelected(maq.id)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 flex items-center justify-center"><TruckIcon size={20} className="text-[#3B7597]" /></div>
                      <div>
                        <div className="font-mono text-xs text-[#3B7597]">{maq.assetCode}</div>
                        <div className="font-bold text-[#093C5D] text-sm leading-tight max-w-[140px]">{maq.name}</div>
                      </div>
                    </div>
                    <MachineryStatusBadge status={maq.machineryStatus ?? 'operativo'} />
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between"><span className="text-gray-400">VIN/PIN:</span><span className="font-mono">{maq.vin?.slice(-12)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Marca / Modelo:</span><span className="font-medium">{maq.brand} {maq.model}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Horómetro:</span><span className="font-semibold text-[#093C5D]">{formatNumber(maq.hourMeter ?? 0)} hrs</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Ubicación:</span><span>{loc?.name ?? '—'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Valor:</span><span className="font-semibold">{formatCurrency(maq.avgCost)}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="siga-table">
            <thead><tr><th>Código</th><th>Activo</th><th>VIN/PIN</th><th>Marca</th><th>Modelo</th><th className="text-right">Horómetro</th><th>Ubicación</th><th>Estado</th><th>Valor</th><th></th></tr></thead>
            <tbody>
              {filtered.map(maq => {
                const stockEntry = stock.find(s => s.productId === maq.id);
                const loc = stockEntry ? locations.find(l => l.id === stockEntry.locationId) : null;
                return (
                  <tr key={maq.id}>
                    <td className="font-mono text-xs text-[#3B7597]">{maq.assetCode}</td>
                    <td><div className="font-medium text-sm">{maq.name}</div><div className="text-xs font-mono text-gray-400">{maq.sku}</div></td>
                    <td className="font-mono text-xs">{maq.vin?.slice(-12)}</td>
                    <td className="text-sm">{maq.brand}</td>
                    <td className="text-sm">{maq.model}</td>
                    <td className="text-right font-semibold text-[#093C5D]">{formatNumber(maq.hourMeter ?? 0)} hrs</td>
                    <td className="text-xs">{loc?.name ?? '—'}</td>
                    <td><MachineryStatusBadge status={maq.machineryStatus ?? 'operativo'} /></td>
                    <td className="text-sm font-semibold">{formatCurrency(maq.avgCost)}</td>
                    <td><button onClick={() => setSelected(maq.id)} className="p-1 rounded text-[#3B7597] hover:bg-[#6FD1D7]/20"><EyeIcon size={14} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {filtered.length === 0 && <EmptyState icon={<TruckIcon size={48} />} title="No hay activos con este estado" />}
      </div>

      {/* Detail modal */}
      {detail && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={`${detail.assetCode} — ${detail.name}`} size="xl">
          <div className="space-y-5">
            <DetailHeader
              eyebrow={detail.assetCode}
              title={detail.name}
              badges={<MachineryStatusBadge status={detail.machineryStatus ?? 'operativo'} />}
            />

            <DetailSection title="Información general">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <DetailField label="VIN/PIN completo" value={<span className="font-mono">{detail.vin}</span>} />
                <DetailField label="Código de activo" value={detail.assetCode} />
                <DetailField label="Horómetro" value={<>{formatNumber(detail.hourMeter ?? 0)} <span className="text-xs text-gray-400 font-normal">hrs</span></>} />
                <DetailField label="Marca" value={detail.brand} />
                <DetailField label="Modelo" value={detail.model} />
                <DetailField label="Ubicación" value={detailLoc?.name ?? '—'} />
                <DetailField label="Valor del activo" value={formatCurrency(detail.avgCost)} />
                <DetailField label="SKU" value={<span className="font-mono">{detail.sku}</span>} />
                <DetailField label="Mov. sensible" value={detail.sensitiveMovement ? 'Sí' : 'No'} />
              </div>
            </DetailSection>

            <DetailSection title={`Historial de movimientos (${detailMov.length})`}>
              <table className="siga-table">
                <thead><tr><th>ID</th><th>Tipo</th><th>Desde</th><th>Hacia</th><th>Registrado por</th><th>Fecha</th><th>Estado</th></tr></thead>
                <tbody>
                  {detailMov.map(mv => {
                    const user = users.find(u => u.id === mv.registeredBy);
                    const fromLoc = locations.find(l => l.id === mv.fromLocationId);
                    const toLoc = locations.find(l => l.id === mv.toLocationId);
                    return (
                      <tr key={mv.id}>
                        <td className="font-mono text-xs text-[#3B7597]">{mv.id}</td>
                        <td><Badge variant="primary">{mv.type.replace('_', ' ')}</Badge></td>
                        <td className="text-xs">{fromLoc?.name ?? '—'}</td>
                        <td className="text-xs">{toLoc?.name ?? '—'}</td>
                        <td className="text-xs">{user?.name} {user?.lastName}</td>
                        <td className="text-xs font-mono">{mv.createdAt.split(' ')[0]}</td>
                        <td><MovementStatusBadge status={mv.status} /></td>
                      </tr>
                    );
                  })}
                  {detailMov.length === 0 && <tr><td colSpan={7} className="text-center text-gray-400 py-4">Sin movimientos registrados</td></tr>}
                </tbody>
              </table>
            </DetailSection>
          </div>
        </Modal>
      )}
    </div>
  );
}
