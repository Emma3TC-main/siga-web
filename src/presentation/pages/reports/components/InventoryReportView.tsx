import type { InventoryReportRow } from '../../../../domain/rules/reportRules';
import { Badge, formatCurrency, formatNumber } from '../../../components/ui';

interface InventoryReportViewProps {
  rows: InventoryReportRow[];
  totalValuation: number;
}

export function InventoryReportView({ rows, totalValuation }: InventoryReportViewProps) {
  return (
    <table className="siga-table">
      <thead><tr><th>SKU</th><th>Producto</th><th>Categoría</th><th className="text-right">Stock</th><th>Unidad</th><th className="text-right">C. Promedio</th><th className="text-right">Valorización</th><th className="text-center">Estado</th></tr></thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td className="font-mono text-xs text-[#3B7597]">{r.sku}</td>
            <td className="font-medium text-sm max-w-[220px] truncate">{r.name}</td>
            <td className="text-xs max-w-[140px] truncate">{r.cat?.name}</td>
            <td className="text-right font-bold text-[#093C5D] tabular-nums">{formatNumber(r.qty)}</td>
            <td className="font-mono text-xs">{r.unit?.code}</td>
            <td className="text-right font-mono text-xs tabular-nums">{formatCurrency(r.avgCost)}</td>
            <td className="text-right font-semibold tabular-nums">{formatCurrency(r.valuation)}</td>
            <td className="text-center"><Badge variant={r.qty === 0 ? 'error' : r.qty < r.minStock ? 'warning' : 'success'} dot>{r.qty === 0 ? 'Sin stock' : r.qty < r.minStock ? 'Bajo mínimo' : 'Normal'}</Badge></td>
          </tr>
        ))}
      </tbody>
      <tfoot><tr><td colSpan={6} className="text-right font-bold text-[#093C5D] text-sm border-t border-gray-200">TOTAL INVENTARIO</td><td className="text-right font-bold text-[#093C5D] border-t border-gray-200 tabular-nums">{formatCurrency(totalValuation)}</td><td className="border-t border-gray-200" /></tr></tfoot>
    </table>
  );
}
