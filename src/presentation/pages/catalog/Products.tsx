import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useProductAdmin } from '../../hooks/useProductAdmin';
import { useCategories } from '../../hooks/useCategories';
import { useUnits } from '../../hooks/useUnits';
import { ValidationError } from '../../../domain/errors';
import { validateProduct } from '../../../domain/rules/catalogRules';
import { hasUserPermission } from '../../../domain/rules/permissionRules';
import type { CreateProductCommand, Product, ProductListQuery, ProductSort, ProductTechnicalAttributes, ProductType } from '../../../domain/entities/Product';
import { ApiError } from '../../../infrastructure/http/ApiClient';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Button, EmptyState, PackageIcon, PageHeader, PlusIcon, Spinner } from '../../components/ui';
import { EMPTY_PRODUCT_FORM, formFromProduct, type ProductFormData } from './products/constants';
import { ProductFiltersBar } from './products/components/ProductFiltersBar';
import { ProductsTable } from './products/components/ProductsTable';
import { ProductDetailModal } from './products/components/ProductDetailModal';
import { ProductFormModal } from './products/components/ProductFormModal';
import { ProductStatusModal } from './products/components/ProductStatusModal';

const PAGE_SIZE = 20;
const codeOf = (error: unknown) => error instanceof ApiError && typeof error.data?.code === 'string' ? error.data.code : null;
function messageOf(error: unknown): string {
  const code = codeOf(error);
  if (code === 'DATA_CONFLICT') return 'El SKU ya pertenece a otro producto.';
  if (code === 'VERSION_CONFLICT') return 'El producto fue actualizado por otro usuario.';
  if (code === 'CATEGORY_INACTIVE') return 'La categoría propuesta está inactiva.';
  if (code === 'UNIT_OF_MEASURE_INACTIVE') return 'Una unidad de medida propuesta está inactiva.';
  if (code === 'PRODUCT_NOT_FOUND') return 'El producto ya no está disponible.';
  if (error instanceof ApiError && error.status === 403) return 'No tienes el permiso PRODUCT_WRITE.';
  return getErrorMessage(error);
}

function commandFrom(form: ProductFormData): CreateProductCommand {
  let technicalAttributes: ProductTechnicalAttributes;
  try {
    const parsed: unknown = JSON.parse(form.technicalAttributesText || '{}');
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error();
    technicalAttributes = parsed as ProductTechnicalAttributes;
  } catch {
    throw new ValidationError('Atributos técnicos inválidos.', { technicalAttributes: 'Ingrese un objeto JSON válido.' });
  }
  return {
    sku: form.sku, name: form.name, categoryId: form.categoryId, productType: form.productType,
    storageUnitId: form.storageUnitId, baseUnitId: form.baseUnitId, minStock: Number(form.minStock),
    requiresLot: form.requiresLot, requiresHeatNumber: form.requiresHeatNumber,
    requiresExpiry: form.requiresExpiry, requiresSerial: form.requiresSerial,
    technicalAttributes, conversions: form.conversions.map(conversion => ({ ...conversion })),
  };
}

