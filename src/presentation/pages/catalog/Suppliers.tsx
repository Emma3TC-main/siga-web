import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useSupplierAdmin } from '../../hooks/useSupplierAdmin';
import { useMovements } from '../../hooks/useMovements';
import { ValidationError } from '../../../domain/errors';
import { validateSupplierDraft } from '../../../domain/rules/supplierRules';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import type { Supplier, SupplierDraft, SupplierListQuery, SupplierSort } from '../../../domain/entities/Supplier';
import { PageHeader, Button, EmptyState, PlusIcon, SearchIcon, Spinner } from '../../components/ui';
import { hasUserPermission } from '../../../domain/rules/permissionRules';
import { ApiError } from '../../../infrastructure/http/ApiClient';
import { SupplierFiltersBar } from './suppliers/components/SupplierFiltersBar';
import { SuppliersTable } from './suppliers/components/SuppliersTable';
import { SupplierFormModal } from './suppliers/components/SupplierFormModal';
import { SupplierDetailModal } from './suppliers/components/SupplierDetailModal';
import { SupplierStatusModal } from './suppliers/components/SupplierStatusModal';

const PAGE_SIZE = 20;
const EMPTY_FORM: SupplierDraft = {
  code: '',
  taxId: '',
  businessName: '',
  tradeName: '',
  contactName: '',
  phone: '',
  email: '',
  address: '',
};

function draftFrom(supplier: Supplier): SupplierDraft {
  return {
    code: supplier.code,
    taxId: supplier.taxId,
    businessName: supplier.businessName,
    tradeName: supplier.tradeName ?? '',
    contactName: supplier.contactName ?? '',
    phone: supplier.phone ?? '',
    email: supplier.email ?? '',
    address: supplier.address ?? '',
  };
}

function problemCode(error: unknown): string | null {
  return error instanceof ApiError && typeof error.data?.code === 'string' ? error.data.code : null;
}

function mutationMessage(error: unknown): string {
  const code = problemCode(error);
  if (code === 'DATA_CONFLICT') return 'El código o identificador tributario ya pertenece a otro proveedor.';
  if (code === 'SUPPLIER_NOT_FOUND') return 'El proveedor ya no está disponible.';
  if (error instanceof ApiError && error.status === 403) return 'No tienes el permiso SUPPLIER_MANAGE.';
  return getErrorMessage(error);
}

