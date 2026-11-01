import type { Movement } from '../../../../domain/entities/Movement';
import { Badge } from '../../../components/ui';

interface ProductKardexTabProps {
  detailMovements: Movement[];
}

export function ProductKardexTab({ detailMovements }: ProductKardexTabProps) {
  const shown = detailMovements;
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
            Código
          </th>

          <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Referencia
          </th>

          <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Sensible
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

                <span className="font-mono text-xs text-[#3B7597]">{mv.movementCode ?? mv.documentNumber}</span>

              </td>


              <td className="px-4 py-3 text-right">

                <span className="font-mono text-xs">{mv.referenceDocNumber ?? '—'}</span>

              </td>


              <td className="px-4 py-3 text-right">

                <span className="text-xs font-bold text-[#093C5D]">
                  {mv.isSensitive ? 'Sí' : 'No'}
                </span>

              </td>


              <td className="px-4 py-3">

                <span className="text-xs font-medium text-gray-600">
                  {mv.registeredBy}
                </span>

              </td>


              <td className="px-4 py-3">

                <span className="text-xs font-mono text-[#3B7597]">
                  {mv.referenceDocType ?? '—'}
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
