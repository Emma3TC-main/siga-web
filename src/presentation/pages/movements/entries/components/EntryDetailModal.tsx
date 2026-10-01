import { Button, Modal } from '../../../../components/ui';
import type { Movement } from '../../../../../domain/entities/Movement';
import { MovementDetailView } from '../../shared/detail/MovementDetailView';

export interface EntryDetailModalProps {
  movement: Movement | null;
  onClose: () => void;
}

export function EntryDetailModal({ movement, onClose }: EntryDetailModalProps) {
  return (
  <Modal
    open={Boolean(movement)}
    onClose={onClose}
    title="Detalle del movimiento"
    size="full"
    footer={
      <div className="flex justify-end w-full">
        <Button
          variant="outline"
          onClick={onClose}
          className="min-w-[100px]"
        >
          Cerrar
        </Button>
      </div>
    }
  >
    {movement && (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
        <MovementDetailView movement={movement} />
      </div>
    )}
  </Modal>
);
}
