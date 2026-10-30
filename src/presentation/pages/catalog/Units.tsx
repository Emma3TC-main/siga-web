import { useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useUnits } from '../../hooks/useUnits';
import { useProducts } from '../../hooks/useProducts';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Badge, Button, EmptyState, Input, Modal, PageHeader, PlusIcon, SearchIcon, Spinner } from '../../components/ui';
import type { CreateUnitCommand } from '../../../domain/entities/UnitOfMeasure';
import { ValidationError } from '../../../domain/errors';
import { hasUserPermission } from '../../../domain/rules/permissionRules';
import { ApiError } from '../../../infrastructure/http/ApiClient';

const EMPTY_FORM: CreateUnitCommand = { code: '', name: '', symbol: '', dimension: '' };

function createError(error: unknown): string {
  if (error instanceof ApiError && error.data?.code === 'DATA_CONFLICT') return 'Ya existe una unidad con ese código.';
  if (error instanceof ApiError && error.status === 403) return 'No tienes el permiso PRODUCT_WRITE.';
  return getErrorMessage(error);
}

export default function Units() {
  const { state, navigate, showToast } = useApp();
  const { units, loading, error, createUnit } = useUnits();
  const { products } = useProducts();
  const canRead = hasUserPermission(state.currentUser, 'units', 'view');
  const canCreate = hasUserPermission(state.currentUser, 'units', 'create');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateUnitCommand>({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const value = query.trim().toLocaleLowerCase('es');
    if (!value) return units;
    return units.filter(item => `${item.code} ${item.name} ${item.symbol} ${item.dimension}`.toLocaleLowerCase('es').includes(value));
  }, [query, units]);

  function change<K extends keyof CreateUnitCommand>(key: K, value: CreateUnitCommand[K]) {
    setForm(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: '' }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await createUnit(form);
      setForm({ ...EMPTY_FORM });
      setErrors({});
      setOpen(false);
      showToast('success', 'Unidad creada y sincronizada con Catalog.');
    } catch (cause) {
      if (cause instanceof ValidationError) setErrors(cause.fields);
      else showToast('error', createError(cause));
    } finally {
      setSaving(false);
    }
  }

  return <div className="flex flex-col h-full">
    <PageHeader
      title="Unidades de medida"
      description={`${units.length} unidades del catálogo`}
      breadcrumbs={getBreadcrumbs('units', navigate)}
      actions={canCreate ? <Button size="sm" icon={<PlusIcon size={14} />} onClick={() => setOpen(true)}>Nueva unidad</Button> : undefined}
    />
    {!canRead ? (
      <EmptyState icon={<span className="text-4xl">⚖</span>} title="Acceso restringido" description="Necesitas CATALOG_READ o PRODUCT_WRITE para consultar unidades." />
    ) : loading ? (
      <div className="flex flex-1 items-center justify-center gap-2 text-sm text-gray-500"><Spinner /> Cargando unidades…</div>
    ) : error ? (
      <EmptyState icon={<span className="text-4xl">⚖</span>} title="No fue posible consultar unidades" description={error} />
    ) : (
      <div className="p-4 sm:p-6 flex-1 overflow-auto space-y-4">
        <div className="max-w-md"><Input aria-label="Buscar unidades" icon={<SearchIcon size={15} />} placeholder="Buscar código, nombre, símbolo o dimensión…" value={query} onChange={event => setQuery(event.target.value)} /></div>
        {filtered.length === 0 ? <EmptyState icon={<span className="text-4xl">⚖</span>} title={units.length === 0 ? 'No hay unidades registradas' : 'No se encontraron unidades'} description={units.length === 0 ? 'Catalog devolvió una lista vacía.' : 'Prueba con otro término de búsqueda.'} /> : <div className="siga-card overflow-auto">
          <table className="siga-table"><thead><tr><th>Código</th><th>Nombre</th><th>Símbolo</th><th>Dimensión</th><th>Estado</th><th className="text-right">Productos</th></tr></thead>
            <tbody>{filtered.map(item => <tr key={item.id}><td className="font-mono font-semibold text-[#3B7597]">{item.code}</td><td className="font-medium">{item.name}</td><td className="font-mono">{item.symbol}</td><td>{item.dimension}</td><td><Badge variant={item.active ? 'success' : 'muted'}>{item.active ? 'Activa' : 'Inactiva'}</Badge></td><td className="text-right tabular-nums">{products.filter(product => product.unitId === item.id).length}</td></tr>)}</tbody>
          </table>
        </div>}
      </div>
    )}
    <Modal open={open} onClose={() => !saving && setOpen(false)} title="Nueva unidad de medida" size="sm" footer={<><Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancelar</Button><Button onClick={() => void handleSave()} loading={saving}>Guardar</Button></>}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Input label="Código" value={form.code} onChange={event => change('code', event.target.value)} placeholder="PZA" error={errors.code} /><Input label="Símbolo" value={form.symbol} onChange={event => change('symbol', event.target.value)} placeholder="pza" error={errors.symbol} /></div>
        <Input label="Nombre" value={form.name} onChange={event => change('name', event.target.value)} placeholder="Pieza" error={errors.name} />
        <Input label="Dimensión" value={form.dimension} onChange={event => change('dimension', event.target.value)} placeholder="Cantidad" error={errors.dimension} />
      </div>
    </Modal>
  </div>;
}
