import { useEffect, useMemo, useState } from 'react';
import type { InventoryValuationItem, MovementReportItem, ReportingMovementType } from '../../../domain/entities/Reporting';
import { ApiError } from '../../../infrastructure/http/ApiClient';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { useApp } from '../../state/AppContext';
import { useReporting } from '../../state/ReportingContext';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Button, Input, PageHeader, Spinner } from '../../components/ui';
import { REPORTS, type ReportDefinition } from './constants';
import { ReportsCatalog } from './components/ReportsCatalog';
import { ReportDetailHeader } from './components/ReportDetailHeader';
import { InventoryReportView } from './components/InventoryReportView';
import { MovementFlowReportView } from './components/MovementFlowReportView';
import { AdjustmentReportView } from './components/AdjustmentReportView';
import { defaultReportDates, formatDataUpdatedAt, toLimaBoundary } from './reportingDates';

interface PageMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  dataUpdatedAt: string | null;
}

const emptyMeta: PageMeta = { page: 0, size: 20, totalElements: 0, totalPages: 0, dataUpdatedAt: null };

export default function Reports() {
  const { navigate } = useApp();
  const useCases = useReporting();
  const defaults = useMemo(defaultReportDates, []);
  const [activeReport, setActiveReport] = useState<ReportDefinition['id'] | null>(null);
  const [dateFrom, setDateFrom] = useState(defaults.dateFrom);
  const [dateTo, setDateTo] = useState(defaults.dateTo);
  const [movementType, setMovementType] = useState<ReportingMovementType | ''>('');
  const [categoryCode, setCategoryCode] = useState('');
  const [locationId, setLocationId] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [movementRows, setMovementRows] = useState<MovementReportItem[]>([]);
  const [valuationRows, setValuationRows] = useState<InventoryValuationItem[]>([]);
  const [meta, setMeta] = useState<PageMeta>(emptyMeta);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!activeReport) return;
    let cancelled = false;
    const from = toLimaBoundary(dateFrom);
    const to = toLimaBoundary(dateTo);
    if (activeReport !== 'valuation' && new Date(from) >= new Date(to)) {
      setLoading(false);
      setError(new Error('La fecha hasta es exclusiva y debe ser posterior a la fecha desde.'));
      return;
    }
    setLoading(true);
    setError(null);
    const request = activeReport === 'movements'
      ? useCases.getMovementReport.execute({ from, to, page, size, movementType: movementType || undefined })
      : activeReport === 'adjustments'
        ? useCases.getAdjustmentReport.execute({
            from,
            to,
            page,
            size,
            adjustmentType: movementType === 'ADJUST_POSITIVE' || movementType === 'ADJUST_NEGATIVE' ? movementType : undefined,
          })
        : useCases.getInventoryValuation.execute({ page, size, categoryCode: categoryCode || undefined, locationId: locationId || undefined });

    request
      .then(result => {
        if (cancelled) return;
        setMeta({ page: result.page, size: result.size, totalElements: result.totalElements, totalPages: result.totalPages, dataUpdatedAt: result.dataUpdatedAt });
        if (activeReport === 'valuation') {
          setValuationRows(result.content as InventoryValuationItem[]);
          setMovementRows([]);
        } else {
          setMovementRows(result.content as MovementReportItem[]);
          setValuationRows([]);
        }
      })
      .catch(cause => { if (!cancelled) setError(cause); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeReport, categoryCode, dateFrom, dateTo, locationId, movementType, page, size, useCases]);

  const report = activeReport ? REPORTS.find(item => item.id === activeReport) : undefined;
  const forbidden = error instanceof ApiError && error.status === 403;

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Centro de Reportes" description="Reportes operativos servidos por Reporting" breadcrumbs={getBreadcrumbs('reports', navigate)} />
      {!activeReport ? (
        <ReportsCatalog onSelectReport={id => { setPage(0); setMovementType(''); setCategoryCode(''); setLocationId(''); setActiveReport(id); }} />
      ) : (
        <div className="flex-1 overflow-auto p-6 space-y-5">
          <ReportDetailHeader title={report?.name ?? ''} onBack={() => setActiveReport(null)} />
          <div className="siga-card p-4 flex flex-wrap gap-3 items-end">
            {activeReport !== 'valuation' && (
              <>
                <Input label="Desde" type="date" value={dateFrom} onChange={event => { setPage(0); setDateFrom(event.target.value); }} />
                <Input label="Hasta (exclusivo)" type="date" value={dateTo} onChange={event => { setPage(0); setDateTo(event.target.value); }} />
              </>
            )}
            {activeReport === 'movements' && (
              <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo
                <select className="siga-select" value={movementType} onChange={event => { setPage(0); setMovementType(event.target.value as ReportingMovementType | ''); }}>
                  <option value="">Todos</option><option value="ENTRY">Entrada</option><option value="EXIT">Salida</option><option value="TRANSFER">Transferencia</option><option value="ADJUST_POSITIVE">Ajuste positivo</option><option value="ADJUST_NEGATIVE">Ajuste negativo</option>
                </select>
              </label>
            )}
            {activeReport === 'adjustments' && (
              <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo
                <select className="siga-select" value={movementType} onChange={event => { setPage(0); setMovementType(event.target.value as ReportingMovementType | ''); }}>
                  <option value="">Todos</option><option value="ADJUST_POSITIVE">Positivo</option><option value="ADJUST_NEGATIVE">Negativo</option>
                </select>
              </label>
            )}
            {activeReport === 'valuation' && (
              <>
                <Input label="Código de categoría" value={categoryCode} onChange={event => { setPage(0); setCategoryCode(event.target.value); }} />
                <Input label="ID de ubicación" value={locationId} onChange={event => { setPage(0); setLocationId(event.target.value); }} />
              </>
            )}
            <div className="ml-auto text-xs text-gray-400">{formatDataUpdatedAt(meta.dataUpdatedAt)}</div>
          </div>

          {loading ? <div className="h-40 flex items-center justify-center gap-2 text-sm text-gray-500"><Spinner />Cargando reporte…</div> : error ? (
            <div className="siga-card p-6 border-red-200 text-sm text-red-700">{forbidden ? 'Tu sesión no posee REPORT_READ.' : getErrorMessage(error)}</div>
          ) : activeReport === 'valuation' ? (
            <InventoryReportView rows={valuationRows} />
          ) : activeReport === 'adjustments' ? (
            <AdjustmentReportView rows={movementRows} />
          ) : (
            <MovementFlowReportView rows={movementRows} />
          )}

          {!loading && !error && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span>{meta.totalElements} resultados · Página {meta.page + 1} de {Math.max(meta.totalPages, 1)}</span>
                <label>Filas <select className="siga-select h-7 text-xs ml-1" value={size} onChange={event => { setPage(0); setSize(Number(event.target.value)); }}><option value={20}>20</option><option value={50}>50</option><option value={100}>100</option></select></label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={meta.page === 0} onClick={() => setPage(value => value - 1)}>Anterior</Button>
                <Button variant="outline" size="sm" disabled={meta.page + 1 >= meta.totalPages} onClick={() => setPage(value => value + 1)}>Siguiente</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
