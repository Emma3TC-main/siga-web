import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useUnits } from '../../hooks/useUnits';
import { useLocations } from '../../hooks/useLocations';
import { useCostCenters } from '../../hooks/useCostCenters';
import { useMovements } from '../../hooks/useMovements';
import { useStock } from '../../hooks/useStock';
import { buildInventoryReport, buildCostCenterConsumption, getReplenishmentRows, totalValuation } from '../../../domain/rules/reportRules';
import { useReportSeries } from '../../hooks/useReportSeries';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { PageHeader } from '../../components/ui';
import { REPORTS, IMPLEMENTED_REPORT_IDS } from './constants';
import { ReportsCatalog, type ReportFilters } from './components/ReportsCatalog';
import { ReportDetailHeader } from './components/ReportDetailHeader';
import { InventoryReportView } from './components/InventoryReportView';
import { MovementFlowReportView } from './components/MovementFlowReportView';
import { ReplenishmentReportView } from './components/ReplenishmentReportView';
import { CostCenterReportView } from './components/CostCenterReportView';
import { ValuationReportView } from './components/ValuationReportView';
import { PlaceholderReportView } from './components/PlaceholderReportView';

export default function Reports() {
  const { navigate } = useApp();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { units } = useUnits();
  const { locations } = useLocations();
  const { costCenters } = useCostCenters();
  const { movements } = useMovements();
  const { stock } = useStock();
  const { reportSeries } = useReportSeries();
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({ dateFrom: '2025-08-01', dateTo: '2025-08-24', category: '', location: '', costCenter: '' });

  const inventoryData = buildInventoryReport(products, stock, categories, units, filters.category);
  const replenishData = getReplenishmentRows(inventoryData);
  const flowData = reportSeries?.movementFlow ?? [];
  const costCenterData = buildCostCenterConsumption(costCenters, movements);
  const inventoryValuation = totalValuation(inventoryData);

  const activeReportDef = activeReport ? REPORTS.find(r => r.id === activeReport) : undefined;

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Centro de Reportes" description="Generación y visualización de reportes operativos"
        breadcrumbs={getBreadcrumbs('reports', navigate)}
      />

      {!activeReport ? (
        <ReportsCatalog
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          locations={locations}
          onSelectReport={setActiveReport}
        />
      ) : (
        <div className="flex-1 overflow-auto p-6 space-y-5">
          <ReportDetailHeader title={activeReportDef?.name ?? ''} onBack={() => setActiveReport(null)} />

          {activeReport === 'inventario' && <InventoryReportView rows={inventoryData} totalValuation={inventoryValuation} />}
          {activeReport === 'flujo' && <MovementFlowReportView flowData={flowData} />}
          {activeReport === 'reposicion' && <ReplenishmentReportView rows={replenishData} />}
          {activeReport === 'consumo-cc' && <CostCenterReportView costCenterData={costCenterData} />}
          {activeReport === 'valorizacion' && <ValuationReportView inventoryData={inventoryData} totalValuation={inventoryValuation} />}
          {!IMPLEMENTED_REPORT_IDS.includes(activeReport) && <PlaceholderReportView report={activeReportDef} />}
        </div>
      )}
    </div>
  );
}
