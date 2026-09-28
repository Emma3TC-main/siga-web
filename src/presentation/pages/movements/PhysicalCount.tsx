import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { usePhysicalCounts } from '../../hooks/usePhysicalCounts';
import { useStock } from '../../hooks/useStock';
import { useProducts } from '../../hooks/useProducts';
import { useLocations } from '../../hooks/useLocations';
import { useUnits } from '../../hooks/useUnits';
import { useUsers } from '../../hooks/useUsers';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Button, PageHeader, PlusIcon } from '../../components/ui';
import { aggregateCountStats } from './physical-count/utils/countStats';
import { PhysicalCountKpis } from './physical-count/components/PhysicalCountKpis';
import { IraGauge } from './physical-count/components/IraGauge';
import { PhysicalCountHistory } from './physical-count/components/PhysicalCountHistory';
import { PhysicalCountDetailModal } from './physical-count/components/PhysicalCountDetailModal';
import { NewPhysicalCountModal, type NewCountItem } from './physical-count/components/NewPhysicalCountModal';

export default function PhysicalCount() {
  const { navigate, showToast } = useApp();
  const { physicalCounts } = usePhysicalCounts();
  const { stock } = useStock();
  const { products } = useProducts();
  const { locations } = useLocations();
  const { users } = useUsers();
  const { units } = useUnits();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [newModal, setNewModal] = useState(false);
  const [locFilter, setLocFilter] = useState('');
  const [items, setItems] = useState<NewCountItem[]>([]);
  const [countName, setCountName] = useState('');
  const [loading, setLoading] = useState(false);

  const detail = detailId ? physicalCounts.find(c => c.id === detailId) ?? null : null;
  const stats = aggregateCountStats(physicalCounts);

  function openNew() {
    const locStock = locFilter ? stock.filter(s => s.locationId === locFilter) : stock;
    setItems(locStock.slice(0, 10).map(s => ({ productId: s.productId, locationId: s.locationId, counted: String(s.quantity) })));
    setCountName(`Conteo ${new Date().toLocaleDateString('es-PE')}`);
    setNewModal(true);
  }

  async function handleSubmit() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    showToast('success', `Conteo físico registrado con ${items.length} ítems. IRA calculado.`);
    setNewModal(false);
    setLoading(false);
  }

  function setItemCount(idx: number, val: string) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, counted: val } : it));
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Conteo Físico" description="Inventario cíclico y exactitud de registros (IRA)"
        breadcrumbs={getBreadcrumbs('physical-count', navigate)}
        actions={<Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={openNew}>Nuevo conteo</Button>}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <PhysicalCountKpis stats={stats} />
        <IraGauge ira={stats.ira} />
        <PhysicalCountHistory physicalCounts={physicalCounts} locations={locations} users={users} onSelect={setDetailId} onNew={openNew} />
      </div>

      <PhysicalCountDetailModal detail={detail} products={products} units={units} locations={locations} users={users} onClose={() => setDetailId(null)} />

      <NewPhysicalCountModal
        open={newModal}
        onClose={() => setNewModal(false)}
        onSubmit={handleSubmit}
        loading={loading}
        countName={countName}
        onCountNameChange={setCountName}
        locFilter={locFilter}
        onLocFilterChange={setLocFilter}
        items={items}
        onItemCountChange={setItemCount}
        locations={locations}
        products={products}
        stock={stock}
      />
    </div>
  );
}