export default function Products() {
  const { state, navigate, showToast } = useApp();
  const { currentUser } = state;
  const { products, productPage, loading, error, loadProducts, getProduct, createProduct, updateProduct, setProductStatus } = useProductAdmin();
  const { categories } = useCategories();
  const { units } = useUnits();
  const canRead = hasUserPermission(currentUser, 'products', 'view');
  const canManage = hasUserPermission(currentUser, 'products', 'edit');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [productType, setProductType] = useState<'' | ProductType>('');
  const [categoryId, setCategoryId] = useState('');
  const [active, setActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [sort, setSort] = useState<ProductSort>('sku,asc');
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState<Product | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>({ ...EMPTY_PRODUCT_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const query = useMemo<ProductListQuery>(() => ({
    page, size: PAGE_SIZE, sort, ...(q ? { q } : {}), ...(categoryId ? { categoryId } : {}),
    ...(productType ? { productType } : {}), ...(active === 'all' ? {} : { active: active === 'active' }),
  }), [active, categoryId, page, productType, q, sort]);

  useEffect(() => { const timer = window.setTimeout(() => { setPage(0); setQ(search.trim()); }, 300); return () => window.clearTimeout(timer); }, [search]);
  useEffect(() => { if (canRead) void loadProducts(query).catch(() => undefined); }, [canRead, loadProducts, query]);
  const totalPages = Math.max(1, Math.ceil(productPage.totalElements / productPage.size));

  const loadLatest = async (id: string) => {
    const latest = await getProduct(id);
    setEditing(latest); setForm(formFromProduct(latest)); setErrors({});
    return latest;
  };
  const openNew = () => { setEditing(null); setForm({ ...EMPTY_PRODUCT_FORM, conversions: [] }); setErrors({}); setFormOpen(true); };
  const openDetail = async (id: string) => { try { setDetail(await getProduct(id)); } catch (cause) { showToast('error', messageOf(cause)); } };
  const openEdit = async (id: string) => { try { setDetail(null); await loadLatest(id); setFormOpen(true); } catch (cause) { showToast('error', messageOf(cause)); } };
  const openStatus = async (id: string) => { try { setDetail(null); setStatusTarget(await getProduct(id)); } catch (cause) { showToast('error', messageOf(cause)); } };

  async function save() {
    let command: CreateProductCommand;
    try { command = commandFrom(form); const fieldErrors = validateProduct(command); if (Object.keys(fieldErrors).length) throw new ValidationError('Datos inválidos.', fieldErrors); }
    catch (cause) { if (cause instanceof ValidationError) setErrors(cause.fields); else showToast('error', getErrorMessage(cause)); return; }
    setSaving(true);
    try {
      if (editing) await updateProduct(editing, command); else await createProduct(command);
      await loadProducts(query); setEditing(null); setFormOpen(false);
      showToast('success', editing ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
    } catch (cause) {
      if (cause instanceof ValidationError) setErrors(cause.fields);
      else if (editing && codeOf(cause) === 'VERSION_CONFLICT') {
        try { await loadLatest(editing.id); await loadProducts(query); showToast('warning', 'El producto fue actualizado por otro usuario. Se cargaron los valores más recientes; revisa antes de reintentar.'); }
        catch (reloadError) { showToast('error', messageOf(reloadError)); }
      } else showToast('error', messageOf(cause));
    } finally { setSaving(false); }
  }

  async function toggleStatus() {
    if (!statusTarget) return;
    setSaving(true);
    try {
      const activating = !statusTarget.active;
      await setProductStatus(statusTarget, activating); await loadProducts(query); setStatusTarget(null);
      showToast('success', activating ? 'Producto reactivado correctamente.' : 'Producto desactivado correctamente.');
    } catch (cause) {
      if (codeOf(cause) === 'VERSION_CONFLICT') {
        try { setStatusTarget(await getProduct(statusTarget.id)); await loadProducts(query); showToast('warning', 'El producto cambió. Se recargó la versión más reciente; confirma nuevamente si corresponde.'); }
        catch (reloadError) { setStatusTarget(null); showToast('error', messageOf(reloadError)); }
      } else showToast('error', messageOf(cause));
    } finally { setSaving(false); }
  }

  return <div className="flex h-full flex-col">
    <PageHeader title="Catálogo de Productos" description={`${productPage.totalElements} productos · filtros y orden aplicados por Catalog`} breadcrumbs={getBreadcrumbs('products', navigate)}
      actions={canManage ? <Button size="sm" icon={<PlusIcon size={14} />} onClick={openNew}>Nuevo producto</Button> : undefined} />
    <ProductFiltersBar search={search} onSearchChange={setSearch} productType={productType} onProductTypeChange={value => { setPage(0); setProductType(value); }} categoryId={categoryId} onCategoryChange={value => { setPage(0); setCategoryId(value); }} active={active} onActiveChange={value => { setPage(0); setActive(value); }} sort={sort} onSortChange={value => { setPage(0); setSort(value); }} categories={categories} />
    {!canRead && <EmptyState icon={<PackageIcon size={48} />} title="Acceso restringido" description="Necesitas CATALOG_READ o PRODUCT_WRITE para consultar productos." />}
    {canRead && loading && <div className="flex flex-1 items-center justify-center gap-2 text-sm text-gray-500"><Spinner /> Cargando productos…</div>}
    {canRead && !loading && Boolean(error) && <div className="p-6"><EmptyState icon={<PackageIcon size={48} />} title="No fue posible consultar productos" description={messageOf(error)} /><div className="mt-4 flex justify-center"><Button variant="outline" onClick={() => void loadProducts(query).catch(() => undefined)}>Reintentar</Button></div></div>}
    {canRead && !loading && !error && <ProductsTable products={products} categories={categories} units={units} canEdit={canManage} onView={id => void openDetail(id)} onEdit={id => void openEdit(id)} onToggleStatus={id => void openStatus(id)} />}
    {canRead && !loading && !error && productPage.totalElements > 0 && <div className="flex items-center justify-between border-t bg-white px-6 py-3 text-sm"><span>Página {productPage.page + 1} de {totalPages}</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(value => value - 1)}>Anterior</Button><Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage(value => value + 1)}>Siguiente</Button></div></div>}
    <ProductDetailModal product={detail} open={!!detail} category={detail ? categories.find(item => item.id === detail.categoryId) ?? null : null} units={units} canEdit={canManage} onClose={() => setDetail(null)} onEdit={id => void openEdit(id)} onToggleStatus={id => void openStatus(id)} />
    <ProductFormModal open={formOpen} editMode={!!editing} form={form} categories={categories} units={units} errors={errors} loading={saving} onClose={() => { setFormOpen(false); setEditing(null); }} onFieldChange={patch => { setForm(previous => ({ ...previous, ...patch })); setErrors({}); }} onSave={() => void save()} />
    <ProductStatusModal target={statusTarget} loading={saving} onClose={() => setStatusTarget(null)} onConfirm={() => void toggleStatus()} />
  </div>;
}
