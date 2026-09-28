import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useUnits } from '../../hooks/useUnits';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Button, PageHeader, PlusIcon } from '../../components/ui';
import { hasPermission } from '../../../domain/rules/permissionRules';
import { EMPTY_PRODUCT_FORM, type ProductFormData } from './products/constants';
import { ProductFiltersBar } from './products/components/ProductFiltersBar';
import { ProductsTable } from './products/components/ProductsTable';
import { ProductDetailModal } from './products/components/ProductDetailModal';
import { ProductFormModal } from './products/components/ProductFormModal';

export default function Products() {
  const { state, navigate, showToast } = useApp();
  const { stock, currentUser } = state;
  const { products, createProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  const { units } = useUnits();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<ProductFormData>({ ...EMPTY_PRODUCT_FORM });
  const [loading, setLoading] = useState(false);

  const canCreate = hasPermission(currentUser?.role, 'catalogs', 'create');
  const canEdit = hasPermission(currentUser?.role, 'catalogs', 'edit');

  const getStock = (pid: string) => stock.filter(s => s.productId === pid).reduce((sum, s) => sum + s.quantity, 0);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    if (filterType && p.type !== filterType) return false;
    if (filterCat && p.categoryId !== filterCat) return false;
    return true;
  });

  const detail = detailId ? products.find(p => p.id === detailId) ?? null : null;
  const detailUnit = detail ? units.find(u => u.id === detail.unitId) ?? null : null;
  const detailCat = detail ? categories.find(c => c.id === detail.categoryId) ?? null : null;

  function openNew() {
    setForm({ ...EMPTY_PRODUCT_FORM });
    setEditMode(false);
    setDetailId(null);
    setModalOpen(true);
  }

  function openEdit(pid: string) {
    const p = products.find(x => x.id === pid)!;
    setForm({
      name: p.name, sku: p.sku, type: p.type, categoryId: p.categoryId, unitId: p.unitId,
      description: p.description ?? '', minStock: p.minStock, reorderPoint: p.reorderPoint ?? 0,
      avgCost: p.avgCost, sensitiveMovement: p.sensitiveMovement, requiresBatch: p.requiresBatch,
      requiresSerial: p.requiresSerial, requiresExpiry: p.requiresExpiry, requiresColada: p.requiresColada,
    });
    setEditMode(true);
    setDetailId(pid);
    setModalOpen(true);
  }

  function handleFieldChange(patch: Partial<ProductFormData>) {
    setForm(f => ({ ...f, ...patch }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.sku.trim()) return;
    setLoading(true);
    try {
      const data = {
        name: form.name, sku: form.sku, type: form.type, categoryId: form.categoryId, unitId: form.unitId,
        description: form.description, minStock: Number(form.minStock), reorderPoint: Number(form.reorderPoint),
        avgCost: Number(form.avgCost), sensitiveMovement: form.sensitiveMovement,
        requiresBatch: form.requiresBatch, requiresSerial: form.requiresSerial,
        requiresExpiry: form.requiresExpiry, requiresColada: form.requiresColada,
      };
      if (editMode && detailId) {
        await updateProduct(detailId, data);
        showToast('success', 'Producto actualizado.');
      } else {
        await createProduct(data);
        showToast('success', 'Producto creado.');
      }
      setModalOpen(false);
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Catálogo de Productos" description={`${products.length} productos · ${filtered.length} filtrados`}
        breadcrumbs={getBreadcrumbs('products', navigate)}
        actions={canCreate ? <Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={openNew}>Nuevo producto</Button> : undefined}
      />

      <ProductFiltersBar
        search={search}
        onSearchChange={setSearch}
        filterType={filterType}
        onFilterTypeChange={value => { setFilterType(value); setFilterCat(''); }}
        filterCat={filterCat}
        onFilterCatChange={setFilterCat}
        categories={categories}
      />

      <ProductsTable
        products={filtered}
        categories={categories}
        units={units}
        canEdit={canEdit}
        getStock={getStock}
        onView={setDetailId}
        onEdit={openEdit}
      />

      <ProductDetailModal
        product={detail}
        open={Boolean(detailId) && !modalOpen}
        category={detailCat}
        unit={detailUnit}
        stockQuantity={detail ? getStock(detail.id) : 0}
        onClose={() => setDetailId(null)}
      />

      <ProductFormModal
        open={modalOpen}
        editMode={editMode}
        form={form}
        categories={categories}
        units={units}
        loading={loading}
        onClose={() => setModalOpen(false)}
        onFieldChange={handleFieldChange}
        onSave={handleSave}
      />
    </div>
  );
}
