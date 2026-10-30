import { useMemo, useState } from 'react';
import type { AssetAdmin, AssetManualStatus, AssetOperationalStatus, TechnicalSnapshot } from '../../../domain/entities/Asset';
import { ASSET_OPERATIONAL_STATUSES } from '../../../domain/entities/Asset';
import { useAssetAdmin } from '../../hooks/useAssetAdmin';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { useApp } from '../../state/AppContext';
import {
  Badge, Button, DetailField, DetailHeader, DetailSection, EmptyState, EyeIcon, Input, Modal,
  PageHeader, PlusIcon, Select, Spinner, TruckIcon,
} from '../../components/ui';

const STATUS_LABELS: Record<AssetOperationalStatus, string> = {
  OPERATIVO: 'Operativo', EN_MANTENIMIENTO: 'En mantenimiento', EN_TRANSITO: 'En tránsito',
  INOPERATIVO: 'Inoperativo', FUERA_SERVICIO: 'Fuera de servicio',
};
const STATUS_VARIANTS: Record<AssetOperationalStatus, 'success' | 'warning' | 'info' | 'error' | 'muted'> = {
  OPERATIVO: 'success', EN_MANTENIMIENTO: 'warning', EN_TRANSITO: 'info', INOPERATIVO: 'error', FUERA_SERVICIO: 'muted',
};
const EMPTY_FORM = { productId: '', assetCode: '', serialNumber: '', brand: '', model: '', technicalSnapshot: '{}' };

function targets(status: AssetOperationalStatus): AssetManualStatus[] {
  if (status === 'OPERATIVO') return ['EN_MANTENIMIENTO', 'INOPERATIVO'];
  if (status === 'EN_MANTENIMIENTO') return ['OPERATIVO', 'FUERA_SERVICIO'];
  if (status === 'INOPERATIVO') return ['EN_MANTENIMIENTO', 'FUERA_SERVICIO'];
  return [];
}

function parseSnapshot(value: string): TechnicalSnapshot {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error('La ficha técnica debe ser un objeto JSON.');
  return parsed as TechnicalSnapshot;
}

