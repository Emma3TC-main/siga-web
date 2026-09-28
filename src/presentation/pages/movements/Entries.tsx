import { useApp } from '../../state/AppContext';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Button, PageHeader, PlusIcon } from '../../components/ui';
import { useEntryForm } from './entries/hooks/useEntryForm';
import { EntriesList } from './entries/components/EntriesList';
import { EntryFormModal } from './entries/components/EntryFormModal';
import { EntryDetailModal } from './entries/components/EntryDetailModal';
import { SupplierPickerModal } from './entries/components/SupplierPickerModal';
import { EntrySuccessModal } from './entries/components/EntrySuccessModal';

export default function Entries() {
  const { navigate } = useApp();
  const form = useEntryForm();
  const {
    entries, selectedMov, setSelectedMov, successMov, setSuccessMov,
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

      <div className="flex-1 overflow-auto">
        <EntriesList entries={entries} onView={setSelectedMov} onNewEntry={openForm} />
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
