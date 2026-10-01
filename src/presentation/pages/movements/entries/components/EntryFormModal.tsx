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
  <Modal
    open={showForm}
    onClose={closeForm}
    title="Registrar entrada multidetalle"
    size="xl"
  >
    <div className="space-y-6">

      {!networkOnline && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />

          <div className="text-sm text-amber-800">
            <strong>503 OFFLINE:</strong> solo puede guardar como borrador. El stock no se actualizará hasta restablecer conexión.
          </div>
        </div>
      )}


      <div className="bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-3 overflow-x-auto">

        <div className="min-w-[560px]">
          <StepWizard
            steps={ENTRY_STEPS}
            current={step}
          />
        </div>

      </div>


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
          <EntryEvidenceStep
            evidenceAdded={evidenceAdded}
            onAddEvidence={() => setEvidenceAdded(true)}
          />
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


      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">

        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            onClick={() =>
              step === 0
                ? closeForm()
                : setStep(prev => prev - 1)
            }
          >
            {step === 0 ? 'Cancelar' : '← Anterior'}
          </Button>


          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={!lines.some(line => line.productId)}
            loading={loading}
          >
            Guardar borrador
          </Button>

        </div>


        <div>

          {step < ENTRY_STEPS.length - 1 ? (

            <Button
              onClick={() =>
                setStep(prev => prev + 1)
              }
              disabled={!canContinue()}
            >
              Siguiente →
            </Button>

          ) : (

            <Button
              variant="success"
              icon={<CheckIcon size={14} />}
              onClick={() => handleSubmit(false)}
              loading={loading}
              disabled={!networkOnline}
            >
              {networkOnline
                ? (
                    hasSensitiveLine
                      ? 'Enviar a autorización'
                      : 'Confirmar entrada'
                  )
                : 'Sin conexión · guardar borrador'}
            </Button>

          )}

        </div>

      </div>

    </div>
  </Modal>
);
}
