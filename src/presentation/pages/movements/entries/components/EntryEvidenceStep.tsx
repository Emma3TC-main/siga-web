import { useState } from 'react';
import { UploadIcon } from '../../../../components/ui';

export interface EntryEvidenceStepProps {
  evidenceAdded: boolean;
  file: File | null;
  onSelectFile: (file: File | null) => void;
}

export function EntryEvidenceStep({ evidenceAdded, file, onSelectFile }: EntryEvidenceStepProps) {
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
  <div className="space-y-5">

    <div>
      <h3 className="font-semibold text-[#093C5D]">
        Evidencia digital
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        PDF hasta 20 MB; JPG, JPEG o PNG hasta 10 MB.
      </p>
    </div>


    <label
      className={`
        w-full
        border-2 border-dashed
        rounded-xl
        px-6 py-10
        text-center
        transition-all duration-200
        ${
          evidenceAdded
            ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100/60'
            : 'border-gray-200 bg-gray-50/40 hover:border-[#3B7597] hover:bg-[#3B7597]/[0.03]'
        }
      `}
    >

      <div
        className={`
          w-14 h-14
          mx-auto mb-4
          rounded-xl
          flex items-center justify-center
          ${
            evidenceAdded
              ? 'bg-emerald-100'
              : 'bg-white border border-gray-200'
          }
        `}
      >
        <UploadIcon
          size={26}
          className={
            evidenceAdded
              ? 'text-emerald-500'
              : 'text-gray-400'
          }
        />
      </div>


      <div
        className={`
          text-sm font-semibold
          ${
            evidenceAdded
              ? 'text-emerald-700'
              : 'text-[#093C5D]'
          }
        `}
      >
        {evidenceAdded ? file?.name : 'Seleccionar evidencia'}
      </div>


      <div className="text-xs text-gray-400 mt-1.5">
        {evidenceAdded ? `${Math.ceil((file?.size ?? 0) / 1024)} KB · Archivo seleccionado` : 'Haga clic para seleccionar un archivo'}
      </div>

      <input className="sr-only" type="file" accept="application/pdf,image/jpeg,image/png" onChange={event => select(event.target.files?.[0] ?? null)} />
    </label>
    {error && <p className="text-xs text-red-700">{error}</p>}


    <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">

      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />

      <div className="text-xs text-blue-700">
        La entrada puede guardarse sin evidencia; los ajustes negativos sí la exigen.
      </div>

    </div>

  </div>
);
}
