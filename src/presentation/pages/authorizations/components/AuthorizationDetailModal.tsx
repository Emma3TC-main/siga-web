import type { ReactNode } from 'react';
import { Badge, Modal, formatNumber, MovementStatusBadge } from '../../../components/ui';
import type { ResolvedAuthorization } from '../utils/resolveAuthorization';

function statusBadge(status: 'pendiente' | 'aprobado' | 'rechazado') {
  if (status === 'pendiente') return { variant: 'warning' as const, label: 'Pendiente' };
  if (status === 'aprobado') return { variant: 'success' as const, label: 'Autorizada' };
  return { variant: 'error' as const, label: 'Rechazada' };
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-semibold text-[#093C5D]">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</h3>
      {children}
    </div>
  );
}

function AuthorizationDetailContent({ resolved }: { resolved: ResolvedAuthorization }) {
  const { auth, product, unit, fromLocation, toLocation, requester, registeredBy, resolvedBy, costCenter, movement, sensitivity, lines } = resolved;
  const status = statusBadge(auth.status);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 p-4 bg-[#093C5D]/3 rounded-lg">
        <div>
          <div className="font-mono text-xs text-[#3B7597] mb-1">{auth.id}</div>
          <div className="font-bold text-[#093C5D] text-base">{auth.type}</div>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <Badge variant={sensitivity.variant}>{sensitivity.label}</Badge>
          <Badge variant={status.variant} dot>{status.label}</Badge>
        </div>
      </div>

      <Section title="Información general">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Producto" value={product ? `${product.name} (${product.sku})` : '—'} />
          <Field label="Cantidad" value={`${formatNumber(auth.quantity)} ${unit?.code ?? ''}`.trim()} />
          <Field label="Tipo de documento" value={auth.documentType ?? '—'} />
          <Field label="Movimiento asociado" value={auth.movementId} />
        </div>
      </Section>

      {(fromLocation || toLocation) && (
        <Section title="Ubicación">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {fromLocation && <Field label="Desde" value={fromLocation.name} />}
            {toLocation && <Field label="Hacia" value={toLocation.name} />}
          </div>
        </Section>
      )}

      <Section title="Información operativa">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Centro de costo" value={costCenter?.name ?? '—'} />
          <div className="p-3 bg-gray-50 rounded-lg col-span-2 sm:col-span-1">
            <div className="text-xs text-gray-400">Motivo</div>
            <div className="font-semibold text-[#093C5D]">{auth.motive ?? '—'}</div>
          </div>
        </div>
      </Section>

      <Section title="Responsable y trazabilidad">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Solicitante" value={requester?.name ?? '—'} />
          <Field label="Registrado por" value={registeredBy ? `${registeredBy.name} ${registeredBy.lastName}` : '—'} />
          <Field label="Fecha de creación" value={auth.createdAt} />
          {movement && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400">Estado del movimiento</div>
              <div className="mt-0.5"><MovementStatusBadge status={movement.status} /></div>
            </div>
          )}
        </div>
      </Section>

      {auth.status !== 'pendiente' && (
        <Section title="Resolución">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label={auth.status === 'aprobado' ? 'Autorizado por' : 'Rechazado por'} value={resolvedBy ? `${resolvedBy.name} ${resolvedBy.lastName}` : '—'} />
            <Field label="Fecha de resolución" value={auth.resolvedAt ?? '—'} />
            {auth.rejectionReason && (
              <div className="col-span-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                {auth.rejectionReason}
              </div>
            )}
          </div>
        </Section>
      )}

      {lines && lines.length > 1 && (
        <Section title={`Ítems del movimiento (${lines.length})`}>
          <div className="overflow-x-auto">
            <table className="siga-table">
              <thead><tr><th>Producto</th><th>Cantidad</th><th>Lote / Serie</th></tr></thead>
              <tbody>
                {lines.map(({ line, product: lineProduct, unit: lineUnit }) => (
                  <tr key={line.id}>
                    <td>{lineProduct?.name ?? line.productId}</td>
                    <td>{formatNumber(line.quantity)} {lineUnit?.code ?? ''}</td>
                    <td>{line.batch ?? line.serial ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </div>
  );
}

export interface AuthorizationDetailModalProps {
  open: boolean;
  onClose: () => void;
  resolved?: ResolvedAuthorization;
}

/**
 * Modal de consulta (nueva filosofía de la Fase 7): permite revisar todos los campos relevantes
 * de la autorización. No altera estados ni el flujo de aprobación/rechazo.
 */
export function AuthorizationDetailModal({ open, onClose, resolved }: AuthorizationDetailModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={resolved ? `Autorización ${resolved.auth.id}` : 'Detalle de autorización'} size="lg">
      {resolved && <AuthorizationDetailContent resolved={resolved} />}
    </Modal>
  );
}