export default function Suppliers() {
  const { state, navigate, showToast } = useApp();
  const { currentUser } = state;
  const {
    suppliers, supplierPage, loading, error, loadSuppliers, getSupplier,
    createSupplier, updateSupplier, setSupplierStatus,
  } = useSupplierAdmin();
  const { movements } = useMovements();

  const canRead = hasUserPermission(currentUser, 'suppliers', 'view');
  const canManage = hasUserPermission(currentUser, 'suppliers', 'edit');

  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sort, setSort] = useState<SupplierSort>('code,asc');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [detail, setDetail] = useState<Supplier | null>(null);
  const [statusTarget, setStatusTarget] = useState<Supplier | null>(null);
  const [form, setForm] = useState<SupplierDraft>({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const listQuery = useMemo<SupplierListQuery>(() => ({
    page,
    size: PAGE_SIZE,
    sort,
    ...(query ? { q: query } : {}),
    ...(filterStatus === 'all' ? {} : { active: filterStatus === 'active' }),
  }), [filterStatus, page, query, sort]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(0);
      setQuery(search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (canRead) void loadSuppliers(listQuery).catch(() => undefined);
  }, [canRead, listQuery, loadSuppliers]);

  const totalPages = Math.max(1, Math.ceil(supplierPage.totalElements / supplierPage.size));
  const listError = error instanceof ApiError && error.status === 403
    ? 'No tienes permisos para consultar proveedores.'
    : error ? getErrorMessage(error) : null;

  function openNew() {
    setEditingSupplier(null);
    setForm({ ...EMPTY_FORM });
    setErrors({});
    setModalOpen(true);
  }

  async function openDetail(id: string) {
    try {
      setDetail(await getSupplier(id));
    } catch (cause) {
      showToast('error', mutationMessage(cause));
    }
  }

  async function openEdit(id: string) {
    try {
      const latest = await getSupplier(id);
      setEditingSupplier(latest);
      setForm(draftFrom(latest));
      setErrors({});
      setModalOpen(true);
    } catch (cause) {
      showToast('error', mutationMessage(cause));
    }
  }

  async function openStatus(id: string) {
    try {
      setStatusTarget(await getSupplier(id));
    } catch (cause) {
      showToast('error', mutationMessage(cause));
    }
  }

  function handleFieldChange(key: keyof SupplierDraft, value: string) {
    setForm(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: '' }));
  }

  async function reloadConflictSupplier(id: string) {
    const latest = await getSupplier(id);
    setEditingSupplier(latest);
    setForm(draftFrom(latest));
    setErrors({});
    await loadSuppliers(listQuery);
    return latest;
  }

  async function handleSave() {
    const fieldErrors = validateSupplierDraft(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setSaving(true);
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier, form);
        showToast('success', 'Proveedor actualizado correctamente.');
      } else {
        await createSupplier(form);
        showToast('success', 'Proveedor creado correctamente.');
      }
      await loadSuppliers(listQuery);
      setModalOpen(false);
      setEditingSupplier(null);
    } catch (cause) {
      if (cause instanceof ValidationError) {
        setErrors(cause.fields);
      } else if (editingSupplier && problemCode(cause) === 'VERSION_CONFLICT') {
        try {
          await reloadConflictSupplier(editingSupplier.id);
          showToast('warning', 'El proveedor fue actualizado por otro usuario. Se cargaron los valores más recientes; revisa antes de reintentar.');
        } catch (reloadError) {
          showToast('error', mutationMessage(reloadError));
        }
      } else {
        showToast('error', mutationMessage(cause));
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus() {
    if (!statusTarget) return;
    setSaving(true);
    try {
      const activating = !statusTarget.active;
      await setSupplierStatus(statusTarget, activating);
      await loadSuppliers(listQuery);
      showToast('success', activating ? 'Proveedor activado correctamente.' : 'Proveedor desactivado correctamente.');
      setStatusTarget(null);
    } catch (cause) {
      if (problemCode(cause) === 'VERSION_CONFLICT') {
        try {
          const latest = await getSupplier(statusTarget.id);
          setStatusTarget(latest);
          await loadSuppliers(listQuery);
          showToast('warning', 'El proveedor fue actualizado por otro usuario. Se recargó su estado; confirma nuevamente si corresponde.');
        } catch (reloadError) {
          setStatusTarget(null);
          showToast('error', mutationMessage(reloadError));
        }
      } else {
        showToast('error', mutationMessage(cause));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Proveedores"
        description={`${supplierPage.totalElements} proveedores · orden y filtros aplicados por Catalog`}
        breadcrumbs={getBreadcrumbs('suppliers', navigate)}
        actions={canManage ? (
          <Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={openNew}>
            Nuevo proveedor
          </Button>
        ) : undefined}
      />

      <SupplierFiltersBar
        search={search}
        onSearchChange={setSearch}
        filterStatus={filterStatus}
        onFilterStatusChange={value => { setPage(0); setFilterStatus(value); }}
        sort={sort}
        onSortChange={value => { setPage(0); setSort(value); }}
      />

      {!canRead && (
        <EmptyState icon={<SearchIcon size={48} />} title="Acceso restringido" description="Necesitas CATALOG_READ o SUPPLIER_MANAGE para consultar proveedores." />
      )}
      {canRead && loading && (
        <div className="flex flex-1 items-center justify-center gap-2 text-sm text-gray-500"><Spinner /> Cargando proveedores…</div>
      )}
      {canRead && !loading && listError && (
        <div className="p-6">
          <EmptyState icon={<SearchIcon size={48} />} title="No fue posible consultar proveedores" description={listError} />
          <div className="mt-4 flex justify-center"><Button variant="outline" onClick={() => void loadSuppliers(listQuery).catch(() => undefined)}>Reintentar</Button></div>
        </div>
      )}
      {canRead && !loading && !listError && (
        <SuppliersTable
          suppliers={suppliers}
          search={query}
          canCreate={canManage}
          canEdit={canManage}
          onOpenNew={openNew}
          onView={id => void openDetail(id)}
          onEdit={id => void openEdit(id)}
          onToggleStatusRequest={id => void openStatus(id)}
        />
      )}

      {canRead && !loading && !listError && supplierPage.totalElements > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3 text-sm">
          <span className="text-gray-500">Página {supplierPage.page + 1} de {totalPages} · {supplierPage.totalElements} proveedores</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={supplierPage.page === 0} onClick={() => setPage(value => value - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={supplierPage.page + 1 >= totalPages} onClick={() => setPage(value => value + 1)}>Siguiente</Button>
          </div>
        </div>
      )}

      <SupplierFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingSupplier(null); }}
        editId={editingSupplier?.id ?? null}
        form={form}
        errors={errors}
        loading={saving}
        onFieldChange={handleFieldChange}
        onSave={() => void handleSave()}
      />

      <SupplierDetailModal
        detail={detail}
        movements={movements}
        canEdit={canManage}
        onClose={() => setDetail(null)}
        onEdit={id => { setDetail(null); void openEdit(id); }}
        onRequestToggleStatus={id => { setDetail(null); void openStatus(id); }}
      />

      <SupplierStatusModal
        target={statusTarget}
        loading={saving}
        onClose={() => setStatusTarget(null)}
        onConfirm={() => void handleToggleStatus()}
      />
    </div>
  );
}
