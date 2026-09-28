import { UploadIcon } from '../../../../components/ui';

export interface EntryEvidenceStepProps {
  evidenceAdded: boolean;
  onAddEvidence: () => void;
}

export function EntryEvidenceStep({ evidenceAdded, onAddEvidence }: EntryEvidenceStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-[#093C5D]">Evidencia digital</h3>
        <p className="text-xs text-gray-500 mt-1">PDF, JPG, JPEG o PNG · máximo 10 MB.</p>
      </div>
      <button
        className={`w-full border-2 border-dashed rounded-xl p-10 text-center transition-colors ${evidenceAdded ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-[#3B7597]'}`}
        onClick={onAddEvidence}
      >
        <UploadIcon size={34} className={`mx-auto mb-3 ${evidenceAdded ? 'text-emerald-500' : 'text-gray-300'}`} />
        <div className="text-sm font-medium text-gray-600">{evidenceAdded ? 'guia-remision-000145.pdf' : 'Seleccionar evidencia'}</div>
        <div className="text-xs text-gray-400 mt-1">{evidenceAdded ? '1.2 MB · Archivo validado' : 'Haga clic para simular la carga'}</div>
      </button>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
        La entrada puede guardarse sin evidencia; los ajustes negativos sí la exigen.
      </div>
    </div>
  );
}
