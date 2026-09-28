import { Button, PlusIcon } from '../../../../components/ui';
import type { MovementType } from '../../../../../domain/entities/Movement';
import type { DraftLine } from '../hooks/useMultiDetailForm';
import { MovementLineItemCard } from './MovementLineItemCard';

export interface MovementLineItemsStepProps {
  lines: DraftLine[];
  requiresStock: boolean;
  effectiveType: MovementType;
  currentAverageCost: (productId: string) => number;
  availableStock: (line: DraftLine) => number;
  lineError: (line: DraftLine) => string;
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
  onUpdateLine: (id: string, patch: Partial<DraftLine>) => void;
}

export function MovementLineItemsStep({
  lines, requiresStock, effectiveType, currentAverageCost, availableStock, lineError, onAddLine, onRemoveLine, onUpdateLine,
}: MovementLineItemsStepProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[#093C5D]">Detalle de productos</h3>
          <p className="text-xs text-gray-500">La disponibilidad se valida de forma acumulada entre todas las líneas.</p>
        </div>
        <Button variant="outline" size="sm" icon={<PlusIcon size={13} />} onClick={onAddLine}>Agregar ítem</Button>
      </div>
      {lines.map((line, index) => (
        <MovementLineItemCard
          key={line.id}
          line={line}
          index={index}
          error={lineError(line)}
          canRemove={lines.length > 1}
          requiresStock={requiresStock}
          effectiveType={effectiveType}
          currentAverageCost={currentAverageCost}
          availableStock={availableStock}
          onRemove={() => onRemoveLine(line.id)}
          onUpdate={patch => onUpdateLine(line.id, patch)}
        />
      ))}
    </div>
  );
}
