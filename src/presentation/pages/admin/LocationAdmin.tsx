import { useEffect, useMemo, useState } from 'react';
import {
  LOCATION_TYPES,
  type LocationActiveFilter,
  type LocationAdmin as LocationAdminModel,
  type LocationType,
} from '../../../domain/entities/LocationAdmin';
import {
  deriveAdminLocationDepth,
  getAdminLocationDescendantIds,
  orderAdminLocations,
} from '../../../domain/rules/locationAdminRules';
import { hasUserPermission } from '../../../domain/rules/permissionRules';
import { useLocationAdmin } from '../../hooks/useLocationAdmin';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { useApp } from '../../state/AppContext';
import {
  Badge,
  Button,
  DetailField,
  DetailHeader,
  DetailSection,
  EditIcon,
  EmptyState,
  EyeIcon,
  Input,
  MapPinIcon,
  Modal,
  PageHeader,
  PlusIcon,
  Select,
  Spinner,
  TableActionButton,
} from '../../components/ui';

const TYPE_LABELS: Record<LocationType, string> = {
  ALMACEN: 'Almacén',
  PATIO: 'Patio',
  ZONA: 'Zona',
  PASILLO: 'Pasillo',
  RACK: 'Rack',
  NIVEL: 'Nivel',
  POSICION: 'Posición',
  TALLER: 'Taller',
  RECEPCION: 'Recepción',
  CUARENTENA: 'Cuarentena',
  DESPACHO: 'Despacho',
};

interface FormState {
  code: string;
  name: string;
  locationType: LocationType;
  parentId: string;
}

const EMPTY_FORM: FormState = { code: '', name: '', locationType: 'ALMACEN', parentId: '' };

function formFrom(location: LocationAdminModel): FormState {
  return {
    code: location.code,
    name: location.name,
    locationType: location.locationType,
    parentId: location.parentId ?? '',
  };
}

