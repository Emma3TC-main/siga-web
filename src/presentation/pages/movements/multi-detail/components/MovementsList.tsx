import { useLocations } from '../../../../hooks/useLocations';
import { useProducts } from '../../../../hooks/useProducts';
import { Button, EmptyState, EyeIcon, MovementStatusBadge, TableActionButton, formatCurrency } from '../../../../components/ui';
import type { Movement } from '../../../../../domain/entities/Movement';
import type { MultiDetailModeConfig } from '../constants';
import { movementLines } from '../utils/movementLines';

export interface MovementsListProps {
  movements: readonly Movement[];
  config: MultiDetailModeConfig;
  canCreate: boolean;
  onView: (movement: Movement) => void;
  onCreate: () => void;
}

export function MovementsList({ movements, config, canCreate, onView, onCreate }: MovementsListProps) {
  const { products } = useProducts();
  const { locations } = useLocations();

  function routeLabel(movement: Movement) {
    const detail = movementLines(movement);
    const first = detail[0];
    const from = locations.find(location => location.id === first?.fromLocationId)?.name;
    const to = locations.find(location => location.id === first?.toLocationId)?.name;
    if (movement.type === 'transferencia') return `${from ?? '—'} → ${to ?? '—'}`;
    return from ?? to ?? '—';
  }

  return (
    <div className="flex-1 overflow-auto mt-4">
      {/* Desktop: table view */}
      <div className="hidden md:block">
        <table className="siga-table min-w-[940px]">
          <thead>
            <tr><th>ID</th><th>Tipo / detalle</th><th className="text-right">Ítems</th><th>Origen / destino</th><th className="text-right">Valor</th><th>Documento</th><th>Fecha</th><th className="text-center">Estado</th><th className="text-center">Acciones</th></tr>
          </thead>
          <tbody>
            {movements.map(movement => {
              const detail = movementLines(movement);
              const firstProduct = products.find(product => product.id === detail[0]?.productId);
              return (
                <tr key={movement.id}>
                  <td className="font-mono text-xs text-[#3B7597]">{movement.id}</td>
                  <td>
                    <div className="font-medium text-sm max-w-[200px] truncate">{firstProduct?.name}</div>
                    <div className="text-xs text-gray-400 max-w-[200px] truncate">{detail.length > 1 ? `y ${detail.length - 1} ítem(s) más` : movement.type.replace('_', ' ')}</div>
                  </td>
                  <td className="text-right font-semibold tabular-nums">{detail.length}</td>
                  <td className="text-xs max-w-[180px] truncate">{routeLabel(movement)}</td>
                  <td className="text-right tabular-nums">{formatCurrency(movement.totalCost ?? 0)}</td>
                  <td className="text-xs"><div className="font-medium">{movement.documentType}</div><div className="font-mono text-gray-400">{movement.documentNumber}</div></td>
                  <td className="text-xs font-mono">{movement.createdAt.split(',')[0]}</td>
                  <td className="text-center"><MovementStatusBadge status={movement.status} /></td>
                  <td className="text-center">
                    <TableActionButton icon={<EyeIcon size={14} />} label={`Ver ${movement.id}`} onClick={() => onView(movement)} />
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
          const detail = movementLines(movement);
          const first = products.find(product => product.id === detail[0]?.productId);
          return (
            <button key={movement.id} onClick={() => onView(movement)} className="siga-card w-full p-4 text-left">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-xs text-[#3B7597]">{movement.id}</div>
                  <div className="font-semibold text-sm text-[#093C5D] mt-1">{first?.name}</div>
                  <div className="text-xs text-gray-400">{detail.length} ítem(s) · {routeLabel(movement)}</div>
                </div>
                <MovementStatusBadge status={movement.status} />
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
                <span>{movement.documentType} {movement.documentNumber}</span>
                <strong>{formatCurrency(movement.totalCost ?? 0)}</strong>
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
