import type { Product } from '../../../../../domain/entities/Product';
import { Button, Modal } from '../../../../components/ui';

export function ProductStatusModal({ target, loading, onClose, onConfirm }: { target: Product | null; loading: boolean; onClose: () => void; onConfirm: () => void }) {
  return <Modal open={!!target} onClose={onClose} title={target?.active ? '¿Desactivar producto?' : '¿Reactivar producto?'} size="sm">
    {target && <div className="space-y-4"><p className="text-sm text-gray-600">{target.active
      ? `“${target.name}” no estará disponible para movimientos nuevos; el historial se conservará.`
      : `“${target.name}” volverá a estar disponible si sus referencias cumplen las reglas vigentes.`}</p>
      <div className="flex justify-end gap-2 border-t pt-3"><Button variant="outline" onClick={onClose}>Cancelar</Button><Button loading={loading} onClick={onConfirm}>{target.active ? 'Desactivar' : 'Reactivar'}</Button></div>
    </div>}
  </Modal>;
}
