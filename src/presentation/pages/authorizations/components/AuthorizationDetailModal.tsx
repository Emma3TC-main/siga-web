import type { ReactNode } from 'react';
import { Badge, Modal, formatNumber, MovementStatusBadge } from '../../../components/ui';
import type { ResolvedAuthorization } from '../utils/resolveAuthorization';
import { useMovementEvidences } from '../../../hooks/useMovementEvidences';
import { evidenceUseCases } from '../../../../app/compositionRoot';
import { useApp } from '../../../state/AppContext';
import { MovementAttachments } from '../../movements/shared/detail/MovementAttachments';

const TYPE_LABELS: Record<string, string> = {
  entrada: 'Entrada',
  salida: 'Salida',
  transferencia: 'Transferencia',
  ajuste_positivo: 'Ajuste positivo',
  ajuste_negativo: 'Ajuste negativo',
};

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

function actorLabel(name: string | undefined, id: string | undefined): string {
  if (name?.trim()) return name;
  return id ?? 'No informado';
}

function costLabel(value: number | undefined): string {
  return value === undefined ? '—' : `S/ ${formatNumber(value)}`;
}

function AuthorizationEvidenceSection({ movementId }: { movementId: string }) {
  const { showToast } = useApp();
  const { evidences, loading, error } = useMovementEvidences(movementId);

  const download = async (id: string) => {
    try {
      const { blob, filename } = await evidenceUseCases.download(id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast('error', 'No se pudo descargar la evidencia.');
    }
  };

  return (
    <Section title="Evidencias">
      <MovementAttachments evidences={evidences} loading={loading} error={error} onDownload={download} />
    </Section>
  );
}

function AuthorizationDetailContent({ resolved }: { resolved: ResolvedAuthorization }) {
  const { auth, fromLocation, toLocation, requester, registeredBy, resolvedBy, costCenter, movement, sensitivity, lines } = resolved;
  const status = statusBadge(auth.status);
  const movementStatus = auth.movementStatus ?? movement?.status;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 p-4 bg-[#093C5D]/3 rounded-lg">
        <div>
          <div className="font-mono text-xs text-[#3B7597] mb-1">{auth.id}</div>
          <div className="font-bold text-[#093C5D] text-base">{TYPE_LABELS[auth.type] ?? auth.type}</div>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <Badge variant={sensitivity.variant}>{sensitivity.label}</Badge>
          <Badge variant={status.variant} dot>{status.label}</Badge>
        </div>
      </div>

      <Section title="Información general">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Código de movimiento" value={auth.movementCode ?? auth.movementId} />
          <Field label="Líneas" value={lines?.length ?? '—'} />
          <Field label="Tipo de documento" value={auth.documentType ?? '—'} />
          <Field label="Movimiento asociado" value={auth.movementId} />
          <Field label="Control" value="Maker-checker y MFA reciente al resolver" />
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
          <Field label="Solicitante" value={actorLabel(requester?.name, auth.requesterId)} />
          <Field label="Registrado por" value={actorLabel(registeredBy ? `${registeredBy.name} ${registeredBy.lastName}` : undefined, auth.registeredBy)} />
          <Field label="Fecha de creación" value={auth.createdAt} />
          {movementStatus && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400">Estado del movimiento</div>
              <div className="mt-0.5"><MovementStatusBadge status={movementStatus} /></div>
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

      {lines && lines.length > 0 && (
        <Section title={`Ítems del movimiento (${lines.length})`}>
          <div className="overflow-x-auto">
            <table className="siga-table">
              <thead><tr><th>Producto</th><th>Cantidad</th><th>Cantidad stock</th><th>Origen</th><th>Destino</th><th>Lote / Activo</th><th>Costo aplicado</th></tr></thead>
              <tbody>
                {lines.map(({ line, product: lineProduct, unit: lineUnit, fromLocation: lineFrom, toLocation: lineTo }) => (
                  <tr key={line.id}>
                    <td>{lineProduct?.name ?? line.productId}</td>
                    <td>{formatNumber(line.quantity)} {lineUnit?.code ?? line.unitCode ?? ''}</td>
                    <td>{line.stockQuantity === undefined ? '—' : formatNumber(line.stockQuantity)}</td>
                    <td>{lineFrom?.name ?? line.fromLocationId ?? '—'}</td>
                    <td>{lineTo?.name ?? line.toLocationId ?? '—'}</td>
                    <td>{line.batch ?? line.serial ?? '—'}</td>
                    <td>{costLabel(line.baseUnitCostPen ?? line.appliedAvgCostPen ?? line.unitCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <AuthorizationEvidenceSection movementId={auth.movementId} />
    </div>
  );
}

export interface AuthorizationDetailModalProps {
  open: boolean;
  onClose: () => void;
  resolved?: ResolvedAuthorization;
  loading?: boolean;
  error?: string | null;
}

/**
 * Modal de consulta (nueva filosofía de la Fase 7): permite revisar todos los campos relevantes
 * de la autorización. No altera estados ni el flujo de aprobación/rechazo.
 */
export function AuthorizationDetailModal({ open, onClose, resolved, loading = false, error = null }: AuthorizationDetailModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={resolved ? `Autorización ${resolved.auth.id}` : 'Detalle de autorización'} size="lg">
      {loading && <div className="py-10 text-center text-sm text-gray-500">Cargando detalle completo del movimiento…</div>}
      {!loading && error && <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>}
      {resolved && <AuthorizationDetailContent resolved={resolved} />}
    </Modal>
  );
}
