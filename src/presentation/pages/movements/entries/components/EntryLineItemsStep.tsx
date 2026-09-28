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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[#093C5D]">Detalle de productos</h3>
          <p className="text-xs text-gray-500">Agregue todas las líneas de la entrada antes de confirmar.</p>
        </div>
        <Button variant="outline" size="sm" icon={<PlusIcon size={13} />} onClick={onAddLine}>Agregar ítem</Button>
      </div>
      {lines.map((line, index) => (
        <EntryLineItemCard
          key={line.id}
          line={line}
          index={index}
          isValid={isLineValid(line)}
          canRemove={lines.length > 1}
          onRemove={() => onRemoveLine(line.id)}
          onSelectProduct={productId => onSelectProduct(line.id, productId)}
          onUpdate={patch => onUpdateLine(line.id, patch)}
        />
      ))}
      {!allValid && (
        <div className="flex gap-2 text-xs text-amber-700">
          <AlertIcon size={14} className="mt-0.5" />
          <span>Complete producto, cantidad, unidad, ubicación y la trazabilidad obligatoria de cada ítem.</span>
        </div>
      )}
    </div>
  );
}
