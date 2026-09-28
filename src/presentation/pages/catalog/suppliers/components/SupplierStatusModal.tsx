import type { Supplier } from '../../../../../domain/entities/Supplier';
import { Modal, Button } from '../../../../components/ui';

interface SupplierStatusModalProps {
  target: Supplier | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SupplierStatusModal({ target, loading, onClose, onConfirm }: SupplierStatusModalProps) {
  return (
    <Modal
      open={!!target}
      onClose={onClose}
      title={target?.status === 'active' ? '¿Desactivar proveedor?' : '¿Activar proveedor?'}
      size="sm"
    >
      {target && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {target.status === 'active'
              ? `El proveedor "${target.name}" no podrá seleccionarse en nuevas recepciones, pero su información histórica se conservará intacta.`
              : `El proveedor "${target.name}" volverá a estar disponible para nuevas recepciones.`}
          </p>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              variant={target.status === 'active' ? 'outline' : 'primary'}
              onClick={onConfirm}
              loading={loading}
            >
              {target.status === 'active' ? 'Desactivar proveedor' : 'Activar proveedor'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
