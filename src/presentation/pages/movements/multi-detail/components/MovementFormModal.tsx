import { Button, CheckIcon, Modal, StepWizard } from '../../../../components/ui';
import { MULTI_DETAIL_STEPS, type MovementMode } from '../constants';
import type { MultiDetailForm } from '../hooks/useMultiDetailForm';
import { MovementHeaderStep } from './MovementHeaderStep';
import { MovementLineItemsStep } from './MovementLineItemsStep';
import { MovementEvidenceStep } from './MovementEvidenceStep';
import { MovementSummaryStep } from './MovementSummaryStep';

export interface MovementFormModalProps {
  mode: MovementMode;
  form: MultiDetailForm;
}

export function MovementFormModal({ mode, form }: MovementFormModalProps) {
  const {
    config, networkOnline, open, closeForm, step, setStep, loading,
    header, setHeader, lines, addLine, removeLine, updateLine,
    availableStock, lineError, currentAverageCost, requiresStock, requiresEvidence, effectiveType,
    evidenceAdded, setEvidenceAdded, totalCost, sensitive,
    canContinue, submit,
  } = form;

  return (
    <Modal open={open} onClose={closeForm} title={`Registrar ${config.singular} multidetalle`} size="xl">
      <div className="space-y-5">
        {!networkOnline && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <strong>503 OFFLINE:</strong> puede guardar el formulario como borrador, pero no confirmar ni enviar a autorización.
          </div>
        )}
        <div className="overflow-x-auto pb-2"><div className="min-w-[560px]"><StepWizard steps={MULTI_DETAIL_STEPS} current={step} /></div></div>

        <div className="min-h-[340px]">
          {step === 0 && <MovementHeaderStep mode={mode} header={header} setHeader={setHeader} />}
          {step === 1 && (
            <MovementLineItemsStep
              lines={lines}
              requiresStock={requiresStock}
              effectiveType={effectiveType}
              currentAverageCost={currentAverageCost}
              availableStock={availableStock}
              lineError={lineError}
              onAddLine={addLine}
              onRemoveLine={removeLine}
              onUpdateLine={updateLine}
            />
          )}
          {step === 2 && (
            <MovementEvidenceStep
              singular={config.singular}
              evidenceAdded={evidenceAdded}
              requiresEvidence={requiresEvidence}
              onAddEvidence={() => setEvidenceAdded(true)}
            />
          )}
          {step === 3 && (
            <MovementSummaryStep
              lines={lines}
              effectiveType={effectiveType}
              totalCost={totalCost}
              sensitive={sensitive}
              currentAverageCost={currentAverageCost}
            />
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-3 border-t border-gray-100">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => step === 0 ? closeForm() : setStep(previous => previous - 1)}>
              {step === 0 ? 'Cancelar' : '← Anterior'}
            </Button>
            <Button variant="outline" disabled={!lines[0]?.productId} onClick={() => submit(true)} loading={loading}>
              Guardar borrador
            </Button>
          </div>
          {step < MULTI_DETAIL_STEPS.length - 1 ? (
            <Button disabled={!canContinue()} onClick={() => setStep(previous => previous + 1)}>Siguiente →</Button>
          ) : (
            <Button variant={sensitive ? 'secondary' : 'success'} icon={<CheckIcon size={14} />} onClick={() => submit(false)} loading={loading} disabled={!networkOnline}>
              {networkOnline ? sensitive ? 'Enviar a autorización' : `Confirmar ${config.singular}` : 'Sin conexión · guardar borrador'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
