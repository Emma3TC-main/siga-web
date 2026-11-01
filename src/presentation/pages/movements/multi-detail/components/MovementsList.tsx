import { Button, EmptyState, EyeIcon, MovementStatusBadge, TableActionButton } from '../../../../components/ui';
import type { Movement } from '../../../../../domain/entities/Movement';
import type { MultiDetailModeConfig } from '../constants';

export interface MovementsListProps {
  movements: readonly Movement[];
  config: MultiDetailModeConfig;
  canCreate: boolean;
  onView: (id: string) => void;
  onCreate: () => void;
}

export function MovementsList({ movements, config, canCreate, onView, onCreate }: MovementsListProps) {
  return (
    <div className="flex-1 overflow-auto mt-4">
      {/* Desktop: table view */}
      <div className="hidden md:block">
        <table className="siga-table min-w-[940px]">
          <thead>
            <tr><th>ID</th><th>Código / tipo</th><th>Referencia</th><th>Centro de costo</th><th>Motivo</th><th>Fecha</th><th className="text-center">Estado</th><th className="text-center">Acciones</th></tr>
          </thead>
          <tbody>
            {movements.map(movement => {
              return (
                <tr key={movement.id}>
                  <td className="font-mono text-xs text-[#3B7597]">{movement.id}</td>
                  <td>
                    <div className="font-medium text-sm max-w-[200px] truncate">{movement.movementCode ?? movement.documentNumber}</div>
                    <div className="text-xs text-gray-400 max-w-[200px] truncate">{movement.type.replace('_', ' ')}{movement.isSensitive ? ' · sensible' : ''}</div>
                  </td>
                  <td className="text-xs"><div className="font-medium">{movement.referenceDocType ?? '—'}</div><div className="font-mono text-gray-400">{movement.referenceDocNumber ?? ''}</div></td>
                  <td className="text-xs max-w-[180px] truncate">{movement.costCenterNameSnapshot ?? movement.costCenterId ?? '—'}</td>
                  <td className="text-xs max-w-[180px] truncate">{movement.motive ?? '—'}</td>
                  <td className="text-xs font-mono">{movement.createdAt.split(',')[0]}</td>
                  <td className="text-center"><MovementStatusBadge status={movement.status} /></td>
                  <td className="text-center">
                    <TableActionButton icon={<EyeIcon size={14} />} label={`Ver ${movement.id}`} onClick={() => onView(movement.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden px-4 pb-4 space-y-3">
        {movements.map(movement => {
          return (
            <button key={movement.id} onClick={() => onView(movement.id)} className="siga-card w-full p-4 text-left">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-xs text-[#3B7597]">{movement.id}</div>
                  <div className="font-semibold text-sm text-[#093C5D] mt-1">{movement.movementCode ?? movement.documentNumber}</div>
                  <div className="text-xs text-gray-400">{movement.type.replace('_', ' ')}{movement.isSensitive ? ' · sensible' : ''}</div>
                </div>
                <MovementStatusBadge status={movement.status} />
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
                <span>{movement.referenceDocType ?? 'Sin referencia'} {movement.referenceDocNumber ?? ''}</span>
                <strong>{movement.costCenterNameSnapshot ?? movement.costCenterId ?? '—'}</strong>
              </div>
            </button>
          );
        })}
      </div>

      {movements.length === 0 && (
        <EmptyState icon={config.icon} title={`No hay ${config.title.toLowerCase()} registradas`}
          action={canCreate ? <Button size="sm" onClick={onCreate}>Crear registro</Button> : undefined}
        />
      )}
    </div>
  );
}
