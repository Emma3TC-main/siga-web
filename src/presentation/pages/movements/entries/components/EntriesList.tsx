import { useProducts } from '../../../../hooks/useProducts';
import { useUsers } from '../../../../hooks/useUsers';
import { Button, EmptyState, EyeIcon, MovementStatusBadge, PackageIcon, TableActionButton, formatCurrency } from '../../../../components/ui';
import type { Movement } from '../../../../../domain/entities/Movement';
import { movementLines } from '../utils/movementLines';

export interface EntriesListProps {
  entries: readonly Movement[];
  onView: (movement: Movement) => void;
  onNewEntry: () => void;
}

export function EntriesList({ entries, onView, onNewEntry }: EntriesListProps) {
  const { products } = useProducts();
  const { users } = useUsers();

  return (
    <>
      {/* Desktop: table view */}
      <div className="hidden md:block">
        <table className="siga-table min-w-[980px]">
          <thead>
            <tr><th>ID</th><th>Detalle</th><th className="text-right">Ítems</th><th className="text-right">Costo total</th><th>Documento</th><th>Registrado por</th><th>Fecha</th><th className="text-center">Estado</th><th className="text-center">Acciones</th></tr>
          </thead>
          <tbody>
            {entries.map(movement => {
              const detail = movementLines(movement);
              const firstProduct = products.find(product => product.id === detail[0]?.productId);
              const user = users.find(item => item.id === movement.registeredBy);
              return (
                <tr key={movement.id}>
                  <td className="font-mono text-xs text-[#3B7597]">{movement.id}</td>
                  <td>
                    <div className="font-medium text-sm max-w-[220px] truncate">{firstProduct?.name ?? 'Producto'}</div>
                    <div className="text-xs text-gray-400 max-w-[220px] truncate">{detail.length > 1 ? `y ${detail.length - 1} ítem(s) más` : firstProduct?.sku}</div>
                  </td>
                  <td className="text-right font-semibold text-[#093C5D] tabular-nums">{detail.length}</td>
                  <td className="text-right font-medium tabular-nums">{formatCurrency(detail.reduce((total, line) => total + (line.totalCost ?? line.quantity * (line.unitCost ?? 0)), 0))}</td>
                  <td className="text-xs"><div className="font-medium">{movement.documentType}</div><div className="font-mono text-gray-400">{movement.documentNumber}</div></td>
                  <td className="text-xs max-w-[140px] truncate">{user?.name} {user?.lastName}</td>
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
      <div className="md:hidden p-4 space-y-3">
        {entries.map(movement => {
          const detail = movementLines(movement);
          const firstProduct = products.find(product => product.id === detail[0]?.productId);
          const cost = detail.reduce((total, line) => total + (line.totalCost ?? line.quantity * (line.unitCost ?? 0)), 0);
          return (
            <button key={movement.id} onClick={() => onView(movement)} className="siga-card w-full p-4 text-left">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-xs text-[#3B7597]">{movement.id}</div>
                  <div className="font-semibold text-sm text-[#093C5D] mt-1">{firstProduct?.name}</div>
                  <div className="text-xs text-gray-400">{detail.length} ítem(s) · {movement.documentType} {movement.documentNumber}</div>
                </div>
                <MovementStatusBadge status={movement.status} />
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
                <span>{movement.createdAt.split(',')[0]}</span>
                <strong>{formatCurrency(cost)}</strong>
              </div>
            </button>
          );
        })}
      </div>

      {entries.length === 0 && (
        <EmptyState icon={<PackageIcon size={48} />} title="No hay entradas registradas"
          description="Registre una entrada con uno o más productos."
          action={<Button size="sm" onClick={onNewEntry}>Nueva entrada</Button>}
        />
      )}
    </>
  );
}