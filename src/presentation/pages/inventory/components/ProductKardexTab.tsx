import type { Movement } from '../../../../domain/entities/Movement';
import type { User } from '../../../../domain/entities/User';
import { Badge, formatNumber } from '../../../components/ui';

interface ProductKardexTabProps {
  detailMovements: Movement[];
  users: User[];
}

export function ProductKardexTab({ detailMovements, users }: ProductKardexTabProps) {
  const shown = detailMovements.slice(0, 20);
  return (
    <table className="siga-table">
      <thead><tr><th>Fecha</th><th>Movimiento</th><th className="text-right">Entrada</th><th className="text-right">Salida</th><th className="text-right">Saldo</th><th>Usuario</th><th>Documento</th></tr></thead>
      <tbody>
        {shown.map((mv, i) => {
          const user = users.find(u => u.id === mv.registeredBy);
          const isIn = mv.type === 'entrada' || mv.type === 'ajuste_positivo' || (mv.type === 'transferencia' && mv.toLocationId);
          const isOut = mv.type === 'salida' || mv.type === 'ajuste_negativo';
          return (
            <tr key={i}>
              <td className="text-xs font-mono">{mv.createdAt}</td>
              <td><Badge variant={isIn ? 'success' : isOut ? 'error' : 'info'}>{mv.type.replace('_', ' ')}</Badge></td>
              <td className="text-right text-emerald-600 font-semibold">{isIn ? formatNumber(mv.quantity) : '—'}</td>
              <td className="text-right text-red-500 font-semibold">{isOut ? formatNumber(mv.quantity) : '—'}</td>
              <td className="text-right font-bold text-[#093C5D]">—</td>
              <td className="text-xs">{user?.name} {user?.lastName}</td>
              <td className="text-xs font-mono">{mv.documentNumber ?? '—'}</td>
            </tr>
          );
        })}
        {detailMovements.length === 0 && <tr><td colSpan={7} className="text-center text-gray-400 py-4">Sin movimientos registrados</td></tr>}
      </tbody>
    </table>
  );
}
