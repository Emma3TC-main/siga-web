import { useMemo, useState } from 'react';
import { useApp } from '../../../../state/AppContext';
import { useAuditLog } from '../../../../hooks/useAuditLog';
import { useAuthorizations } from '../../../../hooks/useAuthorizations';
import { useCostCenters } from '../../../../hooks/useCostCenters';
import { useLocations } from '../../../../hooks/useLocations';
import { useProducts } from '../../../../hooks/useProducts';
import { useResponsibles } from '../../../../hooks/useResponsibles';
import { useSuppliers } from '../../../../hooks/useSuppliers';
import { useUnits } from '../../../../hooks/useUnits';
import { useUsers } from '../../../../hooks/useUsers';
import { Badge, DetailHeader, MovementStatusBadge, Tabs } from '../../../../components/ui';
import type { Movement } from '../../../../../domain/entities/Movement';
import { movementLines } from '../../multi-detail/utils/movementLines';
import { MovementSummary } from './MovementSummary';
import { MovementLinesTable } from './MovementLinesTable';
import { MovementTimeline } from './MovementTimeline';
import { MovementAttachments } from './MovementAttachments';
import { MOVEMENT_TYPE_LABELS, buildHistory, buildProgress } from './movementDetailData';

type DetailTab = 'resumen' | 'lineas' | 'auditoria' | 'adjuntos';

/**
 * Vista de consulta completa de un movimiento. Solo lee datos existentes
 * (movimiento, autorización, auditoría, evidencias); no ejecuta ninguna operación.
 */
export function MovementDetailView({ movement }: { movement: Movement }) {
  const { state } = useApp();
  const { users } = useUsers();
  const { products } = useProducts();
  const { locations } = useLocations();
  const { units } = useUnits();
  const { suppliers } = useSuppliers();
  const { responsibles } = useResponsibles();
  const { costCenters } = useCostCenters();
  const { authorizations } = useAuthorizations();
  const { auditLog } = useAuditLog();
  const [tab, setTab] = useState<DetailTab>('resumen');

  const userName = (id?: string) => {
    const user = users.find(item => item.id === id);
    return user ? `${user.name} ${user.lastName}` : undefined;
  };

  const lines = movementLines(movement);
  const authorization = authorizations.find(item => item.movementId === movement.id);
  const history = useMemo(() => buildHistory(movement, authorization, id => {
    const user = users.find(item => item.id === id);
    return user ? `${user.name} ${user.lastName}` : undefined;
  }), [movement, authorization, users]);
  const progress = buildProgress(movement.status, movement, authorization);

  const auditEvents = auditLog.filter(event => event.object.includes(movement.id) || (authorization && event.object.includes(authorization.id)));

  const evidences = state.evidences.filter(item => item.movementId === movement.id || movement.evidenceIds?.includes(item.id));
  const unlinkedCount = (movement.evidenceIds ?? []).filter(id => !state.evidences.some(item => item.id === id)).length;

  const snapshot = movement.supplierSnapshot;
  const liveSupplier = movement.supplierId ? suppliers.find(item => item.id === movement.supplierId) : undefined;
  const supplier = movement.isExternalReceipt || movement.supplierId || snapshot
    ? { name: snapshot?.name ?? liveSupplier?.name ?? '—', code: snapshot?.code ?? liveSupplier?.code ?? '—', ruc: snapshot?.ruc ?? liveSupplier?.ruc ?? '—' }
    : null;

  const costCenter = costCenters.find(item => item.id === movement.costCenterId);
  const requester = responsibles.find(item => item.id === movement.requesterId);
  const authorizedById = movement.authorizedBy ?? (authorization?.status === 'aprobado' ? authorization.resolvedBy : undefined);
  const documentLabel = [movement.documentType, [movement.documentSeries, movement.documentNumber].filter(Boolean).join('-')].filter(Boolean).join(' ');

  return (
    <div className="space-y-4">
      <DetailHeader
        eyebrow={movement.id}
        title={
          <div>
            <div>{MOVEMENT_TYPE_LABELS[movement.type] ?? movement.type}{documentLabel && ` · ${documentLabel}`}</div>
            <div className="text-xs font-normal text-gray-500 mt-1">
              Registrado por {userName(movement.registeredBy) ?? '—'} · <span className="font-mono">{movement.createdAt}</span>
            </div>
          </div>
        }
        badges={<>
          <MovementStatusBadge status={movement.status} />
          <Badge variant="info">{lines.length} ítems</Badge>
          <Badge variant="muted">Versión {movement.version ?? 1}</Badge>
        </>}
      />

      <Tabs
        active={tab}
        onChange={id => setTab(id as DetailTab)}
        tabs={[
          { id: 'resumen', label: 'Información' },
          { id: 'lineas', label: 'Líneas', count: lines.length },
          { id: 'auditoria', label: 'Auditoría', count: auditEvents.length },
          { id: 'adjuntos', label: 'Adjuntos', count: evidences.length + unlinkedCount },
        ]}
      />

      {tab === 'resumen' && (
        <MovementSummary
          movement={movement}
          registeredByName={userName(movement.registeredBy)}
          authorizedByName={userName(authorizedById)}
          rejectedByName={userName(movement.rejectedBy ?? (authorization?.status === 'rechazado' ? authorization.resolvedBy : undefined))}
          requesterName={requester?.name}
          costCenterLabel={costCenter ? `${costCenter.code} · ${costCenter.name}` : undefined}
          supplier={supplier}
        />
      )}
      {tab === 'lineas' && <MovementLinesTable lines={lines} products={products} locations={locations} units={units} />}
      {tab === 'auditoria' && <MovementTimeline progress={progress} history={history} auditEvents={auditEvents} userName={userName} />}
      {tab === 'adjuntos' && <MovementAttachments evidences={evidences} unlinkedCount={unlinkedCount} userName={userName} />}
    </div>
  );
}
