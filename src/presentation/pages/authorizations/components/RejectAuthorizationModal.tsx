import { Button, Input, Modal } from '../../../components/ui';

export interface RejectAuthorizationModalProps {
  open: boolean;
  onClose: () => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  loading: boolean;
}

export function RejectAuthorizationModal({ open, onClose, reason, onReasonChange, onConfirm, loading }: RejectAuthorizationModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Rechazar autorización"
      size="sm"
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading} disabled={!reason.trim()}>Rechazar</Button>
      </>}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-600">Ingrese el motivo del rechazo. El inventario no será modificado.</p>
        <Input label="Motivo del rechazo" value={reason} onChange={e => onReasonChange(e.target.value)} placeholder="Explique el motivo del rechazo..." />
      </div>
    </Modal>
  );
}
