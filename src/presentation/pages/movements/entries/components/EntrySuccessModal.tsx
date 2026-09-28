import { Button, CheckIcon, Modal } from '../../../../components/ui';
import type { Movement } from '../../../../../domain/entities/Movement';

export interface EntrySuccessModalProps {
  movement: Movement | null;
  onClose: () => void;
}

export function EntrySuccessModal({ movement, onClose }: EntrySuccessModalProps) {
  return (
    <Modal
      open={Boolean(movement)}
      onClose={onClose}
      title={movement?.status === 'pendiente_autorizacion' ? 'Solicitud enviada' : 'Entrada registrada'}
      size="md"
    >
      {movement && (
        <div className="space-y-4">
          <div className={`p-5 rounded-xl text-center border ${movement.status === 'confirmado' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <CheckIcon size={32} className={`mx-auto mb-2 ${movement.status === 'confirmado' ? 'text-emerald-500' : 'text-amber-500'}`} />
            <div className="font-bold text-[#093C5D]">{movement.status === 'confirmado' ? 'Stock actualizado correctamente' : 'Stock protegido hasta autorización y MFA'}</div>
            <div className="text-sm text-gray-500 mt-1">{movement.id} · {movement.lines?.length ?? 1} ítems</div>
          </div>
          <Button className="w-full" onClick={onClose}>Aceptar</Button>
        </div>
      )}
    </Modal>
  );
}
