import { UploadIcon } from '../../../../components/ui';

export interface EntryEvidenceStepProps {
  evidenceAdded: boolean;
  onAddEvidence: () => void;
}

export function EntryEvidenceStep({ evidenceAdded, onAddEvidence }: EntryEvidenceStepProps) {
 return (
  <div className="space-y-5">

    <div>
      <h3 className="font-semibold text-[#093C5D]">
        Evidencia digital
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        PDF, JPG, JPEG o PNG · máximo 10 MB.
      </p>
    </div>


    <button
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
      onClick={onAddEvidence}
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
        {evidenceAdded
          ? 'guia-remision-000145.pdf'
          : 'Seleccionar evidencia'}
      </div>


      <div className="text-xs text-gray-400 mt-1.5">
        {evidenceAdded
          ? '1.2 MB · Archivo validado'
          : 'Haga clic para simular la carga'}
      </div>

    </button>


    <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">

      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />

      <div className="text-xs text-blue-700">
        La entrada puede guardarse sin evidencia; los ajustes negativos sí la exigen.
      </div>

    </div>

  </div>
);
}
