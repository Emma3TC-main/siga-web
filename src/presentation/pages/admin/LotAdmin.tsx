import { useMemo, useState } from 'react';
import type { LotAdmin as LotAdminModel, LotManualStatus, LotStatus } from '../../../domain/entities/Lot';
import { LOT_STATUSES } from '../../../domain/entities/Lot';
import { useLotAdmin } from '../../hooks/useLotAdmin';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { useApp } from '../../state/AppContext';
import {
  Badge, Button, DetailField, DetailHeader, DetailSection, EmptyState, EyeIcon, Input, Modal,
  PageHeader, PlusIcon, Select, Spinner, formatNumber,
} from '../../components/ui';

const STATUS_LABELS: Record<LotStatus, string> = {
  ACTIVE: 'Activo', QUARANTINED: 'En cuarentena', EXPIRED: 'Vencido', DEPLETED: 'Agotado', BLOCKED: 'Bloqueado',
};
const STATUS_VARIANTS: Record<LotStatus, 'success' | 'warning' | 'error' | 'muted'> = {
  ACTIVE: 'success', QUARANTINED: 'warning', EXPIRED: 'error', DEPLETED: 'muted', BLOCKED: 'error',
};
const EMPTY_FORM = { productId: '', lotNumber: '', heatNumber: '', manufacturedAt: '', receivedAt: '', expiresAt: '' };

function targets(status: LotStatus): LotManualStatus[] {
  if (status === 'ACTIVE') return ['QUARANTINED', 'BLOCKED'];
  if (status === 'QUARANTINED') return ['ACTIVE', 'BLOCKED'];
  if (status === 'BLOCKED') return ['ACTIVE', 'QUARANTINED'];
  if (status === 'DEPLETED') return ['ACTIVE'];
  return [];
}

