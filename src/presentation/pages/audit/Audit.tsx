import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useAuditLog } from '../../hooks/useAuditLog';
import { ApiError } from '../../../infrastructure/http/ApiClient';
import type { AuditEvent } from '../../../domain/entities/AuditEvent';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import {
  PageHeader, Badge, Modal, EmptyState, Button,
  ActivityIcon, EyeIcon, TableActionButton, RefreshIcon, AlertIcon,
} from '../../components/ui';

const EVENT_LABELS: Record<string, string> = {
  MovementConfirmed: 'Movimiento confirmado',
  MOVEMENT_CONFIRMED: 'Movimiento confirmado',
};

const RESOURCE_LABELS: Record<string, string> = {
  Movement: 'Movimiento',
};

const DETAIL_LABELS: Record<string, string> = {
  referenceDocType: 'Tipo de documento',
  referenceDocNumber: 'Documento',
  totalBaseCostPen: 'Costo total',
  confirmedByUserId: 'Confirmado por',
  authorizedByUserId: 'Autorizado por',
  registeredByUserId: 'Registrado por',
  locationId: 'Ubicación',
  stockBalanceId: 'Saldo de inventario',
};

const UUID_DETAIL_FIELDS = new Set([
  'confirmedByUserId',
  'authorizedByUserId',
  'registeredByUserId',
  'locationId',
  'stockBalanceId',
]);

function shortId(value?: string | null): string {
  if (!value) return '—';
  return value.length > 12 ? `${value.slice(0, 8)}…` : value;
}

function eventLabel(value?: string | null): string {
  if (!value) return '—';
  return EVENT_LABELS[value] ?? value;
}

function resourceLabel(value?: string | null): string {
  if (!value) return '—';
  return RESOURCE_LABELS[value] ?? value;
}

function eventDescription(event: AuditEvent): string {
  if (event.action === 'MOVEMENT_CONFIRMED' || event.eventType === 'MovementConfirmed') {
    return 'Se confirmó un movimiento de inventario.';
  }
  return `Se registró el evento ${eventLabel(event.action || event.eventType)}.`;
}

