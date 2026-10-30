import { useState } from 'react';
import { ApiError } from '../../../infrastructure/http/ApiClient';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { useReportingDashboard } from '../../hooks/useReportingDashboard';
import { useApp } from '../../state/AppContext';
import { Spinner } from '../../components/ui';
import { DashboardHeader } from './components/DashboardHeader';
import { KpiSummaryGrid } from './components/KpiSummaryGrid';
import { MovementTrendChart } from './components/MovementTrendChart';
import { CriticalProductsPanel } from './components/CriticalProductsPanel';
import type { DashboardRange } from '../reports/reportingDates';

export default function Dashboard() {
  const { state } = useApp();
  const [range, setRange] = useState<DashboardRange>('LAST_30_DAYS');
  const { data, loading, error } = useReportingDashboard(range);

  if (loading) {
    return <div className="h-full flex items-center justify-center gap-3 text-sm text-gray-500"><Spinner size={20} />Cargando indicadores…</div>;
  }

  if (error) {
    const forbidden = error instanceof ApiError && error.status === 403;
    return (
      <div className="p-6">
        <div className="siga-card p-6 border-red-200">
          <h1 className="font-semibold text-[#093C5D]">{forbidden ? 'Acceso restringido' : 'No se pudo cargar Reporting'}</h1>
          <p className="text-sm text-gray-500 mt-2">{forbidden ? 'Tu sesión no posee REPORT_READ.' : getErrorMessage(error)}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-5">
      <DashboardHeader
        userName={state.currentUser?.name}
        role={state.currentUser?.role}
        range={range}
        onRangeChange={setRange}
        dataUpdatedAt={data.dataUpdatedAt}
      />
      <KpiSummaryGrid dashboard={data} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MovementTrendChart data={data.movementTrend} />
        <CriticalProductsPanel products={data.topCriticalProducts} />
      </div>
    </div>
  );
}
