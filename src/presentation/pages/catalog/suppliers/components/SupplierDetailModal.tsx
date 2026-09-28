import type { Supplier } from '../../../../../domain/entities/Supplier';
import type { Movement } from '../../../../../domain/entities/Movement';
import { Modal, Button, Badge, DetailHeader, DetailSection, DetailField } from '../../../../components/ui';

interface SupplierDetailModalProps {
  detail: Supplier | null;
  movements: Movement[];
  canEdit: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onRequestToggleStatus: (id: string) => void;
}

export function SupplierDetailModal({ detail, movements, canEdit, onClose, onEdit, onRequestToggleStatus }: SupplierDetailModalProps) {
  const receipts = detail ? movements.filter(m => m.supplierId === detail.id || m.supplierSnapshot?.id === detail.id) : [];

  return (
    <Modal open={!!detail} onClose={onClose} title={detail?.name ?? ''} size="md">
      {detail && (
        <div className="space-y-5">
          <DetailHeader
            eyebrow={detail.code}
            title={detail.name}
            badges={<Badge variant={detail.status === 'active' ? 'success' : 'muted'} dot>{detail.status === 'active' ? 'Activo' : 'Inactivo'}</Badge>}
          />

          <DetailSection title="Información general">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailField label="Razón social" value={detail.name} />
              <DetailField label="Nombre comercial" value={detail.commercialName || '—'} />
              <DetailField label="RUC" value={detail.ruc} />
              <DetailField label="Registrado" value={detail.createdAt} />
              <DetailField label="Dirección" value={detail.address} className="col-span-2" />
            </div>
          </DetailSection>

          <DetailSection title="Contacto">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailField label="Contacto" value={detail.contact} />
              <DetailField label="Teléfono" value={detail.phone} />
              <DetailField label="Correo" value={detail.email} className="col-span-2" />
            </div>
          </DetailSection>

          {receipts.length > 0 && (
            <DetailSection title={`Recepciones registradas (${receipts.length})`}>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {receipts.map(m => (
                  <div key={m.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50">
                    <span className="font-mono text-[#3B7597]">{m.id}</span>
                    <span className="text-gray-500">{m.createdAt.split(',')[0]}</span>
                    <span className={`font-medium ${m.status === 'confirmado' ? 'text-emerald-600' : 'text-amber-600'}`}>{m.status}</span>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            {canEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(detail.id)}>
                Editar
              </Button>
            )}
            {canEdit && (
              <Button
                size="sm"
                variant={detail.status === 'active' ? 'outline' : 'primary'}
                onClick={() => onRequestToggleStatus(detail.id)}
              >
                {detail.status === 'active' ? 'Desactivar' : 'Activar'}
              </Button>
            )}
            <Button size="sm" onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
