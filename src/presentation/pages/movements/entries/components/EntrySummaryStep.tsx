import { useLocations } from '../../../../hooks/useLocations';
import { useProducts } from '../../../../hooks/useProducts';
import { useSuppliers } from '../../../../hooks/useSuppliers';
import { useUnits } from '../../../../hooks/useUnits';
import { formatCurrency, formatNumber } from '../../../../components/ui';
import type { DraftLine, EntryHeaderData } from '../hooks/useEntryForm';

export interface EntrySummaryStepProps {
  header: EntryHeaderData;
  lines: DraftLine[];
  totalCost: number;
  hasSensitiveLine: boolean;
  isExternalReceipt: boolean;
  supplierId: string;
}

export function EntrySummaryStep({ header, lines, totalCost, hasSensitiveLine, isExternalReceipt, supplierId }: EntrySummaryStepProps) {
  const { products } = useProducts();
  const { locations } = useLocations();
  const { units } = useUnits();
  const { suppliers } = useSuppliers();
  const supplier = isExternalReceipt && supplierId ? suppliers.find(sup => sup.id === supplierId) : undefined;

  const summaryFields: [string, string][] = [
    ['Documento', `${header.documentType} ${header.documentSeries}-${header.documentNumber}`],
    ['Ítems', String(lines.length)],
    ['Costo total', formatCurrency(totalCost)],
    ['Stock', hasSensitiveLine ? 'Sin cambios todavía' : 'Actualizar al confirmar'],
  ];

return (
  <div className="space-y-5">

    <div>
      <h3 className="font-semibold text-[#093C5D]">
        Resumen y control previo
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        Revise la cabecera y los {lines.length} detalles antes de confirmar.
      </p>
    </div>


    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

      {summaryFields.map(([label, value]) => (

        <div
          key={label}
          className="rounded-xl border border-[#093C5D]/10 bg-[#093C5D]/[0.03] p-4"
        >

          <div className="text-[10px] uppercase tracking-wide text-gray-400">
            {label}
          </div>

          <div className="text-sm font-semibold text-[#093C5D] mt-1">
            {value}
          </div>

        </div>

      ))}

    </div>


    {supplier && (

      <div className="flex gap-3 p-4 rounded-xl bg-[#093C5D]/[0.03] border border-[#093C5D]/10">

        <div className="text-xs font-medium text-gray-400 w-24 flex-shrink-0">
          Proveedor
        </div>

        <div className="min-w-0">

          <div className="font-semibold text-sm text-[#093C5D]">
            {supplier.name}
          </div>

          <div className="text-xs text-gray-400 font-mono mt-0.5">
            {supplier.code} · RUC {supplier.ruc}
          </div>

        </div>

      </div>

    )}


    {/* Desktop: table view */}
    <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">

      <table className="w-full min-w-[700px] border-collapse">

        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              #
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Producto
            </th>

            <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Cantidad
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Destino
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Trazabilidad
            </th>

            <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Subtotal
            </th>

          </tr>
        </thead>


        <tbody className="divide-y divide-gray-100">

          {lines.map((line, index) => {

            const product = products.find(
              item => item.id === line.productId
            );

            const unit = units.find(
              item => item.id === line.unitId
            );

            return (

              <tr
                key={line.id}
                className="hover:bg-gray-50/70 transition-colors"
              >

                <td className="px-4 py-3">
                  <span className="text-xs font-semibold text-gray-400">
                    {index + 1}
                  </span>
                </td>


                <td className="px-4 py-3">

                  <div className="font-semibold text-sm text-[#093C5D]">
                    {product?.name}
                  </div>

                  <div className="text-xs font-mono text-gray-400 mt-0.5">
                    {product?.sku}
                  </div>

                </td>


                <td className="px-4 py-3 text-right">

                  <span className="text-sm font-semibold text-[#093C5D] tabular-nums">
                    {formatNumber(Number(line.quantity))} {unit?.code}
                  </span>

                </td>


                <td className="px-4 py-3">

                  <span className="text-xs text-gray-600">
                    {
                      locations.find(
                        item => item.id === line.locationId
                      )?.name
                    }
                  </span>

                </td>


                <td className="px-4 py-3">

                  <span className="text-xs text-gray-500">
                    {line.batch || line.serial || line.expiryDate || 'No aplica'}
                  </span>

                </td>


                <td className="px-4 py-3 text-right">

                  <span className="text-xs font-semibold text-[#3B7597] tabular-nums">
                    {formatCurrency(
                      Number(line.quantity) *
                      (
                        Number(line.unitCost) ||
                        product?.avgCost ||
                        0
                      )
                    )}
                  </span>

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>


    {/* Mobile: card list */}
    <div className="md:hidden space-y-3">

      {lines.map((line, index) => {

        const product = products.find(
          item => item.id === line.productId
        );

        const unit = units.find(
          item => item.id === line.unitId
        );

        const subtotal =
          Number(line.quantity) *
          (
            Number(line.unitCost) ||
            product?.avgCost ||
            0
          );

        return (

          <div
            key={line.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm p-4"
          >

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Ítem {index + 1}
                </span>

                <div className="font-semibold text-sm text-[#093C5D] mt-0.5">
                  {product?.name}
                </div>

                <div className="text-xs text-gray-400 font-mono mt-0.5">
                  {product?.sku}
                </div>

              </div>


              <div className="text-right flex-shrink-0">

                <div className="font-semibold text-sm text-[#093C5D]">
                  {formatCurrency(subtotal)}
                </div>

                <div className="text-xs text-gray-400 mt-0.5">
                  {formatNumber(Number(line.quantity))} {unit?.code}
                </div>

              </div>

            </div>


            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">

              {
                locations.find(
                  item => item.id === line.locationId
                )?.name ?? '—'
              }

              {(line.batch || line.serial)
                ? ` · ${line.batch || line.serial}`
                : ''}

            </div>

          </div>

        );

      })}

    </div>


    <div
      className={`
        flex items-start gap-3
        p-4
        border
        rounded-xl
        text-sm
        ${
          hasSensitiveLine
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }
      `}
    >

      <div
        className={`
          w-2.5 h-2.5
          rounded-full
          mt-1
          flex-shrink-0
          ${
            hasSensitiveLine
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }
        `}
      />

      <div>
        {hasSensitiveLine
          ? 'Hay un producto sensible: el movimiento quedará PENDIENTE_AUTORIZACION y el stock no cambiará hasta la confirmación con MFA.'
          : 'Operación estándar: el stock y el costo promedio ponderado se actualizarán al confirmar.'}
      </div>

    </div>

  </div>
);
}
