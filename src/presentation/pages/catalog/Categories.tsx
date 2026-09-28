import { useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Badge, Button, EmptyState, FolderIcon, Input, Modal, PageHeader, PlusIcon, SearchIcon, Select, Textarea } from '../../components/ui';
import type { ProductType } from '../../../domain/entities/Product';

const TYPE_LABELS: Record<ProductType, string> = {
  material: 'Material',
  insumo: 'Insumo',
  repuesto: 'Repuesto',
  maquinaria: 'Maquinaria',
};

export default function Categories() {
  const { state, navigate, showToast } = useApp();
  const { categories, createCategory } = useCategories();
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'material' as ProductType, description: '' });
  const canEdit = state.currentUser?.role === 'admin';

  const filtered = useMemo(() => categories.filter(item => `${item.name} ${item.description ?? ''}`.toLowerCase().includes(query.toLowerCase())), [categories, query]);

  async function handleSave() {
    if (!form.name.trim()) return;
    try {
      await createCategory({ name: form.name, type: form.type, description: form.description });
      setForm({ name: '', type: 'material', description: '' });
      setOpen(false);
      showToast('success', 'Categoría creada y disponible para el catálogo.');
    } catch (error) {
      showToast('error', getErrorMessage(error));
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Categorías" description={`${categories.length} categorías configuradas`}
        breadcrumbs={getBreadcrumbs('categories', navigate)}
        actions={canEdit ? <Button size="sm" icon={<PlusIcon size={14} />} onClick={() => setOpen(true)}>Nueva categoría</Button> : undefined}
      />
      <div className="p-4 sm:p-6 flex-1 overflow-auto space-y-4">
        <div className="max-w-md"><Input aria-label="Buscar categorías" icon={<SearchIcon size={15} />} placeholder="Buscar por nombre o descripción…" value={query} onChange={event => setQuery(event.target.value)} /></div>
        {filtered.length === 0 ? <EmptyState icon={<FolderIcon size={44} />} title="No se encontraron categorías" description="Pruebe con otro término de búsqueda." /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(item => {
              const productCount = products.filter(product => product.categoryId === item.id).length;
              return <article key={item.id} className="siga-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><div className="font-semibold text-[#093C5D]">{item.name}</div><div className="text-xs text-gray-400 font-mono mt-0.5">{item.id}</div></div>
                  <Badge variant="info">{TYPE_LABELS[item.type]}</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-3 min-h-10">{item.description || 'Sin descripción'}</p>
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500"><strong className="text-[#093C5D]">{productCount}</strong> productos asociados</div>
              </article>;
            })}
          </div>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Nueva categoría" size="sm" footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={handleSave} disabled={!form.name.trim()}>Guardar</Button></>}>
        <div className="space-y-4">
          <Input label="Nombre" value={form.name} onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))} placeholder="Ej. Elementos de seguridad" />
          <Select label="Tipo" value={form.type} onChange={event => setForm(prev => ({ ...prev, type: event.target.value as ProductType }))}>{Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select>
          <Textarea label="Descripción" value={form.description} onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
