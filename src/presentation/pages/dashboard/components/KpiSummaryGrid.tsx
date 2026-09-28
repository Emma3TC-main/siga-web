import {
  KpiCard, Badge, BarChartIcon, TruckIcon, AlertIcon as Alert2Icon, BellIcon, ArrowDownIcon, ArrowUpIcon, ShieldIcon,
} from '../../../components/ui';
import { routePath } from '../../../navigation/routeRegistry';

export interface KpiSummaryGridProps {
  totalStock: number;
  machineryAvailability: number;
  operativeMachinery: number;
  totalMachinery: number;
  belowMin: number;
  zeroStock: number;
  expirySoon: number;
  entriesThisPeriod: number;
  exitsThisPeriod: number;
  pendingAuthorizations: number;
  onNavigate: (path: string) => void;
}

export function KpiSummaryGrid({
  totalStock, machineryAvailability, operativeMachinery, totalMachinery,
  belowMin, zeroStock, expirySoon, entriesThisPeriod, exitsThisPeriod, pendingAuthorizations, onNavigate,
}: KpiSummaryGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Valor inmovilizado"
        value={`S/ ${(totalStock / 1000000).toFixed(2)}M`}
        icon={<BarChartIcon size={20} />}
        variant="default"
        trend="up"
        trendLabel="+8.3% vs mes anterior"
        onClick={() => onNavigate(routePath('reports'))}
      />
      <KpiCard
        title="Disponibilidad activos"
        value={`${machineryAvailability}%`}
        icon={<TruckIcon size={20} />}
        variant={machineryAvailability >= 80 ? 'success' : 'warning'}
        trend={machineryAvailability >= 80 ? 'up' : 'down'}
        trendLabel={`${operativeMachinery}/${totalMachinery} operativos`}
        onClick={() => onNavigate(routePath('machinery'))}
      />
      <KpiCard
        title="Bajo stock mínimo"
        value={belowMin}
        unit="productos"
        icon={<Alert2Icon size={20} />}
        variant={belowMin > 5 ? 'error' : belowMin > 2 ? 'warning' : 'default'}
        badge={belowMin > 0 ? <Badge variant="warning">Atención</Badge> : undefined}
        onClick={() => onNavigate(routePath('inventory'))}
      />
      <KpiCard
        title="Sin stock"
        value={zeroStock}
        unit="productos"
        icon={<Alert2Icon size={20} />}
        variant={zeroStock > 0 ? 'error' : 'default'}
        badge={zeroStock > 0 ? <Badge variant="error">Crítico</Badge> : undefined}
        onClick={() => onNavigate(routePath('inventory'))}
      />
      <KpiCard
        title="Insumos próx. vencer"
        value={expirySoon}
        unit="lotes"
        icon={<BellIcon size={20} />}
        variant={expirySoon > 0 ? 'warning' : 'default'}
        onClick={() => onNavigate(routePath('inventory'))}
      />
      <KpiCard
        title="Entradas del período"
        value={entriesThisPeriod}
        unit="movimientos"
        icon={<ArrowDownIcon size={20} />}
        variant="info"
        trend="up"
        trendLabel="vs período anterior"
        onClick={() => onNavigate(routePath('entries'))}
      />
      <KpiCard
        title="Salidas del período"
        value={exitsThisPeriod}
        unit="movimientos"
        icon={<ArrowUpIcon size={20} />}
        variant="default"
        onClick={() => onNavigate(routePath('exits'))}
      />
      <KpiCard
        title="Autorizaciones pendientes"
        value={pendingAuthorizations}
        unit="solicitudes"
        icon={<ShieldIcon size={20} />}
        variant={pendingAuthorizations > 0 ? 'warning' : 'default'}
        badge={pendingAuthorizations > 0 ? <Badge variant="warning" dot>Pendiente</Badge> : undefined}
        onClick={() => onNavigate(routePath('authorizations'))}
      />
    </div>
  );
}
