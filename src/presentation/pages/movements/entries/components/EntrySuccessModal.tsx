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
    title={
      movement?.status === 'pendiente_autorizacion'
        ? 'Solicitud enviada'
        : 'Entrada registrada'
    }
    size="md"
  >
    {movement && (
      <div className="space-y-5">

        <div
          className={`
            relative overflow-hidden
            rounded-xl
            border
            px-5 py-7
            text-center
            ${
              movement.status === 'confirmado'
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-amber-50/70 border-amber-200'
            }
          `}
        >

          <div
            className={`
              absolute top-0 left-0 right-0 h-1
              ${
                movement.status === 'confirmado'
                  ? 'bg-emerald-500'
                  : 'bg-amber-400'
              }
            `}
          />


          <div
            className={`
              w-14 h-14
              mx-auto mb-4
              rounded-full
              flex items-center justify-center
              ${
                movement.status === 'confirmado'
                  ? 'bg-emerald-100'
                  : 'bg-amber-100'
              }
            `}
          >

            <CheckIcon
              size={26}
              className={
                movement.status === 'confirmado'
                  ? 'text-emerald-500'
                  : 'text-amber-500'
              }
            />

          </div>


          <div className="font-bold text-[#093C5D]">
            {movement.status === 'confirmado'
              ? 'Stock actualizado correctamente'
              : 'Stock protegido hasta autorización y MFA'}
          </div>


          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-white/70 border border-white text-sm text-gray-500">

            <span className="font-mono text-[#3B7597]">
              {movement.id}
            </span>

            <span className="text-gray-300">
              ·
            </span>

            <span>
              {movement.lines?.length ?? 1} ítems
            </span>

          </div>

        </div>


        <Button
          className="w-full"
          onClick={onClose}
        >
          Aceptar
        </Button>

      </div>
    )}
  </Modal>
);
}
