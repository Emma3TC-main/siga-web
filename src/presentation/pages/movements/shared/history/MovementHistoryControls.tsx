import type { MovementHistoryFilters, MovementHistoryStatus, MovementHistoryType } from '../../../../../domain/repositories/MovementRepository';
import { Button, Input, Select, Spinner } from '../../../../components/ui';
import { useLocations } from '../../../../hooks/useLocations';
import { useProducts } from '../../../../hooks/useProducts';

const STATUS_LABELS: Record<MovementHistoryStatus, string> = {
  DRAFT: 'Borrador', PENDING_AUTHORIZATION: 'Pendiente de autorización', AUTHORIZED: 'Autorizado',
  CONFIRMED: 'Confirmado', REJECTED: 'Rechazado', CANCELLED: 'Cancelado',
};

const TYPE_LABELS: Record<MovementHistoryType, string> = {
  ENTRY: 'Entrada', EXIT: 'Salida', TRANSFER: 'Transferencia',
  ADJUST_POSITIVE: 'Ajuste positivo', ADJUST_NEGATIVE: 'Ajuste negativo',
};

function localDateTimeToInstant(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function instantToLocalDateTime(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function MovementHistoryControls({
  filters, fixedType, allowedTypes, loading, onChange, onClear,
}: {
  filters: MovementHistoryFilters;
  fixedType?: MovementHistoryType;
  allowedTypes?: MovementHistoryType[];
  loading: boolean;
  onChange: (patch: Partial<MovementHistoryFilters>) => void;
  onClear: () => void;
}) {
  const { products } = useProducts();
  const { locations } = useLocations();

  return (
    <div className="mx-4 sm:mx-6 mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input label="Código de movimiento" value={filters.movementCode ?? ''} onChange={event => onChange({ movementCode: event.target.value || undefined })} />
        {!fixedType && (
          <Select label="Tipo" value={filters.movementType ?? ''} onChange={event => onChange({ movementType: (event.target.value || undefined) as MovementHistoryType | undefined })}>
            {!allowedTypes && <option value="">Todos</option>}
            {Object.entries(TYPE_LABELS).filter(([value]) => !allowedTypes || allowedTypes.includes(value as MovementHistoryType)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        )}
        <Select label="Estado" value={filters.status ?? ''} onChange={event => onChange({ status: (event.target.value || undefined) as MovementHistoryStatus | undefined })}>
          <option value="">Todos</option>{Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Select label="Producto" value={filters.productId ?? ''} onChange={event => onChange({ productId: event.target.value || undefined, lotId: undefined, assetId: undefined })}>
          <option value="">Todos</option>{products.map(product => <option key={product.id} value={product.id}>{product.sku} — {product.name}</option>)}
        </Select>
        <Select label="Ubicación (origen o destino)" value={filters.locationId ?? ''} onChange={event => onChange({ locationId: event.target.value || undefined })}>
          <option value="">Todas</option>{locations.map(location => <option key={location.id} value={location.id}>{location.code} — {location.name}</option>)}
        </Select>
        <Input label="Lote (UUID exacto)" value={filters.lotId ?? ''} onChange={event => onChange({ lotId: event.target.value || undefined })} />
        <Input label="Activo/serie (UUID exacto)" value={filters.assetId ?? ''} onChange={event => onChange({ assetId: event.target.value || undefined })} />
        <Input label="Documento de referencia" value={filters.referenceDocNumber ?? ''} onChange={event => onChange({ referenceDocNumber: event.target.value || undefined })} />
        <Select label="Sensible" value={filters.sensitive === undefined ? '' : String(filters.sensitive)} onChange={event => onChange({ sensitive: event.target.value === '' ? undefined : event.target.value === 'true' })}>
          <option value="">Todos</option><option value="true">Sí</option><option value="false">No</option>
        </Select>
        <Input label="Desde (creación)" type="datetime-local" value={instantToLocalDateTime(filters.from)} onChange={event => onChange({ from: localDateTimeToInstant(event.target.value) })} />
        <Input label="Hasta exclusivo (creación)" type="datetime-local" value={instantToLocalDateTime(filters.to)} onChange={event => onChange({ to: localDateTimeToInstant(event.target.value) })} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500">Fechas enviadas como RFC 3339; el límite final es exclusivo.</span>
        <Button variant="outline" size="sm" onClick={onClear}>Limpiar filtros</Button>
      </div>
      {loading && <div className="mt-3 flex items-center gap-2 text-xs text-[#3B7597]"><Spinner size={14} /> Consultando historial…</div>}
    </div>
  );
}

export function MovementHistoryPagination({ page, size, totalElements, loading, onPageChange }: {
  page: number; size: number; totalElements: number; loading: boolean; onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(totalElements / size);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm">
      <span className="text-gray-500">{totalElements} resultado(s) · Página {totalElements === 0 ? 0 : page + 1} de {totalPages}</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={loading || page === 0} onClick={() => onPageChange(page - 1)}>Anterior</Button>
        <Button variant="outline" size="sm" disabled={loading || (page + 1) * size >= totalElements} onClick={() => onPageChange(page + 1)}>Siguiente</Button>
      </div>
    </div>
  );
}
