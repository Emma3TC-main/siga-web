import { useApp } from '../../state/AppContext';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Button, PageHeader, PlusIcon } from '../../components/ui';
import { useEntryForm } from './entries/hooks/useEntryForm';
import { EntriesList } from './entries/components/EntriesList';
import { EntryFormModal } from './entries/components/EntryFormModal';
import { EntryDetailModal } from './entries/components/EntryDetailModal';
import { SupplierPickerModal } from './entries/components/SupplierPickerModal';
import { EntrySuccessModal } from './entries/components/EntrySuccessModal';
import { MovementHistoryControls, MovementHistoryPagination } from './shared/history/MovementHistoryControls';

export default function Entries() {
  const { navigate } = useApp();
  const form = useEntryForm();
  const {
    entries, history, openMovementDetail, selectedMov, setSelectedMov, successMov, setSuccessMov,
    supplierPickerOpen, setSupplierPickerOpen, supplierSearch, setSupplierSearch,
    filteredPickerSuppliers, supplierId, selectSupplier, openForm,
  } = form;

  function closeSupplierPicker() {
    setSupplierPickerOpen(false);
    setSupplierSearch('');
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Entradas" description={`${entries.length} movimientos registrados · cabecera + N detalles`}
        breadcrumbs={getBreadcrumbs('entries', navigate)}
        actions={<Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={openForm}>Nueva entrada</Button>}
      />

      <MovementHistoryControls filters={history.filters} fixedType="ENTRY" loading={history.loading} onChange={history.changeFilters} onClear={history.clearFilters} />
      {history.error && <div className="mx-4 sm:mx-6 mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{history.error}</div>}
      <div className="flex-1 overflow-auto mt-4">
        <EntriesList entries={entries} onView={openMovementDetail} onNewEntry={openForm} />
        <MovementHistoryPagination page={history.page} size={history.size} totalElements={history.totalElements} loading={history.loading} onPageChange={history.setPage} />
      </div>

      <EntryFormModal form={form} />

      <EntryDetailModal movement={selectedMov} onClose={() => setSelectedMov(null)} />

      <SupplierPickerModal
        open={supplierPickerOpen}
        onClose={closeSupplierPicker}
        search={supplierSearch}
        onSearchChange={setSupplierSearch}
        suppliers={filteredPickerSuppliers}
        selectedId={supplierId}
        onSelect={selectSupplier}
        onClear={() => selectSupplier('')}
      />

      <EntrySuccessModal movement={successMov} onClose={() => setSuccessMov(null)} />
    </div>
  );
}
