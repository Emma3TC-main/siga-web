import type { SupplierDraft } from '../../../../../domain/entities/Supplier';
import { Modal, Button, Input, CheckIcon } from '../../../../components/ui';

interface SupplierFormModalProps {
  open: boolean;
  onClose: () => void;
  editId: string | null;
  form: SupplierDraft;
  errors: Record<string, string>;
  loading: boolean;
  onFieldChange: (key: keyof SupplierDraft, value: string) => void;
  onSave: () => void;
}

export function SupplierFormModal({ open, onClose, editId, form, errors, loading, onFieldChange, onSave }: SupplierFormModalProps) {
  function field(key: keyof SupplierDraft, label: string, opts?: { placeholder?: string; required?: boolean }) {
    return (
      <div>
        <Input
          label={`${label}${opts?.required !== false ? ' *' : ''}`}
          value={form[key]}
          onChange={e => onFieldChange(key, e.target.value)}
          placeholder={opts?.placeholder}
        />
        {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
      </div>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={editId ? 'Editar proveedor' : 'Nuevo proveedor'} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('code', 'Código interno', { placeholder: 'PROV-001' })}
          {field('ruc', 'RUC / Identificador tributario', { placeholder: '20123456789' })}
        </div>
        {field('name', 'Razón social', { placeholder: 'Empresa S.A.C.' })}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('commercialName', 'Nombre comercial', { required: false, placeholder: 'Nombre comercial (opcional)' })}
          {field('contact', 'Nombre de contacto', { placeholder: 'Juan Pérez' })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('phone', 'Teléfono', { placeholder: '+51 1 2345678' })}
          {field('email', 'Correo electrónico', { placeholder: 'ventas@empresa.com' })}
        </div>
        {field('address', 'Dirección', { placeholder: 'Av. Industrial 123, Lima' })}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" icon={<CheckIcon size={14} />} onClick={onSave} loading={loading}>
            {editId ? 'Guardar cambios' : 'Crear proveedor'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