function formatDetailValue(key: string, value: unknown): string {
  if (value == null || value === '') return '—';
  if (key === 'totalBaseCostPen' && (typeof value === 'number' || typeof value === 'string')) {
    const amount = Number(value);
    if (Number.isFinite(amount)) {
      return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    }
  }
  if (UUID_DETAIL_FIELDS.has(key) && typeof value === 'string') return shortId(value);
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function Audit() {
  const { navigate } = useApp();

  const [aggregateType, setAggregateType] = useState<string>('');
  const [actorId, setActorId] = useState<string>('');
  const [aggregateId, setAggregateId] = useState<string>('');
  const [correlationId, setCorrelationId] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [filterError, setFilterError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const { auditLog, pageData, loading, error, filters, setFilters, refetch } = useAuditLog({
    page: 0,
    size: 20,
  });

  const currentPage = filters.page ?? 0;
  const pageSize = filters.size ?? 20;
  const totalElements = pageData?.totalElements ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const actorOptions = Array.from(new Set(
    auditLog.map(event => event.actorId || event.userId).filter((value): value is string => Boolean(value)),
  )).sort();
  const resourceTypeOptions = Array.from(new Set([
    'Movement',
    ...auditLog.map(event => event.aggregateType).filter((value): value is string => Boolean(value)),
  ])).sort();

  const optionalUuid = (value: string, label: string): string | undefined => {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
      throw new Error(`${label} debe ser un UUID válido.`);
    }
    return trimmed;
  };

  const applyFilters = () => {
    try {
      const nextActorId = optionalUuid(actorId, 'Actor');
      const nextAggregateId = optionalUuid(aggregateId, 'ID del recurso');
      const nextCorrelationId = optionalUuid(correlationId, 'ID de correlación');
      if (fromDate && toDate && fromDate > toDate) {
        throw new Error('La fecha Desde no puede ser posterior a Hasta.');
      }
      setFilterError(null);
      setSelected(null);
      setFilters({
        page: 0,
        size: 20,
        actorId: nextActorId,
        aggregateType: aggregateType.trim() || undefined,
        aggregateId: nextAggregateId,
        correlationId: nextCorrelationId,
        from: fromDate ? new Date(`${fromDate}T00:00:00Z`).toISOString() : undefined,
        to: toDate ? new Date(`${toDate}T23:59:59.999Z`).toISOString() : undefined,
      });
    } catch (cause) {
      setFilterError(cause instanceof Error ? cause.message : 'Los filtros no son válidos.');
    }
  };

  const applyQuickDateFilter = (range: 'today' | '24h' | '7d') => {
    try {
      const nextActorId = optionalUuid(actorId, 'Actor');
      const nextAggregateId = optionalUuid(aggregateId, 'ID del recurso');
      const nextCorrelationId = optionalUuid(correlationId, 'ID de correlación');
      const to = new Date();
      const from = new Date(to);
      if (range === 'today') from.setHours(0, 0, 0, 0);
      if (range === '24h') from.setTime(to.getTime() - 24 * 60 * 60 * 1000);
      if (range === '7d') from.setTime(to.getTime() - 7 * 24 * 60 * 60 * 1000);

      const localDate = (value: Date) => {
        const offset = value.getTimezoneOffset() * 60 * 1000;
        return new Date(value.getTime() - offset).toISOString().slice(0, 10);
      };

      setFromDate(localDate(from));
      setToDate(localDate(to));
      setFilterError(null);
      setSelected(null);
      setFilters({
        page: 0,
        size: 20,
        actorId: nextActorId,
        aggregateType: aggregateType.trim() || undefined,
        aggregateId: nextAggregateId,
        correlationId: nextCorrelationId,
        from: from.toISOString(),
        to: to.toISOString(),
      });
    } catch (cause) {
      setFilterError(cause instanceof Error ? cause.message : 'Los filtros no son válidos.');
    }
  };

  const clearFilters = () => {
    setAggregateType('');
    setActorId('');
    setAggregateId('');
    setCorrelationId('');
    setFromDate('');
    setToDate('');
    setFilterError(null);
    setSelected(null);
    setFilters({
      page: 0,
      size: 20,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const detail = selected ? auditLog.find(e => e.id === selected) : null;
  const knownDetails = detail?.details
    ? Object.entries(detail.details).filter(([key]) => key in DETAIL_LABELS)
    : [];

  const resultBadge = (result: string) => {
    const normalized = result.toLowerCase();
    if (normalized === 'success') return <Badge variant="success" dot>Exitoso</Badge>;
    if (normalized === 'warning') return <Badge variant="warning" dot>Advertencia</Badge>;
    if (normalized === 'error' || normalized === 'failure') return <Badge variant="error" dot>Error</Badge>;
    return <Badge variant="muted" dot>{result}</Badge>;
  };

  const actionColor: Record<string, string> = {
    LOGIN: 'text-[#3B7597] bg-[#6FD1D7]/20',
    CREATE: 'text-emerald-600 bg-emerald-50',
    EDIT: 'text-blue-600 bg-blue-50',
    DELETE: 'text-red-600 bg-red-50',
    AUTHORIZE: 'text-[#5DF8D8]/80 bg-[#5DF8D8]/10 text-emerald-700',
    REJECT: 'text-amber-600 bg-amber-50',
    VIEW: 'text-gray-500 bg-gray-50',
    MOVEMENT_CONFIRMED: 'text-emerald-800 bg-emerald-100 font-semibold',
  };

  const getActorDisplay = (eventActorId?: string | null, userId?: string | null) => {
    const id = eventActorId || userId;
    if (!id) return { short: '—', full: '—' };
    return { short: shortId(id), full: id };
  };

  const apiStatus = error instanceof ApiError ? error.status : null;
  const errorMessage = error instanceof Error ? error.message : 'No fue posible conectar con el servicio de auditoría.';

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Auditoría"
        description={`${totalElements} eventos registrados`}
        breadcrumbs={getBreadcrumbs('audit', navigate)}
      />

      {/* Canonical OpenAPI filters, organized for operational use. */}
      <div className="space-y-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1 text-xs text-gray-500">
            <span>Actor</span>
            <select
              value={actorOptions.includes(actorId) ? actorId : ''}
              onChange={event => setActorId(event.target.value)}
              className="siga-select h-9 w-full text-xs"
            >
              <option value="">Todos los actores visibles</option>
              {actorOptions.map(value => (
                <option key={value} value={value}>Actor {shortId(value)}</option>
              ))}
            </select>
            {actorId && !actorOptions.includes(actorId) && (
              <span className="block font-mono text-[10px] text-gray-400">Filtro exacto activo: {shortId(actorId)}</span>
            )}
          </label>

          <label className="space-y-1 text-xs text-gray-500">
            <span>Tipo de recurso</span>
            <select
              value={aggregateType}
              onChange={event => setAggregateType(event.target.value)}
              className="siga-select h-9 w-full text-xs"
            >
              <option value="">Todos los recursos</option>
              {resourceTypeOptions.map(value => (
                <option key={value} value={value}>{resourceLabel(value)}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-xs text-gray-500">
            <span>Fecha desde</span>
            <input
              type="date"
              value={fromDate}
              onChange={event => setFromDate(event.target.value)}
              className="siga-input h-9 w-full px-2 text-xs"
            />
          </label>

          <label className="space-y-1 text-xs text-gray-500">
            <span>Fecha hasta</span>
            <input
              type="date"
              value={toDate}
              onChange={event => setToDate(event.target.value)}
              className="siga-input h-9 w-full px-2 text-xs"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-gray-500">Rangos rápidos:</span>
          <Button variant="outline" size="sm" onClick={() => applyQuickDateFilter('today')}>Hoy</Button>
          <Button variant="outline" size="sm" onClick={() => applyQuickDateFilter('24h')}>Últimas 24 horas</Button>
          <Button variant="outline" size="sm" onClick={() => applyQuickDateFilter('7d')}>Últimos 7 días</Button>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>Limpiar filtros</Button>
            <Button size="sm" onClick={applyFilters}>Buscar</Button>
          </div>
        </div>

        <details className="rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-600">
          <summary className="cursor-pointer select-none px-3 py-2 font-medium">Filtros avanzados</summary>
          <div className="grid grid-cols-1 gap-3 border-t border-gray-200 p-3 md:grid-cols-3">
            <label className="space-y-1">
              <span>Actor ID exacto</span>
              <input
                value={actorId}
                onChange={event => setActorId(event.target.value)}
                placeholder="UUID completo"
                className="siga-input h-9 w-full text-xs"
              />
            </label>
            <label className="space-y-1">
              <span>ID del recurso</span>
              <input
                value={aggregateId}
                onChange={event => setAggregateId(event.target.value)}
                placeholder="UUID completo"
                className="siga-input h-9 w-full text-xs"
              />
            </label>
            <label className="space-y-1">
              <span>ID de correlación</span>
              <input
                value={correlationId}
                onChange={event => setCorrelationId(event.target.value)}
                placeholder="UUID completo"
                className="siga-input h-9 w-full text-xs"
              />
            </label>
            <p className="text-gray-500 md:col-span-3">
              Usa estos filtros cuando tengas el identificador técnico completo.
            </p>
          </div>
        </details>

        {filterError && <div className="text-xs text-red-600">{filterError}</div>}
      </div>

      {/* Content area: Loading, Error, Empty, or Table */}
      <div className="flex-1 overflow-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <RefreshIcon size={24} className="animate-spin text-[#3B7597]" />
            <span className="text-sm text-gray-500">Cargando eventos de auditoría...</span>
          </div>
        )}

        {error != null && !loading && (
          <div className="p-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertIcon size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-red-800 text-sm">
                  {apiStatus === 401
                    ? 'Acceso no autenticado (401)'
                    : apiStatus === 403
                    ? 'Permiso insuficiente (403)'
                    : 'Error al consultar auditoría'}
                </div>
                <div className="text-xs text-red-600 mt-1">
                  {apiStatus === 401
                    ? 'Inicie sesión con credenciales válidas para consultar el registro de auditoría.'
                    : apiStatus === 403
                    ? 'Su usuario no cuenta con el permiso AUDIT_READ para consultar el registro de auditoría.'
                    : errorMessage}
                </div>
                <Button variant="outline" size="sm" onClick={refetch} className="mt-3">
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && auditLog.length === 0 && (
          <EmptyState
            icon={<ActivityIcon size={48} />}
            title="No hay eventos de auditoría"
            description="Ajuste los filtros para ver resultados"
          />
        )}

        {!loading && !error && auditLog.length > 0 && (
          <>
            {/* Table — desktop */}
            <div className="hidden md:block">
              <table className="siga-table">
                <thead>
                  <tr>
                    <th>Fecha y hora</th>
                    <th>Actor</th>
                    <th>Evento</th>
                    <th>Recurso</th>
                    <th className="text-center">Resultado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map(event => {
                    const actor = getActorDisplay(event.actorId, event.userId);
                    return (
                      <tr key={event.id}>
                        <td className="text-xs">
                          <div className="font-medium text-gray-700">{event.date}</div>
                          <div className="text-gray-500">{event.time}</div>
                        </td>
                        <td className="text-xs max-w-[160px] truncate">
                          <div className="font-mono font-medium truncate" title={actor.full}>{actor.short}</div>
                        </td>
                        <td>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              actionColor[event.action] ?? 'text-gray-500 bg-gray-50'
                            }`}
                          >
                            {eventLabel(event.action || event.eventType)}
                          </span>
                        </td>
                        <td className="text-xs">
                          <div className="font-medium text-[#3B7597]">
                            {resourceLabel(event.aggregateType ?? event.module)}
                          </div>
                          <div className="font-mono text-gray-500" title={event.aggregateId ?? undefined}>
                            {shortId(event.aggregateId)}
                          </div>
                        </td>
                        <td className="text-center">{resultBadge(event.result)}</td>
                        <td className="text-center">
                          <TableActionButton
                            icon={<EyeIcon size={14} />}
                            label="Ver detalle"
                            onClick={() => setSelected(event.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden p-4 space-y-3">
              {auditLog.map(event => {
                const actor = getActorDisplay(event.actorId, event.userId);
                return (
                  <button
                    key={event.id}
                    onClick={() => setSelected(event.id)}
                    className="siga-card w-full p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-mono text-xs text-gray-500">
                          {event.date} · {event.time}
                        </div>
                        <div className="font-medium text-sm text-[#093C5D] mt-0.5 truncate">
                          {eventLabel(event.action || event.eventType)}
                        </div>
                        <div className="font-mono text-xs text-gray-500 mt-0.5" title={actor.full}>Actor: {actor.short}</div>
                      </div>
                      {resultBadge(event.result)}
                    </div>
                    <div className="flex items-center gap-2 mt-2 min-w-0">
                      <span className="text-xs text-[#3B7597] font-medium flex-shrink-0">
                        {resourceLabel(event.aggregateType ?? event.module)}
                      </span>
                      <span className="text-xs font-mono text-gray-500 truncate min-w-0">
                        {shortId(event.aggregateId)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 truncate">{eventDescription(event)}</div>
                  </button>
                );
              })}
            </div>

            {/* Pagination footer */}
            <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between gap-4 flex-wrap">
              <div className="text-xs text-gray-500">
                Mostrando {totalElements === 0 ? 0 : currentPage * pageSize + 1}–
                {Math.min((currentPage + 1) * pageSize, totalElements)} de {totalElements} eventos
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  ← Anterior
                </Button>
                <span className="text-xs text-gray-600 font-medium px-2">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Siguiente →
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Detalle del evento de auditoría"
        size="md"
      >
        {detail && (
          <div className="space-y-5 text-sm">
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Resumen</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-400">Evento</div>
                  <div className="font-medium text-[#093C5D]">{eventLabel(detail.action || detail.eventType)}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-400">Fecha y hora</div>
                  <div className="font-medium text-[#093C5D]">{detail.date} · {detail.time}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-400">Actor</div>
                  <div className="font-mono font-medium text-[#093C5D]" title={getActorDisplay(detail.actorId, detail.userId).full}>
                    {getActorDisplay(detail.actorId, detail.userId).short}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-400">Recurso</div>
                  <div className="font-medium text-[#093C5D]">
                    {resourceLabel(detail.aggregateType ?? detail.module)}
                    <span className="ml-2 font-mono text-xs text-gray-500">{shortId(detail.aggregateId)}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 sm:col-span-2">
                  <div className="mb-1 text-xs text-gray-400">Resultado</div>
                  {resultBadge(detail.result)}
                </div>
              </div>
            </section>

            <div className="rounded-lg bg-[#093C5D]/5 p-3">
              <div className="mb-1 text-xs text-gray-400">Descripción</div>
              <div className="text-gray-700">{eventDescription(detail)}</div>
            </div>

            {knownDetails.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Contexto</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {knownDetails.map(([key, value]) => (
                    <div key={key} className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                      <div className="text-xs text-gray-400">{DETAIL_LABELS[key]}</div>
                      <div className="mt-0.5 break-words font-medium text-gray-700" title={typeof value === 'string' ? value : undefined}>
                        {formatDetailValue(key, value)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <details className="rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-600">
              <summary className="cursor-pointer select-none px-3 py-2 font-medium text-gray-600">
                Ver información técnica
              </summary>
              <div className="space-y-3 border-t border-gray-200 p-3">
                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    ['Audit Event ID', detail.id],
                    ['Aggregate ID', detail.aggregateId ?? '—'],
                    ['Correlation ID', detail.correlationId ?? '—'],
                    ['Actor ID', getActorDisplay(detail.actorId, detail.userId).full],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-gray-400">{label}</dt>
                      <dd className="break-all font-mono text-gray-700">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div>
                  <div className="mb-1 text-gray-400">JSON técnico</div>
                  <pre className="max-h-48 overflow-auto rounded border border-gray-200 bg-white p-2 font-mono text-gray-700">
                    {JSON.stringify(detail.details ?? {}, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        )}
      </Modal>
    </div>
  );
}