export default function LocationAdmin() {
  const { state, navigate, showToast } = useApp();
  const canManage = hasUserPermission(state.currentUser, 'locationAdmin', 'edit');
  const {
    filter, locations, hierarchyLocations, detail, loading, detailLoading, saving, error,
    setFilter, loadLocations, openLocation, createLocation, updateLocation, setLocationActive,
    closeDetail, clearError,
  } = useLocationAdmin();
  const [search, setSearch] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LocationAdminModel | null>(null);
  const [lifecycleTarget, setLifecycleTarget] = useState<LocationAdminModel | null>(null);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (error?.code === 'VERSION_CONFLICT' && detail && editing?.id === detail.id) {
      setEditing(detail);
      setForm(formFrom(detail));
    }
    if (error?.code === 'VERSION_CONFLICT' && detail && lifecycleTarget?.id === detail.id) {
      setLifecycleTarget(detail);
    }
  }, [detail, editing?.id, error?.code, lifecycleTarget?.id]);

  const visibleLocations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es');
    const filtered = query
      ? locations.filter(location => location.code.toLocaleLowerCase('es').includes(query)
        || location.name.toLocaleLowerCase('es').includes(query))
      : locations;
    return orderAdminLocations(filtered);
  }, [locations, search]);

  const namesById = useMemo(
    () => new Map(hierarchyLocations.map(location => [location.id, location.name])),
    [hierarchyLocations],
  );

  const parentCandidates = useMemo(() => {
    const excluded = new Set<string>();
    if (editing) {
      excluded.add(editing.id);
      for (const id of getAdminLocationDescendantIds(editing.id, hierarchyLocations)) excluded.add(id);
    }
    return hierarchyLocations.filter(location => location.active && !excluded.has(location.id));
  }, [editing, hierarchyLocations]);

  function openCreate() {
    clearError();
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setFieldErrors({});
    setFormOpen(true);
  }

  async function openEdit(id: string) {
    clearError();
    const latest = await openLocation(id);
    if (!latest) return;
    setEditing(latest);
    setForm(formFrom(latest));
    setFieldErrors({});
    setFormOpen(true);
  }

  async function showDetail(id: string) {
    clearError();
    setDetailOpen(true);
    await openLocation(id);
  }

  async function requestLifecycle(id: string) {
    clearError();
    const latest = await openLocation(id);
    if (latest) setLifecycleTarget(latest);
  }

  function validateForm(): boolean {
    const next: Record<string, string> = {};
    if (!editing && !form.code.trim()) next.code = 'El código es obligatorio.';
    else if (!editing && form.code.trim().length > 80) next.code = 'Máximo 80 caracteres.';
    if (!form.name.trim()) next.name = 'El nombre es obligatorio.';
    else if (form.name.trim().length > 160) next.name = 'Máximo 160 caracteres.';
    if (!LOCATION_TYPES.includes(form.locationType)) next.locationType = 'Selecciona un tipo canónico.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function saveForm() {
    if (!validateForm()) return;
    const parentId = form.parentId || null;
    const updated = editing
      ? await updateLocation(editing.id, {
        name: form.name.trim(),
        locationType: form.locationType,
        parentId,
        expectedVersion: editing.version,
      })
      : await createLocation({
        code: form.code.trim(),
        name: form.name.trim(),
        locationType: form.locationType,
        parentId,
      });
    if (!updated) return;
    setFormOpen(false);
    setEditing(null);
    showToast('success', editing ? 'Ubicación actualizada correctamente.' : 'Ubicación creada correctamente.');
  }

  async function confirmLifecycle() {
    if (!lifecycleTarget) return;
    const activating = !lifecycleTarget.active;
    const updated = await setLocationActive(lifecycleTarget, activating);
    if (!updated) return;
    setLifecycleTarget(null);
    showToast('success', activating ? 'Ubicación reactivada correctamente.' : 'Ubicación desactivada correctamente.');
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Administración de Ubicaciones"
        description={`${locations.length} ubicaciones · filtro aplicado por Inventory`}
        breadcrumbs={getBreadcrumbs('location-admin', navigate)}
        actions={canManage ? (
          <Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={openCreate}>
            Nueva ubicación
          </Button>
        ) : undefined}
      />

      <div className="border-b border-gray-200 bg-white px-4 md:px-6 py-3">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-3">
          <Input
            label="Filtro local por código o nombre"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Filtra las ubicaciones ya cargadas"
          />
          <Select
            label="Estado"
            value={filter}
            onChange={event => setFilter(event.target.value as LocationActiveFilter)}
          >
            <option value="all">Todas</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </Select>
        </div>
      </div>

      {!canManage && (
        <EmptyState icon={<MapPinIcon size={48} />} title="Acceso restringido" description="Necesitas LOCATION_MANAGE para administrar ubicaciones." />
      )}
      {canManage && loading && <div className="flex flex-1 items-center justify-center gap-2 text-sm text-gray-500"><Spinner /> Cargando ubicaciones…</div>}
      {canManage && !loading && error && !formOpen && !lifecycleTarget && (
        <div className="p-6">
          <EmptyState icon={<MapPinIcon size={48} />} title="No fue posible consultar ubicaciones" description={error.message} />
          <div className="mt-4 flex justify-center"><Button variant="outline" onClick={() => void loadLocations(filter)}>Reintentar</Button></div>
        </div>
      )}
      {canManage && !loading && !error && visibleLocations.length === 0 && (
        <EmptyState icon={<MapPinIcon size={48} />} title="No hay ubicaciones" description={search ? 'El filtro local no encontró coincidencias.' : 'Inventory no devolvió ubicaciones para este estado.'} />
      )}
      {canManage && !loading && !error && visibleLocations.length > 0 && (
        <div className="flex-1 overflow-auto">
          <table className="siga-table">
            <thead><tr><th>Código / ubicación</th><th>Tipo</th><th>Padre</th><th>Estado</th><th>Versión</th><th className="text-center">Acciones</th></tr></thead>
            <tbody>{visibleLocations.map(location => {
              const depth = deriveAdminLocationDepth(location, hierarchyLocations);
              return (
                <tr key={location.id}>
                  <td>
                    <div style={{ paddingLeft: `${Math.min(depth, 12) * 16}px` }}>
                      <div className="font-semibold text-[#093C5D]">{location.name}</div>
                      <div className="font-mono text-xs text-gray-500">{location.code}</div>
                    </div>
                  </td>
                  <td><Badge variant="info">{TYPE_LABELS[location.locationType]}</Badge></td>
                  <td className="text-sm text-gray-600">{location.parentId ? namesById.get(location.parentId) ?? location.parentId : 'Raíz'}</td>
                  <td><Badge variant={location.active ? 'success' : 'muted'}>{location.active ? 'Activa' : 'Inactiva'}</Badge></td>
                  <td className="font-mono text-xs">v{location.version}</td>
                  <td><div className="flex justify-center gap-1">
                    <TableActionButton icon={<EyeIcon size={14} />} label="Ver detalle" onClick={() => void showDetail(location.id)} />
                    {location.active && <TableActionButton icon={<EditIcon size={14} />} label="Editar ubicación" onClick={() => void openEdit(location.id)} />}
                    <Button variant="ghost" size="sm" onClick={() => void requestLifecycle(location.id)}>{location.active ? 'Desactivar' : 'Reactivar'}</Button>
                  </div></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      <Modal open={detailOpen} onClose={() => { setDetailOpen(false); closeDetail(); clearError(); }} title="Detalle de ubicación" size="md">
        {detailLoading && <div className="flex justify-center py-10"><Spinner /></div>}
        {!detailLoading && error && !detail && <p className="text-sm text-red-600">{error.message}</p>}
        {!detailLoading && detail && (
          <div className="space-y-4">
            <DetailHeader eyebrow={detail.id} title={detail.name} badges={<><Badge variant={detail.active ? 'success' : 'muted'}>{detail.active ? 'Activa' : 'Inactiva'}</Badge><Badge variant="info">v{detail.version}</Badge></>} />
            <DetailSection title="Datos canónicos"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailField label="Código inmutable" value={detail.code} />
              <DetailField label="Tipo" value={TYPE_LABELS[detail.locationType]} />
              <DetailField label="Padre" value={detail.parentId ? namesById.get(detail.parentId) ?? detail.parentId : 'Raíz'} />
              <DetailField label="Profundidad derivada" value={deriveAdminLocationDepth(detail, hierarchyLocations)} />
            </div></DetailSection>
          </div>
        )}
      </Modal>

      <Modal
        open={formOpen}
        onClose={() => { if (!saving) { setFormOpen(false); setEditing(null); clearError(); } }}
        title={editing ? 'Editar ubicación' : 'Nueva ubicación'}
        size="md"
        footer={<><Button variant="outline" disabled={saving} onClick={() => { setFormOpen(false); setEditing(null); clearError(); }}>Cancelar</Button><Button variant="primary" loading={saving} onClick={() => void saveForm()}>Guardar</Button></>}
      >
        <div className="space-y-4">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error.message}</div>}
          <Input label="Código" value={form.code} maxLength={80} disabled={Boolean(editing)} error={fieldErrors.code} hint={editing ? 'El código es inmutable.' : undefined} onChange={event => setForm(current => ({ ...current, code: event.target.value }))} />
          <Input label="Nombre" value={form.name} maxLength={160} error={fieldErrors.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} />
          <Select label="Tipo" value={form.locationType} error={fieldErrors.locationType} onChange={event => setForm(current => ({ ...current, locationType: event.target.value as LocationType }))}>
            {LOCATION_TYPES.map(type => <option key={type} value={type}>{TYPE_LABELS[type]}</option>)}
          </Select>
          <Select label="Ubicación padre" value={form.parentId} onChange={event => setForm(current => ({ ...current, parentId: event.target.value }))}>
            <option value="">Sin padre (raíz)</option>
            {parentCandidates.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.code} — {candidate.name}</option>)}
          </Select>
          <p className="text-xs text-gray-500">La lista excluye ubicaciones inactivas, la propia ubicación y sus descendientes. Inventory valida finalmente la jerarquía.</p>
        </div>
      </Modal>

      <Modal
        open={Boolean(lifecycleTarget)}
        onClose={() => { if (!saving) { setLifecycleTarget(null); clearError(); } }}
        title={lifecycleTarget?.active ? 'Desactivar ubicación' : 'Reactivar ubicación'}
        size="sm"
        footer={<><Button variant="outline" disabled={saving} onClick={() => { setLifecycleTarget(null); clearError(); }}>Cancelar</Button><Button variant="primary" loading={saving} onClick={() => void confirmLifecycle()}>Confirmar</Button></>}
      >
        <div className="space-y-3 text-sm text-gray-600">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{error.message}</div>}
          <p>{lifecycleTarget?.active
            ? 'Inventory rechazará la desactivación si existen descendientes activos, stock positivo o conteos físicos abiertos.'
            : 'La reactivación conserva el código y requiere una jerarquía válida con padre activo.'}</p>
          {lifecycleTarget && <p><strong>{lifecycleTarget.code}</strong> — {lifecycleTarget.name} · versión {lifecycleTarget.version}</p>}
        </div>
      </Modal>
    </div>
  );
}
