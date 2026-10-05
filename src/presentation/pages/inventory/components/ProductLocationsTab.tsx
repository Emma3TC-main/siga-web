import type { StockEntry } from '../../../../domain/entities/Stock';
import type { Location } from '../../../../domain/entities/Location';
import { formatCurrency, formatNumber } from '../../../components/ui';

interface ProductLocationsTabProps {
  detailStock: StockEntry[];
  locations: Location[];
}

export function ProductLocationsTab({ detailStock, locations }: ProductLocationsTabProps) {
return (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

    <table className="w-full border-collapse">

      <thead className="bg-gray-50/80 border-b border-gray-200">
        <tr>

          <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Ubicación
          </th>

          <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Cantidad
          </th>

          <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Lote
          </th>

          <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Serie
          </th>

          <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Costo prom.
          </th>

        </tr>
      </thead>


      <tbody className="divide-y divide-gray-100">

        {detailStock.map((s, i) => {

          const loc = locations.find(
            l => l.id === s.locationId
          );

          return (

            <tr
              key={i}
              className="hover:bg-gray-50/70 transition-colors"
            >

              <td className="px-4 py-3">

                <div className="font-semibold text-sm text-[#093C5D]">
                  {loc?.name ?? s.locationId}
                </div>

                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                  {loc?.code}
                </div>

              </td>


              <td className="px-4 py-3 text-right">

                <span className="inline-flex min-w-[54px] justify-end text-sm font-bold text-[#093C5D] tabular-nums">
                  {formatNumber(s.quantity)}
                </span>

              </td>


              <td className="px-4 py-3">

                <span className="font-mono text-xs text-gray-600">
                  {s.batch ?? '—'}
                </span>

              </td>


              <td className="px-4 py-3">

                <span className="font-mono text-xs text-gray-600">
                  {s.serial ?? '—'}
                </span>

              </td>


              <td className="px-4 py-3 text-right">

                <span className="font-mono text-xs text-[#3B7597] tabular-nums">
                  {formatCurrency(s.avgCost)}
                </span>

              </td>

            </tr>

          );

        })}

      </tbody>

    </table>

  </div>
);
}
