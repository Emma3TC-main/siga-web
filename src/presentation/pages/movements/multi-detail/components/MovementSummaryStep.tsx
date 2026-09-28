import { useLocations } from '../../../../hooks/useLocations';
import { useProducts } from '../../../../hooks/useProducts';
import { useUnits } from '../../../../hooks/useUnits';
import { formatCurrency, formatNumber } from '../../../../components/ui';
import type { MovementType } from '../../../../../domain/entities/Movement';
import type { DraftLine } from '../hooks/useMultiDetailForm';

export interface MovementSummaryStepProps {
  lines: DraftLine[];
  effectiveType: MovementType;
  totalCost: number;
  sensitive: boolean;
  currentAverageCost: (productId: string) => number;
}

export function MovementSummaryStep({ lines, effectiveType, totalCost, sensitive, currentAverageCost }: MovementSummaryStepProps) {
  const { products } = useProducts();
  const { locations } = useLocations();
  const { units } = useUnits();

  const summaryFields: [string, string][] = [
    ['Tipo', effectiveType.replace('_', ' ')],
    ['Ítems', String(lines.length)],
    ['Valor', formatCurrency(totalCost)],
    ['Resultado', sensitive ? 'Requiere autorización' : 'Confirmación inmediata'],
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-[#093C5D]">Resumen y control de dominio</h3>
        <p className="text-xs text-gray-500 mt-1">Se volverá a validar el stock al confirmar para detectar concurrencia.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryFields.map(([label, value]) => (
          <div key={label} className="p-3 rounded-lg bg-[#093C5D]/3 border border-[#093C5D]/10">
            <div className="text-[10px] uppercase text-gray-400">{label}</div>
            <div className="text-sm font-semibold text-[#093C5D] mt-1 capitalize">{value}</div>
          </div>
        ))}
      </div>

      {/* Desktop: table view */}
      <div className="hidden md:block siga-card overflow-auto">
        <table className="siga-table min-w-[720px]">
          <thead><tr><th>#</th><th>Producto</th><th className="text-right">Cantidad</th><th>Origen</th><th>Destino</th><th className="text-right">Valor</th></tr></thead>
          <tbody>
            {lines.map((line, index) => {
              const product = products.find(item => item.id === line.productId);
              return (
                <tr key={line.id}>
                  <td>{index + 1}</td>
                  <td>{product?.name}</td>
                  <td className="text-right">{formatNumber(Number(line.quantity))} {units.find(unit => unit.id === line.unitId)?.code}</td>
                  <td>{locations.find(location => location.id === line.fromLocationId)?.name ?? '—'}</td>
                  <td>{locations.find(location => location.id === line.toLocationId)?.name ?? '—'}</td>
                  <td className="text-right">{formatCurrency(Number(line.quantity) * currentAverageCost(line.productId))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list — mirrors the pattern already used in EntrySummaryStep */}
      <div className="md:hidden space-y-2">
        {lines.map((line, index) => {
          const product = products.find(item => item.id === line.productId);
          const unit = units.find(item => item.id === line.unitId);
          const value = Number(line.quantity) * currentAverageCost(line.productId);
          return (
            <div key={line.id} className="siga-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Ítem {index + 1}</span>
                  <div className="font-semibold text-sm text-[#093C5D]">{product?.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{formatCurrency(value)}</div>
                  <div className="text-xs text-gray-400">{formatNumber(Number(line.quantity))} {unit?.code}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {locations.find(location => location.id === line.fromLocationId)?.name ?? '—'} → {locations.find(location => location.id === line.toLocationId)?.name ?? '—'}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`p-3 rounded-lg border text-sm ${sensitive ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
        {sensitive
          ? 'El movimiento quedará PENDIENTE_AUTORIZACION. No se modificará el inventario hasta autorización y confirmación MFA.'
          : 'El movimiento se confirmará aplicando todas las líneas en una sola operación lógica.'}
      </div>
    </div>
  );
}
