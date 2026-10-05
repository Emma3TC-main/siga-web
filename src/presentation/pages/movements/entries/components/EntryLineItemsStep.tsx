import { AlertIcon, Button, PlusIcon } from '../../../../components/ui';
import type { DraftLine } from '../hooks/useEntryForm';
import { EntryLineItemCard } from './EntryLineItemCard';

export interface EntryLineItemsStepProps {
  lines: DraftLine[];
  isLineValid: (line: DraftLine) => boolean;
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
  onSelectProduct: (id: string, productId: string) => void;
  onUpdateLine: (id: string, patch: Partial<DraftLine>) => void;
}

export function EntryLineItemsStep({ lines, isLineValid, onAddLine, onRemoveLine, onSelectProduct, onUpdateLine }: EntryLineItemsStepProps) {
  const allValid = lines.every(isLineValid);

return (
  <div className="space-y-5">

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

      <div>
        <h3 className="font-semibold text-[#093C5D]">
          Detalle de productos
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          Agregue todas las líneas de la entrada antes de confirmar.
        </p>
      </div>


      <Button
        variant="outline"
        size="sm"
        icon={<PlusIcon size={13} />}
        onClick={onAddLine}
      >
        Agregar ítem
      </Button>

    </div>


    <div className="space-y-3">

      {lines.map((line, index) => (

        <EntryLineItemCard
          key={line.id}
          line={line}
          index={index}
          isValid={isLineValid(line)}
          canRemove={lines.length > 1}
          onRemove={() => onRemoveLine(line.id)}
          onSelectProduct={productId =>
            onSelectProduct(line.id, productId)
          }
          onUpdate={patch =>
            onUpdateLine(line.id, patch)
          }
        />

      ))}

    </div>


    {!allValid && (

      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">

        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertIcon
            size={14}
            className="text-amber-600"
          />
        </div>

        <span className="text-xs text-amber-700 leading-relaxed">
          Complete producto, cantidad, unidad, ubicación y la trazabilidad obligatoria de cada ítem.
        </span>

      </div>

    )}

  </div>
);
}
