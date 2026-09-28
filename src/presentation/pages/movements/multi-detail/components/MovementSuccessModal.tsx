import { Button, CheckIcon, Modal } from '../../../../components/ui';
import type { Movement } from '../../../../../domain/entities/Movement';

export interface MovementSuccessModalProps {
  movement: Movement | null;
  title: string;
  onClose: () => void;
}

export function MovementSuccessModal({ movement, title, onClose }: MovementSuccessModalProps) {
  return (
    <Modal
      open={Boolean(movement)}
      onClose={onClose}
      title={movement?.status === 'confirmado' ? `${title}: confirmación exitosa` : 'Solicitud enviada'}
      size="sm"
    >
      {movement && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border text-center ${movement.status === 'confirmado' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <CheckIcon size={28} className={`mx-auto mb-2 ${movement.status === 'confirmado' ? 'text-emerald-500' : 'text-amber-500'}`} />
            <strong className="text-[#093C5D]">{movement.status === 'confirmado' ? 'Inventario actualizado' : 'Inventario protegido'}</strong>
            <div className="text-xs text-gray-500 mt-1">{movement.id} · {movement.lines?.length ?? 1} ítems</div>
          </div>
          <p className="text-sm text-gray-600">
            {movement.status === 'confirmado' ? 'Todas las líneas se aplicaron correctamente.' : 'No habrá cambios hasta autorización y confirmación MFA.'}
          </p>
          <Button className="w-full" onClick={onClose}>Aceptar</Button>
        </div>
      )}
    </Modal>
  );
}
