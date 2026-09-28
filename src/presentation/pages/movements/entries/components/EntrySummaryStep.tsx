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
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-[#093C5D]">Resumen y control previo</h3>
        <p className="text-xs text-gray-500 mt-1">Revise la cabecera y los {lines.length} detalles antes de confirmar.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryFields.map(([label, value]) => (
          <div key={label} className="p-3 rounded-lg bg-[#093C5D]/3 border border-[#093C5D]/10">
            <div className="text-[10px] uppercase text-gray-400">{label}</div>
            <div className="text-sm font-semibold text-[#093C5D] mt-1">{value}</div>
          </div>
        ))}
      </div>

      {supplier && (
        <div className="flex gap-3 p-3 rounded-xl bg-[#093C5D]/4 border border-[#093C5D]/10 text-sm">
          <div className="font-medium text-gray-400 w-24 flex-shrink-0">Proveedor</div>
          <div>
            <div className="font-semibold text-[#093C5D]">{supplier.name}</div>
            <div className="text-xs text-gray-400 font-mono">{supplier.code} · RUC {supplier.ruc}</div>
          </div>
        </div>
      )}

      {/* Desktop: table view */}
      <div className="hidden md:block siga-card overflow-auto">
        <table className="siga-table min-w-[700px]">
          <thead><tr><th>#</th><th>Producto</th><th className="text-right">Cantidad</th><th>Destino</th><th>Trazabilidad</th><th className="text-right">Subtotal</th></tr></thead>
          <tbody>
            {lines.map((line, index) => {
              const product = products.find(item => item.id === line.productId);
              const unit = units.find(item => item.id === line.unitId);
              return (
                <tr key={line.id}>
                  <td>{index + 1}</td>
                  <td><div className="font-medium">{product?.name}</div><div className="text-xs font-mono text-gray-400">{product?.sku}</div></td>
                  <td className="text-right">{formatNumber(Number(line.quantity))} {unit?.code}</td>
                  <td>{locations.find(item => item.id === line.locationId)?.name}</td>
                  <td className="text-xs">{line.batch || line.serial || line.expiryDate || 'No aplica'}</td>
                  <td className="text-right font-medium">{formatCurrency(Number(line.quantity) * (Number(line.unitCost) || product?.avgCost || 0))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden space-y-2">
        {lines.map((line, index) => {
          const product = products.find(item => item.id === line.productId);
          const unit = units.find(item => item.id === line.unitId);
          const subtotal = Number(line.quantity) * (Number(line.unitCost) || product?.avgCost || 0);
          return (
            <div key={line.id} className="siga-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Ítem {index + 1}</span>
                  <div className="font-semibold text-sm text-[#093C5D]">{product?.name}</div>
                  <div className="text-xs text-gray-400 font-mono">{product?.sku}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{formatCurrency(subtotal)}</div>
                  <div className="text-xs text-gray-400">{formatNumber(Number(line.quantity))} {unit?.code}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {locations.find(item => item.id === line.locationId)?.name ?? '—'}{(line.batch || line.serial) ? ` · ${line.batch || line.serial}` : ''}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`p-3 border rounded-lg text-sm ${hasSensitiveLine ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
        {hasSensitiveLine
          ? 'Hay un producto sensible: el movimiento quedará PENDIENTE_AUTORIZACION y el stock no cambiará hasta la confirmación con MFA.'
          : 'Operación estándar: el stock y el costo promedio ponderado se actualizarán al confirmar.'}
      </div>
    </div>
  );
}
