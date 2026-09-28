import { Button, Modal } from '../../../../components/ui';
import type { Movement } from '../../../../../domain/entities/Movement';
import { MovementDetailView } from '../../shared/detail/MovementDetailView';

export interface MovementDetailModalProps {
  movement: Movement | null;
  onClose: () => void;
}

export function MovementDetailModal({ movement, onClose }: MovementDetailModalProps) {
  return (
    <Modal open={Boolean(movement)} onClose={onClose} title="Detalle del movimiento" size="full"
      footer={<Button variant="outline" onClick={onClose}>Cerrar</Button>}>
      {movement && <MovementDetailView movement={movement} />}
    </Modal>
  );
}