export default function LotAdmin() {
  const { state, navigate, canAccess } = useApp();
  const admin = useLotAdmin();
  const canManage = canAccess('traceabilityAdmin', 'edit');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LotAdminModel | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [statusTarget, setStatusTarget] = useState<{ lot: LotAdminModel; status: LotManualStatus } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const productsById = useMemo(() => new Map(state.products.map(product => [product.id, product])), [state.products]);
  const locationsById = useMemo(() => new Map(state.locations.map(location => [location.id, location])), [state.locations]);
  const pages = Math.max(1, Math.ceil(admin.totalElements / admin.query.size));

  const setFilter = (key: 'productId' | 'status' | 'locationId', value: string) => admin.setQuery({
    ...admin.query, [key]: value || undefined, page: 0,
  });

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormError(null); admin.clearError(); setFormOpen(true); };
  const openEdit = (lot: LotAdminModel) => {
    setEditing(lot); setForm({ productId: lot.productId, lotNumber: lot.lotNumber ?? '', heatNumber: lot.heatNumber ?? '',
      manufacturedAt: lot.manufacturedAt ?? '', receivedAt: lot.receivedAt ?? '', expiresAt: lot.expiresAt ?? '' });
    setFormError(null); admin.clearError(); setFormOpen(true);
  };

  const save = async () => {
    if (!editing && !form.productId) { setFormError('Selecciona un producto.'); return; }
    if (form.manufacturedAt && form.expiresAt && form.expiresAt < form.manufacturedAt) {
      setFormError('La fecha de vencimiento no puede ser anterior a la fabricación.'); return;
    }
    setFormError(null);
    const dates = { manufacturedAt: form.manufacturedAt || null, receivedAt: form.receivedAt || null,
      expiresAt: form.expiresAt || null };
    const result = editing
      ? await admin.update(editing.id, { ...dates, expectedVersion: editing.version })
      : await admin.create({ ...dates, productId: form.productId, lotNumber: form.lotNumber.trim() || null,
          heatNumber: form.heatNumber.trim() || null });
    if (result) { setFormOpen(false); setEditing(null); }
  };

  const applyStatus = async () => {
    if (!statusTarget) return;
    const result = await admin.changeStatus(statusTarget.lot, statusTarget.status);
    if (result) setStatusTarget(null);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Administración de lotes" description={`${admin.totalElements} lotes registrados`}
        breadcrumbs={getBreadcrumbs('lots-admin', navigate)}
        actions={canManage ? <Button icon={<PlusIcon size={16} />} onClick={openCreate}>Registrar lote</Button> : undefined} />

      <div className="border-b bg-white px-6 py-3 grid grid-cols-1 gap-3 md:grid-cols-4">
        <Select label="Producto" value={admin.query.productId ?? ''} onChange={event => setFilter('productId', event.target.value)}>
          <option value="">Todos</option>{state.products.map(product => <option key={product.id} value={product.id}>{product.sku} — {product.name}</option>)}
        </Select>
        <Select label="Estado" value={admin.query.status ?? ''} onChange={event => setFilter('status', event.target.value)}>
          <option value="">Todos</option>{LOT_STATUSES.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
        </Select>
        <Select label="Vencimiento" value={admin.query.expired === undefined ? '' : String(admin.query.expired)}
          onChange={event => admin.setQuery({ ...admin.query, expired: event.target.value === '' ? undefined : event.target.value === 'true', page: 0 })}>
          <option value="">Todos</option><option value="false">Vigentes</option><option value="true">Vencidos</option>
        </Select>
        <Select label="Ubicación con existencias" value={admin.query.locationId ?? ''} onChange={event => setFilter('locationId', event.target.value)}>
          <option value="">Todas</option>{state.locations.map(location => <option key={location.id} value={location.id}>{location.code} — {location.name}</option>)}
        </Select>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {admin.error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{admin.error.message}</div>}
        {admin.loading ? <div className="flex justify-center py-16"><Spinner size={28} /></div> : admin.lots.length === 0
          ? <EmptyState icon={<span className="text-4xl">◫</span>} title="No hay lotes" description="No existen resultados para los filtros seleccionados." />
          : <div className="overflow-x-auto"><table className="siga-table"><thead><tr>
              <th>Lote</th><th>Producto</th><th>Colada</th><th>Estado efectivo</th><th>Vencimiento</th><th className="text-right">Cantidad</th><th>Versión</th><th>Acciones</th>
            </tr></thead><tbody>{admin.lots.map(lot => <tr key={lot.id}>
              <td><div className="font-medium text-[#093C5D]">{lot.lotNumber ?? 'Sin número'}</div><div className="font-mono text-[10px] text-gray-400">{lot.id}</div></td>
              <td>{productsById.get(lot.productId)?.name ?? lot.productId}</td>
              <td>{lot.heatNumber ?? '—'}</td>
              <td><Badge variant={STATUS_VARIANTS[lot.expired ? 'EXPIRED' : lot.status]}>{lot.expired ? 'Vencido' : STATUS_LABELS[lot.status]}</Badge></td>
              <td>{lot.expiresAt ?? 'Sin vencimiento'}</td><td className="text-right">{formatNumber(lot.totalQuantity)}</td><td>v{lot.version}</td>
              <td><div className="flex gap-1"><button aria-label="Ver lote" className="p-2 text-[#3B7597]" onClick={() => void admin.open(lot.id)}><EyeIcon size={15} /></button>
                {canManage && <Button size="sm" variant="outline" onClick={() => openEdit(lot)}>Editar</Button>}</div></td>
            </tr>)}</tbody></table></div>}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Página {admin.query.page + 1} de {pages}</span><div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={admin.query.page === 0} onClick={() => admin.setQuery({ ...admin.query, page: admin.query.page - 1 })}>Anterior</Button>
            <Button size="sm" variant="outline" disabled={admin.query.page + 1 >= pages} onClick={() => admin.setQuery({ ...admin.query, page: admin.query.page + 1 })}>Siguiente</Button>
          </div>
        </div>
      </div>

      <Modal open={Boolean(admin.detail)} onClose={admin.closeDetail} title="Detalle del lote" size="xl">
        {admin.detailLoading && <div className="flex justify-center py-12"><Spinner /></div>}
        {admin.detail && <div className="space-y-5"><DetailHeader eyebrow={admin.detail.id} title={admin.detail.lotNumber ?? 'Lote sin número'}
          badges={<><Badge variant={STATUS_VARIANTS[admin.detail.expired ? 'EXPIRED' : admin.detail.status]}>{admin.detail.expired ? 'Vencido' : STATUS_LABELS[admin.detail.status]}</Badge><Badge variant="info">v{admin.detail.version}</Badge></>} />
          <DetailSection title="Identidad inmutable"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailField label="Producto" value={productsById.get(admin.detail.productId)?.name ?? admin.detail.productId} />
            <DetailField label="Número de lote" value={admin.detail.lotNumber ?? 'Sin número'} /><DetailField label="Colada" value={admin.detail.heatNumber ?? '—'} />
          </div></DetailSection>
          <DetailSection title="Fechas"><div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><DetailField label="Fabricación" value={admin.detail.manufacturedAt ?? '—'} /><DetailField label="Recepción" value={admin.detail.receivedAt ?? '—'} /><DetailField label="Vencimiento" value={admin.detail.expiresAt ?? '—'} /></div></DetailSection>
          <DetailSection title="Existencias derivadas"><div className="space-y-2"><DetailField label="Cantidad total" value={formatNumber(admin.detail.totalQuantity)} />
            {admin.detail.locations.map(item => <div key={item.locationId} className="flex justify-between rounded bg-gray-50 p-2 text-sm"><span>{locationsById.get(item.locationId)?.name ?? item.locationId}</span><strong>{formatNumber(item.quantity)}</strong></div>)}
            {admin.detail.locations.length === 0 && <p className="text-sm text-gray-500">Sin existencias por ubicación.</p>}</div></DetailSection>
          {canManage && <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => openEdit(admin.detail!)}>Editar fechas</Button>
            {targets(admin.detail.status).map(status => <Button key={status} variant="outline" onClick={() => setStatusTarget({ lot: admin.detail!, status })}>{STATUS_LABELS[status]}</Button>)}</div>}
        </div>}
      </Modal>

      <Modal open={formOpen} onClose={() => !admin.saving && setFormOpen(false)} title={editing ? 'Editar fechas del lote' : 'Registrar lote'} size="lg"
        footer={<><Button variant="outline" disabled={admin.saving} onClick={() => setFormOpen(false)}>Cancelar</Button><Button loading={admin.saving} onClick={() => void save()}>Guardar</Button></>}>
        <div className="space-y-4">{(formError || admin.error) && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError ?? admin.error?.message}</div>}
          <Select label="Producto" value={form.productId} disabled={Boolean(editing)} onChange={event => setForm({ ...form, productId: event.target.value })}><option value="">Seleccione</option>{state.products.map(product => <option key={product.id} value={product.id}>{product.sku} — {product.name}</option>)}</Select>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Input label="Número de lote (opcional)" value={form.lotNumber} disabled={Boolean(editing)} onChange={event => setForm({ ...form, lotNumber: event.target.value })} /><Input label="Número de colada (opcional)" value={form.heatNumber} disabled={Boolean(editing)} onChange={event => setForm({ ...form, heatNumber: event.target.value })} /></div>
          {editing && <p className="text-xs text-gray-500">Producto, lote y colada son identificadores inmutables.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><Input type="date" label="Fabricación" value={form.manufacturedAt} onChange={event => setForm({ ...form, manufacturedAt: event.target.value })} /><Input type="date" label="Recepción" value={form.receivedAt} onChange={event => setForm({ ...form, receivedAt: event.target.value })} /><Input type="date" label="Vencimiento" value={form.expiresAt} onChange={event => setForm({ ...form, expiresAt: event.target.value })} /></div>
        </div>
      </Modal>

      <Modal open={Boolean(statusTarget)} onClose={() => !admin.saving && setStatusTarget(null)} title="Cambiar estado del lote" size="sm"
        footer={<><Button variant="outline" disabled={admin.saving} onClick={() => setStatusTarget(null)}>Cancelar</Button><Button loading={admin.saving} onClick={() => void applyStatus()}>Confirmar</Button></>}>
        <div className="space-y-3 text-sm text-gray-600">{admin.error && <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">{admin.error.message}</div>}
          <p>Inventory validará finalmente la transición, el vencimiento y las existencias.</p><p><strong>{statusTarget?.lot.lotNumber ?? 'Sin número'}</strong> → {statusTarget && STATUS_LABELS[statusTarget.status]}</p></div>
      </Modal>
    </div>
  );
}
