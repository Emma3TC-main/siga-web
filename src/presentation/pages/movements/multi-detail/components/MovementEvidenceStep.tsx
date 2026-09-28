import { UploadIcon } from '../../../../components/ui';

export interface MovementEvidenceStepProps {
  singular: string;
  evidenceAdded: boolean;
  requiresEvidence: boolean;
  onAddEvidence: () => void;
}

export function MovementEvidenceStep({ singular, evidenceAdded, requiresEvidence, onAddEvidence }: MovementEvidenceStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-[#093C5D]">Evidencia y respaldo</h3>
        <p className="text-xs text-gray-500 mt-1">PDF, JPG, JPEG o PNG · máximo 10 MB.</p>
      </div>
      <button onClick={onAddEvidence} className={`w-full border-2 border-dashed rounded-xl p-10 text-center ${evidenceAdded ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-[#3B7597]'}`}>
        <UploadIcon size={34} className={`mx-auto mb-2 ${evidenceAdded ? 'text-emerald-500' : 'text-gray-300'}`} />
        <div className="font-medium text-sm text-gray-600">{evidenceAdded ? `${singular}-evidencia.pdf` : 'Seleccionar evidencia'}</div>
        <div className="text-xs text-gray-400 mt-1">{evidenceAdded ? 'Archivo validado · 1.2 MB' : requiresEvidence ? 'Obligatoria para ajustes negativos' : 'Opcional, recomendada para operaciones sensibles'}</div>
      </button>
      {requiresEvidence && !evidenceAdded && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">Validación: debe adjuntar evidencia antes de continuar.</div>
      )}
    </div>
  );
}
