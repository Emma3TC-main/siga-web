import type { ReactNode } from 'react';
import { Badge, DetailField, DetailSection, EmptyState, PackageIcon, FileIcon } from '../../../../components/ui';
import type { Movement } from '../../../../../domain/entities/Movement';
import { MOVEMENT_TYPE_LABELS } from './movementDetailData';

export interface MovementSummaryProps {
  movement: Movement;
  registeredByName?: string;
  authorizedByName?: string;
  rejectedByName?: string;
  requesterName?: string;
  costCenterLabel?: string;
  supplier?: { name: string; code: string; ruc: string } | null;
}

/** Datos generales del movimiento. Solo se pintan los campos que existen en el registro. */
export function MovementSummary({ movement, registeredByName, authorizedByName, rejectedByName, requesterName, costCenterLabel, supplier }: MovementSummaryProps) {
  const documentLabel = [movement.documentType, [movement.documentSeries, movement.documentNumber].filter(Boolean).join('-')].filter(Boolean).join(' ');

  const fields: { label: string; value: ReactNode; wide?: boolean }[] = [
    { label: 'Tipo de movimiento', value: MOVEMENT_TYPE_LABELS[movement.type] ?? movement.type },
    documentLabel ? { label: 'Documento de referencia', value: <span className="font-mono text-sm">{documentLabel}</span> } : null,
    { label: 'Fecha de registro', value: <span className="font-mono text-sm">{movement.createdAt}</span> },
    movement.confirmedAt ? { label: 'Fecha de confirmación', value: <span className="font-mono text-sm">{movement.confirmedAt}</span> } : null,
    registeredByName ? { label: 'Registrado por', value: registeredByName } : null,
    authorizedByName ? { label: 'Autorizado por', value: authorizedByName } : null,
    rejectedByName ? { label: 'Rechazado por', value: rejectedByName } : null,
    requesterName ? { label: 'Responsable / solicitante', value: requesterName } : null,
    costCenterLabel ? { label: 'Centro de costo', value: costCenterLabel } : null,
    movement.avgCostAfter !== undefined ? { label: 'Costo promedio resultante', value: <span className="tabular-nums">{`S/ ${movement.avgCostAfter.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span> } : null,
    movement.motive ? { label: 'Motivo', value: <span className="font-medium text-sm whitespace-normal break-words">{movement.motive}</span>, wide: true } : null,
    movement.rejectionReason ? { label: 'Motivo del rechazo', value: <span className="font-medium text-sm whitespace-normal break-words text-red-600">{movement.rejectionReason}</span>, wide: true } : null,
    movement.correlationId ? { label: 'ID de correlación', value: <span className="font-mono text-xs">{movement.correlationId}</span> } : null,
  ].filter((field): field is { label: string; value: ReactNode; wide?: boolean } => field !== null);

  return (
    <div className="space-y-5">
      <DetailSection title="Información general">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {fields.map(field => (
            <DetailField key={field.label} label={field.label} value={field.value} className={field.wide ? 'sm:col-span-2' : ''} />
          ))}
        </div>
        {movement.isSensitive && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <Badge variant="warning" dot>Movimiento sensible</Badge>
            {movement.sensitiveLevel !== undefined && <span>Nivel {movement.sensitiveLevel}</span>}
          </div>
        )}
      </DetailSection>

      {supplier && (
        <DetailSection title="Proveedor externo">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#093C5D]/4 border border-[#093C5D]/10">
            <div className="w-8 h-8 rounded-lg bg-[#3B7597]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <PackageIcon size={15} className="text-[#3B7597]" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-[#093C5D]">{supplier.name}</div>
              <div className="text-xs text-gray-400 font-mono mt-0.5">{supplier.code} · RUC {supplier.ruc}</div>
            </div>
          </div>
        </DetailSection>
      )}

      <DetailSection title="Observaciones">
        {movement.observations ? (
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap break-words">{movement.observations}</div>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-lg">
            <EmptyState compact icon={<FileIcon size={28} />} title="Sin observaciones" description="Este movimiento no registró observaciones." />
          </div>
        )}
      </DetailSection>
    </div>
  );
}
