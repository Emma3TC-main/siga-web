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
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

    <table className="w-full border-collapse">

      <thead className="bg-gray-50/80 border-b border-gray-200">
        <tr>

          <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Fecha
          </th>

          <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Movimiento
          </th>

          <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Entrada
          </th>

          <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Salida
          </th>

          <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Saldo
          </th>

          <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Usuario
          </th>

          <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Documento
          </th>

        </tr>
      </thead>


      <tbody className="divide-y divide-gray-100">

        {shown.map((mv, i) => {

          const user = users.find(
            u => u.id === mv.registeredBy
          );

          const isIn =
            mv.type === 'entrada' ||
            mv.type === 'ajuste_positivo' ||
            (
              mv.type === 'transferencia' &&
              mv.toLocationId
            );

          const isOut =
            mv.type === 'salida' ||
            mv.type === 'ajuste_negativo';

          return (

            <tr
              key={i}
              className="hover:bg-gray-50/70 transition-colors"
            >

              <td className="px-4 py-3">

                <span className="text-xs font-mono text-gray-500">
                  {mv.createdAt}
                </span>

              </td>


              <td className="px-4 py-3">

                <Badge
                  variant={
                    isIn
                      ? 'success'
                      : isOut
                        ? 'error'
                        : 'info'
                  }
                >
                  {mv.type.replace('_', ' ')}
                </Badge>

              </td>


              <td className="px-4 py-3 text-right">

                {isIn ? (

                  <span className="inline-flex items-center justify-center min-w-[48px] px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold tabular-nums">
                    {formatNumber(mv.quantity)}
                  </span>

                ) : (

                  <span className="text-xs text-gray-300">
                    —
                  </span>

                )}

              </td>


              <td className="px-4 py-3 text-right">

                {isOut ? (

                  <span className="inline-flex items-center justify-center min-w-[48px] px-2 py-1 rounded-lg bg-red-50 text-red-500 text-xs font-semibold tabular-nums">
                    {formatNumber(mv.quantity)}
                  </span>

                ) : (

                  <span className="text-xs text-gray-300">
                    —
                  </span>

                )}

              </td>


              <td className="px-4 py-3 text-right">

                <span className="text-xs font-bold text-[#093C5D]">
                  —
                </span>

              </td>


              <td className="px-4 py-3">

                <span className="text-xs font-medium text-gray-600">
                  {user?.name} {user?.lastName}
                </span>

              </td>


              <td className="px-4 py-3">

                <span className="text-xs font-mono text-[#3B7597]">
                  {mv.documentNumber ?? '—'}
                </span>

              </td>

            </tr>

          );

        })}


        {detailMovements.length === 0 && (

          <tr>

            <td
              colSpan={7}
              className="text-center text-gray-400 py-8 text-sm"
            >
              Sin movimientos registrados
            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>
);
}
