import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { usePhysicalCounts } from '../../hooks/usePhysicalCounts';
import { useProducts } from '../../hooks/useProducts';
import { useLocations } from '../../hooks/useLocations';
import { useUnits } from '../../hooks/useUnits';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Button, PageHeader, PlusIcon, Spinner } from '../../components/ui';
import { aggregateCountStats } from './physical-count/utils/countStats';
import { PhysicalCountKpis } from './physical-count/components/PhysicalCountKpis';
import { IraGauge } from './physical-count/components/IraGauge';
import { PhysicalCountHistory } from './physical-count/components/PhysicalCountHistory';
import { PhysicalCountDetailModal } from './physical-count/components/PhysicalCountDetailModal';
import { NewPhysicalCountModal } from './physical-count/components/NewPhysicalCountModal';

export default function PhysicalCount() {
  const { navigate, showToast } = useApp();
  const counts = usePhysicalCounts();
  const { products } = useProducts();
  const { locations } = useLocations();
  const { units } = useUnits();
  const [newModal, setNewModal] = useState(false);
  const stats = aggregateCountStats(counts.counts);

  async function handleCreate(locationId: string, notes?: string) {
    const created = await counts.createCount({ locationId, notes: notes || undefined });
    if (!created) return;
    setNewModal(false);
    showToast('success', 'Conteo creado con la fotografía de stock del backend.');
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Conteo Físico" description="Inventario cíclico y exactitud de registros (IRA)"
        breadcrumbs={getBreadcrumbs('physical-count', navigate)}
        actions={<Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={() => setNewModal(true)}>Nuevo conteo</Button>}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {counts.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            {counts.error.message}
          </div>
        )}
        <PhysicalCountKpis stats={stats} />
        <IraGauge ira={stats.ira} />
        {counts.loading ? (
          <div className="flex justify-center py-12 text-[#3B7597]"><Spinner size={28} /></div>
        ) : (
          <PhysicalCountHistory
            physicalCounts={counts.counts}
            locations={locations}
            page={counts.page}
            size={counts.size}
            totalElements={counts.totalElements}
            onPageChange={counts.setPage}
            onSelect={id => void counts.openCount(id)}
            onNew={() => setNewModal(true)}
          />
        )}
      </div>

      <PhysicalCountDetailModal
        detail={counts.detail}
        products={products}
        units={units}
        locations={locations}
        loading={counts.commandLoading || counts.detailLoading}
        commandError={counts.error?.message ?? null}
        onCapture={counts.captureLine}
        onAddUnexpected={counts.addUnexpectedLine}
        onCloseCount={counts.closeCount}
        onCancelCount={counts.cancelCount}
        onClose={counts.closeDetail}
      />

      <NewPhysicalCountModal
        open={newModal}
        onClose={() => setNewModal(false)}
        onSubmit={handleCreate}
        loading={counts.commandLoading}
        error={counts.error?.message ?? null}
        locations={locations}
      />
    </div>
  );
}
