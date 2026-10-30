import type { ReportingDashboard } from '../../../../domain/entities/Reporting';
import {
  KpiCard,
  BarChartIcon,
  AlertIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsIcon,
  AdjustIcon,
  ActivityIcon,
  formatCurrency,
} from '../../../components/ui';

export function KpiSummaryGrid({ dashboard }: { dashboard: ReportingDashboard }) {
  const adjustments = dashboard.positiveAdjustmentCount + dashboard.negativeAdjustmentCount;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Valor del inventario" value={formatCurrency(dashboard.stockValuePen)} icon={<BarChartIcon size={20} />} />
      <KpiCard title="Bajo stock mínimo" value={dashboard.lowStockProductCount} unit="productos" icon={<AlertIcon size={20} />} variant={dashboard.lowStockProductCount ? 'warning' : 'default'} />
      <KpiCard title="Sin stock" value={dashboard.outOfStockProductCount} unit="productos" icon={<AlertIcon size={20} />} variant={dashboard.outOfStockProductCount ? 'error' : 'default'} />
      <KpiCard title="Movimientos confirmados" value={dashboard.confirmedMovementCount} icon={<ActivityIcon size={20} />} variant="info" />
      <KpiCard title="Entradas" value={dashboard.entryCount} icon={<ArrowDownIcon size={20} />} variant="success" />
      <KpiCard title="Salidas" value={dashboard.exitCount} icon={<ArrowUpIcon size={20} />} />
      <KpiCard title="Transferencias" value={dashboard.transferCount} icon={<ArrowsIcon size={20} />} />
      <KpiCard title="Ajustes" value={adjustments} unit={`+${dashboard.positiveAdjustmentCount} / -${dashboard.negativeAdjustmentCount}`} icon={<AdjustIcon size={20} />} variant={adjustments ? 'warning' : 'default'} />
    </div>
  );
}
