import { useState, useMemo } from 'react';
import { useApp } from '../../state/AppContext';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useMovements } from '../../hooks/useMovements';
import { ValidationError } from '../../../domain/errors';
import { suggestSupplierCode, validateSupplierDraft } from '../../../domain/rules/supplierRules';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import type { SupplierDraft } from '../../../domain/entities/Supplier';
import { PageHeader, Button, PlusIcon } from '../../components/ui';
import { hasPermission } from '../../../domain/rules/permissionRules';
import { SupplierFiltersBar } from './suppliers/components/SupplierFiltersBar';
import { SuppliersTable } from './suppliers/components/SuppliersTable';
import { SupplierFormModal } from './suppliers/components/SupplierFormModal';
import { SupplierDetailModal } from './suppliers/components/SupplierDetailModal';
import { SupplierStatusModal } from './suppliers/components/SupplierStatusModal';

const EMPTY_FORM: SupplierDraft = {
  code: '', ruc: '', name: '', commercialName: '', contact: '', phone: '', email: '', address: '',
};

export default function Suppliers() {
  const { state, navigate, showToast } = useApp();
  const { currentUser } = state;
  const { suppliers, createSupplier, updateSupplier, setSupplierStatus } = useSuppliers();
  const { movements } = useMovements();

  const canCreate = hasPermission(currentUser?.role, 'suppliers', 'create');
  const canEdit = hasPermission(currentUser?.role, 'suppliers', 'edit');

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [form, setForm] = useState<SupplierDraft>({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return suppliers.filter(s => {
      const matchesSearch = !q || s.code.toLowerCase().includes(q) || s.ruc.includes(q) ||
        s.name.toLowerCase().includes(q) || (s.commercialName ?? '').toLowerCase().includes(q);
      const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [suppliers, search, filterStatus]);

  const detail = detailId ? suppliers.find(s => s.id === detailId) ?? null : null;
  const deactivateTarget = deactivateId ? suppliers.find(s => s.id === deactivateId) ?? null : null;

  function openNew() {
    setEditId(null);
    setForm({ ...EMPTY_FORM, code: suggestSupplierCode(suppliers) });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(id: string) {
    const s = suppliers.find(sup => sup.id === id)!;
    setEditId(id);
    setForm({ code: s.code, ruc: s.ruc, name: s.name, commercialName: s.commercialName ?? '', contact: s.contact, phone: s.phone, email: s.email, address: s.address });
    setErrors({});
    setModalOpen(true);
  }

  function handleFieldChange(key: keyof SupplierDraft, value: string) {
    setForm(p => ({ ...p, [key]: value }));
    setErrors(p => ({ ...p, [key]: '' }));
  }

  async function handleSave() {
    const errs = validateSupplierDraft(form, suppliers, editId ?? undefined);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (editId) {
        await updateSupplier(editId, form);
        showToast('success', 'Proveedor actualizado correctamente.');
      } else {
        await createSupplier(form);
        showToast('success', 'Proveedor creado correctamente.');
      }
      setModalOpen(false);
    } catch (error) {
      if (error instanceof ValidationError) setErrors(error.fields);
      else showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus() {
    if (!deactivateTarget) return;
    setLoading(true);
    try {
      const isActivating = deactivateTarget.status === 'inactive';
      await setSupplierStatus(deactivateTarget.id, isActivating ? 'active' : 'inactive');
      showToast('success', isActivating ? 'Proveedor activado correctamente.' : 'Proveedor desactivado correctamente.');
      setDeactivateId(null);
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Proveedores"
        description={`${suppliers.length} proveedores registrados · ${suppliers.filter(s => s.status === 'active').length} activos`}
        breadcrumbs={getBreadcrumbs('suppliers', navigate)}
        actions={canCreate ? (
          <Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={openNew}>
            Nuevo proveedor
          </Button>
        ) : undefined}
      />

      <SupplierFiltersBar
        search={search}
        onSearchChange={setSearch}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
      />

      <SuppliersTable
        suppliers={filtered}
        search={search}
        canCreate={canCreate}
        canEdit={canEdit}
        onOpenNew={openNew}
        onView={setDetailId}
        onEdit={openEdit}
        onToggleStatusRequest={setDeactivateId}
      />

      <SupplierFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editId={editId}
        form={form}
        errors={errors}
        loading={loading}
        onFieldChange={handleFieldChange}
        onSave={handleSave}
      />

      <SupplierDetailModal
        detail={detail}
        movements={movements}
        canEdit={canEdit}
        onClose={() => setDetailId(null)}
        onEdit={id => { setDetailId(null); openEdit(id); }}
        onRequestToggleStatus={id => { setDetailId(null); setDeactivateId(id); }}
      />

      <SupplierStatusModal
        target={deactivateTarget}
        loading={loading}
        onClose={() => setDeactivateId(null)}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
}