export default function Machinery() {
  const { state, navigate, canAccess } = useApp();
  const admin = useAssetAdmin();
  const canManage = canAccess('traceabilityAdmin', 'edit');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AssetAdmin | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] = useState<{ asset: AssetAdmin; status: AssetManualStatus } | null>(null);
  const productsById = useMemo(() => new Map(state.products.map(product => [product.id, product])), [state.products]);
  const locationsById = useMemo(() => new Map(state.locations.map(location => [location.id, location])), [state.locations]);
  const visibleLots = useMemo(() => Array.from(new Set(admin.assets.map(asset => asset.currentLotId).filter((id): id is string => Boolean(id)))), [admin.assets]);
  const pages = Math.max(1, Math.ceil(admin.totalElements / admin.query.size));

  const setFilter = (key: 'productId' | 'operationalStatus' | 'availability' | 'locationId' | 'lotId', value: string) =>
    admin.setQuery({ ...admin.query, [key]: value || undefined, page: 0 });

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormError(null); admin.clearError(); setFormOpen(true); };
  const openEdit = (asset: AssetAdmin) => {
    setEditing(asset); setForm({ productId: asset.productId, assetCode: asset.assetCode, serialNumber: asset.serialNumber,
      brand: asset.brand ?? '', model: asset.model ?? '', technicalSnapshot: JSON.stringify(asset.technicalSnapshot, null, 2) });
    setFormError(null); admin.clearError(); setFormOpen(true);
  };

  const save = async () => {
    if (!editing && (!form.productId || !form.assetCode.trim() || !form.serialNumber.trim())) {
      setFormError('Producto, código de activo y número de serie son obligatorios.'); return;
    }
    let technicalSnapshot: TechnicalSnapshot;
    try { technicalSnapshot = parseSnapshot(form.technicalSnapshot); }
    catch (cause) { setFormError(cause instanceof Error ? cause.message : 'JSON técnico inválido.'); return; }
    setFormError(null);
    const mutable = { brand: form.brand.trim() || null, model: form.model.trim() || null, technicalSnapshot };
    const result = editing
      ? await admin.update(editing.id, { ...mutable, expectedVersion: editing.version })
      : await admin.register({ ...mutable, productId: form.productId, assetCode: form.assetCode.trim(), serialNumber: form.serialNumber.trim() });
    if (result) { setFormOpen(false); setEditing(null); }
  };

  const applyStatus = async () => {
    if (!statusTarget) return;
    const result = await admin.changeStatus(statusTarget.asset, statusTarget.status);
    if (result) setStatusTarget(null);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Administración de activos" description={`${admin.totalElements} unidades serializadas`}
        breadcrumbs={getBreadcrumbs('machinery', navigate)}
        actions={canManage ? <Button icon={<PlusIcon size={16} />} onClick={openCreate}>Registrar activo</Button> : undefined} />

      <div className="border-b bg-white px-6 py-3 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Select label="Producto" value={admin.query.productId ?? ''} onChange={event => setFilter('productId', event.target.value)}><option value="">Todos</option>{state.products.map(product => <option key={product.id} value={product.id}>{product.sku} — {product.name}</option>)}</Select>
        <Select label="Estado" value={admin.query.operationalStatus ?? ''} onChange={event => setFilter('operationalStatus', event.target.value)}><option value="">Todos</option>{ASSET_OPERATIONAL_STATUSES.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</Select>
        <Select label="Disponibilidad" value={admin.query.availability ?? ''} onChange={event => setFilter('availability', event.target.value)}><option value="">Todas</option><option value="UNASSIGNED">Sin asignar</option><option value="IN_STOCK">En stock</option></Select>
        <Select label="Ubicación actual" value={admin.query.locationId ?? ''} onChange={event => setFilter('locationId', event.target.value)}><option value="">Todas</option>{state.locations.map(location => <option key={location.id} value={location.id}>{location.code} — {location.name}</option>)}</Select>
        <Select label="Lote actual" value={admin.query.lotId ?? ''} onChange={event => setFilter('lotId', event.target.value)}><option value="">Todos</option>{visibleLots.map(id => <option key={id} value={id}>{id}</option>)}</Select>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {admin.error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{admin.error.message}</div>}
        {admin.loading ? <div className="flex justify-center py-16"><Spinner size={28} /></div> : admin.assets.length === 0
          ? <EmptyState icon={<TruckIcon size={48} />} title="No hay activos" description="No existen resultados para los filtros seleccionados." />
          : <div className="overflow-x-auto"><table className="siga-table"><thead><tr><th>Código</th><th>Serie</th><th>Producto</th><th>Marca / Modelo</th><th>Estado</th><th>Disponibilidad</th><th>Ubicación</th><th>Acciones</th></tr></thead>
            <tbody>{admin.assets.map(asset => <tr key={asset.id}><td><div className="font-mono text-[#3B7597]">{asset.assetCode}</div><div className="text-[10px] text-gray-400">v{asset.version}</div></td><td className="font-mono text-xs">{asset.serialNumber}</td>
              <td>{productsById.get(asset.productId)?.name ?? asset.productId}</td><td>{[asset.brand, asset.model].filter(Boolean).join(' / ') || '—'}</td>
              <td><Badge variant={STATUS_VARIANTS[asset.operationalStatus]}>{STATUS_LABELS[asset.operationalStatus]}</Badge></td>
              <td><Badge variant={asset.available ? 'success' : 'muted'}>{asset.available ? 'En stock' : 'Sin asignar'}</Badge></td>
              <td>{asset.currentLocationId ? locationsById.get(asset.currentLocationId)?.name ?? asset.currentLocationId : '—'}</td>
              <td><div className="flex gap-1"><button aria-label="Ver activo" className="p-2 text-[#3B7597]" onClick={() => void admin.open(asset.id)}><EyeIcon size={15} /></button>{canManage && <Button size="sm" variant="outline" onClick={() => openEdit(asset)}>Editar</Button>}</div></td>
            </tr>)}</tbody></table></div>}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500"><span>Página {admin.query.page + 1} de {pages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={admin.query.page === 0} onClick={() => admin.setQuery({ ...admin.query, page: admin.query.page - 1 })}>Anterior</Button><Button size="sm" variant="outline" disabled={admin.query.page + 1 >= pages} onClick={() => admin.setQuery({ ...admin.query, page: admin.query.page + 1 })}>Siguiente</Button></div></div>
      </div>

      <Modal open={Boolean(admin.detail)} onClose={admin.closeDetail} title="Detalle del activo" size="xl">
        {admin.detailLoading && <div className="flex justify-center py-12"><Spinner /></div>}
        {admin.detail && <div className="space-y-5"><DetailHeader eyebrow={admin.detail.id} title={admin.detail.assetCode}
          badges={<><Badge variant={STATUS_VARIANTS[admin.detail.operationalStatus]}>{STATUS_LABELS[admin.detail.operationalStatus]}</Badge><Badge variant="info">v{admin.detail.version}</Badge></>} />
          <DetailSection title="Identidad inmutable"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><DetailField label="Producto" value={productsById.get(admin.detail.productId)?.name ?? admin.detail.productId} /><DetailField label="Número de serie" value={admin.detail.serialNumber} /></div></DetailSection>
          <DetailSection title="Ficha del activo"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><DetailField label="Marca" value={admin.detail.brand ?? '—'} /><DetailField label="Modelo" value={admin.detail.model ?? '—'} /></div><pre className="mt-3 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{JSON.stringify(admin.detail.technicalSnapshot, null, 2)}</pre></DetailSection>
          <DetailSection title="Estado de inventario derivado"><div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><DetailField label="Disponibilidad" value={admin.detail.available ? 'En stock' : 'Sin asignar'} /><DetailField label="Ubicación actual" value={admin.detail.currentLocationId ? locationsById.get(admin.detail.currentLocationId)?.name ?? admin.detail.currentLocationId : '—'} /><DetailField label="Lote actual" value={admin.detail.currentLotId ?? '—'} /></div><p className="mt-2 text-xs text-gray-500">Ubicación, lote y disponibilidad provienen del saldo de inventario y no se editan aquí.</p></DetailSection>
          {canManage && admin.detail.operationalStatus !== 'FUERA_SERVICIO' && <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => openEdit(admin.detail!)}>Editar ficha</Button>{targets(admin.detail.operationalStatus).map(status => <Button key={status} variant="outline" onClick={() => setStatusTarget({ asset: admin.detail!, status })}>{STATUS_LABELS[status]}</Button>)}</div>}
        </div>}
      </Modal>

      <Modal open={formOpen} onClose={() => !admin.saving && setFormOpen(false)} title={editing ? 'Editar ficha del activo' : 'Registrar activo'} size="lg"
        footer={<><Button variant="outline" disabled={admin.saving} onClick={() => setFormOpen(false)}>Cancelar</Button><Button loading={admin.saving} onClick={() => void save()}>Guardar</Button></>}>
        <div className="space-y-4">{(formError || admin.error) && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError ?? admin.error?.message}</div>}
          <Select label="Producto serializado" value={form.productId} disabled={Boolean(editing)} onChange={event => setForm({ ...form, productId: event.target.value })}><option value="">Seleccione</option>{state.products.filter(product => product.requiresSerial).map(product => <option key={product.id} value={product.id}>{product.sku} — {product.name}</option>)}</Select>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Input label="Código de activo" maxLength={80} value={form.assetCode} disabled={Boolean(editing)} onChange={event => setForm({ ...form, assetCode: event.target.value })} /><Input label="Número de serie" maxLength={160} value={form.serialNumber} disabled={Boolean(editing)} onChange={event => setForm({ ...form, serialNumber: event.target.value })} /></div>
          {editing && <p className="text-xs text-gray-500">Producto, código y número de serie son inmutables. El estado se gestiona por separado.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Input label="Marca" maxLength={100} value={form.brand} onChange={event => setForm({ ...form, brand: event.target.value })} /><Input label="Modelo" maxLength={100} value={form.model} onChange={event => setForm({ ...form, model: event.target.value })} /></div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600">Ficha técnica JSON<textarea className="mt-1 min-h-36 w-full rounded-lg border border-gray-200 p-3 font-mono text-xs" value={form.technicalSnapshot} onChange={event => setForm({ ...form, technicalSnapshot: event.target.value })} /></label>
          <p className="text-xs text-gray-500">No incluyas ubicación, cantidad, custodio ni estado operativo: pertenecen a otras autoridades.</p>
        </div>
      </Modal>

      <Modal open={Boolean(statusTarget)} onClose={() => !admin.saving && setStatusTarget(null)} title={statusTarget?.status === 'FUERA_SERVICIO' ? 'Retirar activo de servicio' : 'Cambiar estado del activo'} size="sm"
        footer={<><Button variant="outline" disabled={admin.saving} onClick={() => setStatusTarget(null)}>Cancelar</Button><Button loading={admin.saving} onClick={() => void applyStatus()}>Confirmar</Button></>}>
        <div className="space-y-3 text-sm text-gray-600">{admin.error && <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">{admin.error.message}</div>}
          {statusTarget?.status === 'FUERA_SERVICIO' ? <p>Esta transición es terminal e irreversible. Inventory la rechazará si el activo conserva stock positivo.</p> : <p>Inventory validará finalmente esta transición.</p>}
          <p><strong>{statusTarget?.asset.assetCode}</strong> → {statusTarget && STATUS_LABELS[statusTarget.status]}</p></div>
      </Modal>
    </div>
  );
}
