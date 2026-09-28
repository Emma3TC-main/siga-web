import { Button, Input, Modal } from '../../../components/ui';

export interface MfaConfirmModalProps {
  open: boolean;
  onClose: () => void;
  totp: string;
  totpError: string;
  onTotpChange: (value: string) => void;
  onConfirm: () => void;
  loading: boolean;
}

export function MfaConfirmModal({ open, onClose, totp, totpError, onTotpChange, onConfirm, loading }: MfaConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirmación reforzada (MFA)"
      size="sm"
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button variant="success" onClick={onConfirm} loading={loading} disabled={totp.length !== 6}>Confirmar y afectar stock</Button>
      </>}
    >
      <div className="space-y-4">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <strong>Operación sensible.</strong> Se volverá a validar el stock en el servidor. Si la versión cambió, SIGA mostrará un conflicto 409 y no aplicará cambios.
        </div>
        <Input
          label="Código TOTP de 6 dígitos"
          inputMode="numeric"
          maxLength={6}
          value={totp}
          error={totpError}
          onChange={event => onTotpChange(event.target.value.replace(/\D/g, ''))}
          placeholder="••••••"
          hint="Código de demostración: 123456"
        />
        <p className="text-xs text-gray-500">Autorizar y confirmar son acciones separadas. El inventario solo cambia después de esta confirmación.</p>
      </div>
    </Modal>
  );
}
