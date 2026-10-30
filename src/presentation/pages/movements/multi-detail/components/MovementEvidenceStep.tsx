import { useState } from 'react';
import { UploadIcon } from '../../../../components/ui';

export interface MovementEvidenceStepProps {
  singular: string;
  evidenceAdded: boolean;
  file: File | null;
  requiresEvidence: boolean;
  onSelectFile: (file: File | null) => void;
}

export function MovementEvidenceStep({ singular, evidenceAdded, file, requiresEvidence, onSelectFile }: MovementEvidenceStepProps) {
  const [error, setError] = useState<string | null>(null);
  const select = (next: File | null) => {
    setError(null);
    if (!next) return onSelectFile(null);
    const accepted = ['application/pdf', 'image/jpeg', 'image/png'];
    const maximum = next.type === 'application/pdf' ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (!accepted.includes(next.type)) return setError('El archivo debe ser PDF, JPG, JPEG o PNG.');
    if (next.size > maximum) return setError(next.type === 'application/pdf' ? 'El PDF no puede superar 20 MB.' : 'La imagen no puede superar 10 MB.');
    onSelectFile(next);
  };
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-[#093C5D]">Evidencia y respaldo</h3>
        <p className="text-xs text-gray-500 mt-1">PDF hasta 20 MB; JPG, JPEG o PNG hasta 10 MB.</p>
      </div>
      <label className={`block w-full border-2 border-dashed rounded-xl p-10 text-center cursor-pointer ${evidenceAdded ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-[#3B7597]'}`}>
        <UploadIcon size={34} className={`mx-auto mb-2 ${evidenceAdded ? 'text-emerald-500' : 'text-gray-300'}`} />
        <div className="font-medium text-sm text-gray-600">{evidenceAdded ? file?.name : 'Seleccionar evidencia'}</div>
        <div className="text-xs text-gray-400 mt-1">{evidenceAdded ? `${Math.ceil((file?.size ?? 0) / 1024)} KB · Archivo seleccionado` : requiresEvidence ? 'Requerida por la interfaz; el enforcement backend sigue pendiente.' : 'Opcional, recomendada para operaciones sensibles'}</div>
        <input className="sr-only" type="file" accept="application/pdf,image/jpeg,image/png" onChange={event => select(event.target.files?.[0] ?? null)} />
      </label>
      {error && <p className="text-xs text-red-700">{error}</p>}
      {requiresEvidence && !evidenceAdded && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">Validación: debe adjuntar evidencia antes de continuar.</div>
      )}
    </div>
  );
}
