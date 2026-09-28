import { Badge, Button, formatNumber, CheckIcon, XIcon, ShieldIcon, EyeIcon } from '../../../components/ui';
import type { ResolvedAuthorization } from '../utils/resolveAuthorization';

function statusBadge(status: 'pendiente' | 'aprobado' | 'rechazado') {
  if (status === 'pendiente') return { variant: 'warning' as const, label: 'Pendiente' };
  if (status === 'aprobado') return { variant: 'success' as const, label: 'Autorizada' };
  return { variant: 'error' as const, label: 'Rechazada' };
}

export interface AuthorizationCardProps {
  resolved: ResolvedAuthorization;
  canAuthorize: boolean;
  loading: boolean;
  onOpen: (authId: string) => void;
  onView: (authId: string) => void;
  onApprove: (authId: string) => void;
  onReject: (authId: string) => void;
  onConfirmMfa: (authId: string) => void;
}

export function AuthorizationCard({ resolved, canAuthorize, loading, onOpen, onView, onApprove, onReject, onConfirmMfa }: AuthorizationCardProps) {
  const { auth, product, unit, fromLocation, toLocation, requester, registeredBy, resolvedBy, movement, sensitivity } = resolved;
  const status = statusBadge(auth.status);

  return (
    <div
      className={`siga-card p-5 cursor-pointer hover:border-[#3B7597] hover:shadow-md transition-all ${auth.status === 'pendiente' ? 'border-amber-200' : ''}`}
      onClick={() => onOpen(auth.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-xs text-[#3B7597] mb-0.5">{auth.id}</div>
          <div className="font-semibold text-[#093C5D] text-sm">{auth.type}</div>
        </div>
        <div className="flex gap-1.5 items-start">
          <Badge variant={sensitivity.variant}>{sensitivity.label}</Badge>
          <Badge variant={status.variant} dot>{status.label}</Badge>
          <button
            onClick={e => { e.stopPropagation(); onView(auth.id); }}
            title="Ver detalle"
            className="p-1 rounded text-[#3B7597] hover:bg-[#6FD1D7]/20 -mt-0.5"
          >
            <EyeIcon size={14} />
          </button>
        </div>
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex gap-2"><span className="text-gray-400 w-24">Producto:</span><span className="font-medium truncate">{product?.name}{auth.lines && auth.lines.length > 1 ? ` y ${auth.lines.length - 1} más` : ''}</span></div>
        <div className="flex gap-2"><span className="text-gray-400 w-24">Detalle:</span><span className="font-semibold text-[#093C5D]">{auth.lines?.length ?? 1} ítem(s) · {formatNumber(auth.quantity)} {unit?.code}</span></div>
        {fromLocation && <div className="flex gap-2"><span className="text-gray-400 w-24">Desde:</span><span>{fromLocation.name}</span></div>}
        {toLocation && <div className="flex gap-2"><span className="text-gray-400 w-24">Hacia:</span><span>{toLocation.name}</span></div>}
        <div className="flex gap-2"><span className="text-gray-400 w-24">Solicitante:</span><span>{requester?.name ?? '—'}</span></div>
        <div className="flex gap-2"><span className="text-gray-400 w-24">Registrado:</span><span>{registeredBy?.name} {registeredBy?.lastName}</span></div>
        <div className="flex gap-2"><span className="text-gray-400 w-24">Motivo:</span><span className="text-gray-600 text-xs truncate">{auth.motive ?? '—'}</span></div>
        {auth.resolvedBy && <div className="flex gap-2"><span className="text-gray-400 w-24">{auth.status === 'aprobado' ? 'Autorizado por:' : 'Rechazado por:'}</span><span className="font-medium">{resolvedBy?.name} {resolvedBy?.lastName}</span></div>}
        {auth.rejectionReason && <div className="p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600 mt-1">{auth.rejectionReason}</div>}
      </div>
      {auth.status === 'pendiente' && canAuthorize && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
          <Button variant="success" size="sm" icon={<CheckIcon size={12} />} className="flex-1" onClick={() => onApprove(auth.id)} loading={loading}>Aprobar</Button>
          <Button variant="danger" size="sm" icon={<XIcon size={12} />} className="flex-1" onClick={() => onReject(auth.id)}>Rechazar</Button>
        </div>
      )}
      {auth.status === 'aprobado' && canAuthorize && movement?.status === 'autorizado' && (
        <div className="mt-3 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
          <Button variant="primary" size="sm" icon={<ShieldIcon size={13} />} className="w-full" onClick={() => onConfirmMfa(auth.id)}>Confirmar movimiento con MFA</Button>
        </div>
      )}
      {auth.status === 'aprobado' && movement?.status === 'confirmado' && (
        <div className="mt-3 p-2 rounded bg-emerald-50 text-emerald-700 text-xs text-center font-medium">Confirmado · stock actualizado</div>
      )}
    </div>
  );
}
