import { useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Badge, Button, EmptyState, FolderIcon, Input, Modal, PageHeader, PlusIcon, SearchIcon, Select, Spinner } from '../../components/ui';
import type { CategoryType, CreateCategoryCommand } from '../../../domain/entities/Category';
import { ValidationError } from '../../../domain/errors';
import { hasUserPermission } from '../../../domain/rules/permissionRules';
import { ApiError } from '../../../infrastructure/http/ApiClient';

const TYPE_LABELS: Record<CategoryType, string> = {
  MATERIAL: 'Material',
  INSUMO: 'Insumo',
  REPUESTO: 'Repuesto',
  MAQUINARIA: 'Maquinaria',
};

const EMPTY_FORM: CreateCategoryCommand = { code: '', name: '', categoryType: 'MATERIAL' };

function createError(error: unknown): string {
  if (error instanceof ApiError && error.data?.code === 'DATA_CONFLICT') return 'Ya existe una categoría con ese código.';
  if (error instanceof ApiError && error.status === 403) return 'No tienes el permiso PRODUCT_WRITE.';
  return getErrorMessage(error);
}

export default function Categories() {
  const { state, navigate, showToast } = useApp();
  const { categories, loading, error, createCategory } = useCategories();
  const { products } = useProducts();
  const canRead = hasUserPermission(state.currentUser, 'categories', 'view');
  const canCreate = hasUserPermission(state.currentUser, 'categories', 'create');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateCategoryCommand>({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const value = query.trim().toLocaleLowerCase('es');
    if (!value) return categories;
    return categories.filter(item => `${item.code} ${item.name} ${TYPE_LABELS[item.categoryType]}`.toLocaleLowerCase('es').includes(value));
  }, [categories, query]);

  function change<K extends keyof CreateCategoryCommand>(key: K, value: CreateCategoryCommand[K]) {
    setForm(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: '' }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await createCategory(form);
      setForm({ ...EMPTY_FORM });
      setErrors({});
      setOpen(false);
      showToast('success', 'Categoría creada y sincronizada con Catalog.');
    } catch (cause) {
      if (cause instanceof ValidationError) setErrors(cause.fields);
      else showToast('error', createError(cause));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Categorías"
        description={`${categories.length} categorías del catálogo`}
        breadcrumbs={getBreadcrumbs('categories', navigate)}
        actions={canCreate ? <Button size="sm" icon={<PlusIcon size={14} />} onClick={() => setOpen(true)}>Nueva categoría</Button> : undefined}
      />
      {!canRead ? (
        <EmptyState icon={<FolderIcon size={44} />} title="Acceso restringido" description="Necesitas CATALOG_READ o PRODUCT_WRITE para consultar categorías." />
      ) : loading ? (
        <div className="flex flex-1 items-center justify-center gap-2 text-sm text-gray-500"><Spinner /> Cargando categorías…</div>
      ) : error ? (
        <EmptyState icon={<FolderIcon size={44} />} title="No fue posible consultar categorías" description={error} />
      ) : (
        <div className="p-4 sm:p-6 flex-1 overflow-auto space-y-4">
          <div className="max-w-md"><Input aria-label="Buscar categorías" icon={<SearchIcon size={15} />} placeholder="Buscar por código, nombre o tipo…" value={query} onChange={event => setQuery(event.target.value)} /></div>
          {filtered.length === 0 ? <EmptyState icon={<FolderIcon size={44} />} title={categories.length === 0 ? 'No hay categorías registradas' : 'No se encontraron categorías'} description={categories.length === 0 ? 'Catalog devolvió una lista vacía.' : 'Prueba con otro término de búsqueda.'} /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(item => {
                const productCount = products.filter(product => product.categoryId === item.id).length;
                return <article key={item.id} className="siga-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div><div className="font-semibold text-[#093C5D]">{item.name}</div><div className="text-xs text-gray-400 font-mono mt-0.5">{item.code}</div></div>
                    <div className="flex flex-wrap justify-end gap-1"><Badge variant="info">{TYPE_LABELS[item.categoryType]}</Badge><Badge variant={item.active ? 'success' : 'muted'}>{item.active ? 'Activa' : 'Inactiva'}</Badge></div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500"><strong className="text-[#093C5D]">{productCount}</strong> productos asociados</div>
                </article>;
              })}
            </div>
          )}
        </div>
      )}
      <Modal open={open} onClose={() => !saving && setOpen(false)} title="Nueva categoría" size="sm" footer={<><Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancelar</Button><Button onClick={() => void handleSave()} loading={saving}>Guardar</Button></>}>
        <div className="space-y-4">
          <Input label="Código" value={form.code} onChange={event => change('code', event.target.value)} placeholder="SEGURIDAD" error={errors.code} />
          <Input label="Nombre" value={form.name} onChange={event => change('name', event.target.value)} placeholder="Elementos de seguridad" error={errors.name} />
          <Select label="Tipo" value={form.categoryType} onChange={event => change('categoryType', event.target.value as CategoryType)}>{Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select>
        </div>
      </Modal>
    </div>
  );
}
