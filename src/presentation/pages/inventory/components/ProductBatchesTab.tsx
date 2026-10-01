import type { StockEntry } from '../../../../domain/entities/Stock';
import { EXPIRY_WARNING_DAYS, daysUntilExpiry } from '../../../../domain/rules/inventoryRules';
import { Badge, formatNumber } from '../../../components/ui';

interface ProductBatchesTabProps {
  detailStock: StockEntry[];
}

export function ProductBatchesTab({ detailStock }: ProductBatchesTabProps) {
  const batches = detailStock.filter(s => s.batch);
  return (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

    <table className="w-full border-collapse">

      <thead className="bg-gray-50/80 border-b border-gray-200">
        <tr>
          <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Lote/Colada
          </th>

          <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Vencimiento
          </th>

          <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Cantidad
          </th>

          <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Estado
          </th>
        </tr>
      </thead>


      <tbody className="divide-y divide-gray-100">

        {batches.map((s, i) => {

          const days = s.expiryDate
            ? daysUntilExpiry(s.expiryDate)
            : null;

          const expStatus =
            days === null
              ? 'N/A'
              : days < 0
                ? 'Vencido'
                : days <= EXPIRY_WARNING_DAYS
                  ? 'Próx. vencer'
                  : 'Vigente';

          return (

            <tr
              key={i}
              className="hover:bg-gray-50/70 transition-colors"
            >

              <td className="px-4 py-3">

                <span className="font-mono text-sm font-medium text-[#3B7597]">
                  {s.batch}
                </span>

              </td>


              <td className="px-4 py-3 text-sm text-gray-600">

                {s.expiryDate ?? '—'}

              </td>


              <td className="px-4 py-3 text-right">

                <span className="font-bold text-[#093C5D] tabular-nums">
                  {formatNumber(s.quantity)}
                </span>

              </td>


              <td className="px-4 py-3 text-center">

                <Badge
                  variant={
                    expStatus === 'Vencido'
                      ? 'error'
                      : expStatus === 'Próx. vencer'
                        ? 'warning'
                        : 'success'
                  }
                >
                  {expStatus}
                </Badge>

              </td>

            </tr>

          );

        })}


        {batches.length === 0 && (

          <tr>

            <td
              colSpan={4}
              className="text-center text-gray-400 py-8 text-sm"
            >
              Sin lotes registrados
            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>
);
}
