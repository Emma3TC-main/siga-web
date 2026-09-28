import { Button, CheckIcon, Modal, StepWizard } from '../../../../components/ui';
import { ENTRY_STEPS } from '../constants';
import type { EntryForm } from '../hooks/useEntryForm';
import { EntryHeaderStep } from './EntryHeaderStep';
import { EntryLineItemsStep } from './EntryLineItemsStep';
import { EntryEvidenceStep } from './EntryEvidenceStep';
import { EntrySummaryStep } from './EntrySummaryStep';

export interface EntryFormModalProps {
  form: EntryForm;
}

export function EntryFormModal({ form }: EntryFormModalProps) {
  const {
    showForm, closeForm, step, setStep, loading, networkOnline,
    header, setHeader, lines, addLine, removeLine, updateLine, selectLineProduct, isLineValid,
    isExternalReceipt, toggleExternalReceipt, supplierId, selectSupplier, setSupplierPickerOpen,
    activeSuppliers, evidenceAdded, setEvidenceAdded, totalCost, hasSensitiveLine,
    canContinue, handleSubmit,
  } = form;

  return (
    <Modal open={showForm} onClose={closeForm} title="Registrar entrada multidetalle" size="xl">
      <div className="space-y-5">
        {!networkOnline && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <strong>503 OFFLINE:</strong> solo puede guardar como borrador. El stock no se actualizará hasta restablecer conexión.
          </div>
        )}
        <div className="overflow-x-auto pb-2"><div className="min-w-[560px]"><StepWizard steps={ENTRY_STEPS} current={step} /></div></div>

        <div className="min-h-[330px]">
          {step === 0 && (
            <EntryHeaderStep
              header={header}
              setHeader={setHeader}
              isExternalReceipt={isExternalReceipt}
              onToggleExternalReceipt={toggleExternalReceipt}
              supplierId={supplierId}
              onSelectSupplier={selectSupplier}
              onOpenSupplierPicker={() => setSupplierPickerOpen(true)}
              activeSuppliers={activeSuppliers}
            />
          )}
          {step === 1 && (
            <EntryLineItemsStep
              lines={lines}
              isLineValid={isLineValid}
              onAddLine={addLine}
              onRemoveLine={removeLine}
              onSelectProduct={selectLineProduct}
              onUpdateLine={updateLine}
            />
          )}
          {step === 2 && (
            <EntryEvidenceStep evidenceAdded={evidenceAdded} onAddEvidence={() => setEvidenceAdded(true)} />
          )}
          {step === 3 && (
            <EntrySummaryStep
              header={header}
              lines={lines}
              totalCost={totalCost}
              hasSensitiveLine={hasSensitiveLine}
              isExternalReceipt={isExternalReceipt}
              supplierId={supplierId}
            />
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-3 border-t border-gray-100">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => step === 0 ? closeForm() : setStep(prev => prev - 1)}>
              {step === 0 ? 'Cancelar' : '← Anterior'}
            </Button>
            <Button variant="outline" onClick={() => handleSubmit(true)} disabled={!lines.some(line => line.productId)} loading={loading}>
              Guardar borrador
            </Button>
          </div>
          {step < ENTRY_STEPS.length - 1 ? (
            <Button onClick={() => setStep(prev => prev + 1)} disabled={!canContinue()}>Siguiente →</Button>
          ) : (
            <Button variant="success" icon={<CheckIcon size={14} />} onClick={() => handleSubmit(false)} loading={loading} disabled={!networkOnline}>
              {networkOnline ? (hasSensitiveLine ? 'Enviar a autorización' : 'Confirmar entrada') : 'Sin conexión · guardar borrador'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
