import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { actionRoutePath, routePath } from '../../navigation/routeRegistry';
import { useDashboardMetrics } from './hooks/useDashboardMetrics';
import { DashboardHeader } from './components/DashboardHeader';
import { KpiSummaryGrid } from './components/KpiSummaryGrid';
import { MovementTrendChart } from './components/MovementTrendChart';
import { CategoryDistributionChart } from './components/CategoryDistributionChart';
import { CriticalAlertsPanel } from './components/CriticalAlertsPanel';
import { RecentMovementsPanel } from './components/RecentMovementsPanel';
import { MachineryStatusPanel } from './components/MachineryStatusPanel';
import { LocationStockChart } from './components/LocationStockChart';
import type { Alert } from '../../../domain/entities/Alert';

export default function Dashboard() {
  const { navigate } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('agosto');
  const {
    currentUser, totalStock, machinery, operativeMachinery, machineryAvailability,
    belowMin, zeroStock, expirySoon, entriesThisPeriod, exitsThisPeriod, pendingAuthorizations,
    recentMovements, criticalAlerts, warningAlerts, markAlertRead,
  } = useDashboardMetrics();

  function handleAlertClick(alert: Alert) {
    markAlertRead(alert.id);
    if (alert.actionRoute) navigate(actionRoutePath(alert.actionRoute));
  }

  return (
    <div className="p-6 space-y-5">
      <DashboardHeader
        userName={currentUser?.name}
        role={currentUser?.role}
        period={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <KpiSummaryGrid
        totalStock={totalStock}
        machineryAvailability={machineryAvailability}
        operativeMachinery={operativeMachinery}
        totalMachinery={machinery.length}
        belowMin={belowMin}
        zeroStock={zeroStock}
        expirySoon={expirySoon}
        entriesThisPeriod={entriesThisPeriod}
        exitsThisPeriod={exitsThisPeriod}
        pendingAuthorizations={pendingAuthorizations}
        onNavigate={navigate}
      />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MovementTrendChart />
        <CategoryDistributionChart />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CriticalAlertsPanel
          criticalAlerts={criticalAlerts}
          warningAlerts={warningAlerts}
          onAlertClick={handleAlertClick}
          onViewAll={() => navigate(routePath('alerts'))}
        />
        <RecentMovementsPanel
          movements={recentMovements}
          onViewAll={() => navigate(routePath('entries'))}
        />
        <MachineryStatusPanel
          machinery={machinery}
          machineryAvailability={machineryAvailability}
          onSelectMachinery={() => navigate(routePath('machinery'))}
          onViewAll={() => navigate(routePath('machinery'))}
        />
      </div>

      <LocationStockChart onViewDetail={() => navigate(routePath('locations'))} />
    </div>
  );
}
