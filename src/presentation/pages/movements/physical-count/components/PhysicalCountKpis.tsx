import { KpiCard, formatNumber, PackageIcon, CheckIcon, ActivityIcon } from '../../../../components/ui';
import type { AggregatedCountStats } from '../utils/countStats';

export function PhysicalCountKpis({ stats }: { stats: AggregatedCountStats }) {
  const { ira, countedTotal, exactTotal, withDiff } = stats;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="IRA — Exactitud del inventario" value={`${ira}%`} icon={<ActivityIcon size={20} />}
        variant={ira >= 95 ? 'success' : ira >= 85 ? 'info' : 'warning'} trendLabel={`Meta: 95%`} />
      <KpiCard title="Ítems contados" value={formatNumber(countedTotal)} icon={<PackageIcon size={20} />} variant="info" />
      <KpiCard title="Ítems exactos" value={formatNumber(exactTotal)} icon={<CheckIcon size={20} />} variant="success" />
      <KpiCard title="Con diferencias" value={formatNumber(withDiff)} icon={<ActivityIcon size={20} />}
        variant={withDiff === 0 ? 'success' : withDiff < 5 ? 'warning' : 'error'} />
    </div>
  );
}
