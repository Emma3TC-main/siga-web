import type { InventoryReportRow } from '../../../../domain/rules/reportRules';
import { valuationByType, valuationSharePercent } from '../../../../domain/rules/reportRules';
import { formatCurrency, formatNumber } from '../../../components/ui';

interface ValuationReportViewProps {
  inventoryData: InventoryReportRow[];
  totalValuation: number;
}

export function ValuationReportView({ inventoryData, totalValuation }: ValuationReportViewProps) {
  const topRows = [...inventoryData].sort((a, b) => b.valuation - a.valuation).slice(0, 20);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {['material', 'insumo', 'repuesto'].map(type => {
          const typePct = valuationSharePercent(inventoryData, type);
          const typeVal = valuationByType(inventoryData, type);
          return (
            <div key={type} className="siga-card p-4">
              <div className="text-xs text-gray-400 capitalize mb-1">{type}s</div>
              <div className="text-lg font-bold text-[#093C5D]">{formatCurrency(typeVal)}</div>
              <div className="text-xs text-[#3B7597]">{typePct}% del total</div>
            </div>
          );
        })}
        <div className="siga-card p-4 bg-[#093C5D]/3 border-[#093C5D]/20">
          <div className="text-xs text-gray-400 mb-1">TOTAL</div>
          <div className="text-lg font-bold text-[#093C5D]">{formatCurrency(totalValuation)}</div>
        </div>
      </div>
      <table className="siga-table">
        <thead><tr><th>SKU</th><th>Producto</th><th className="text-right">Cantidad</th><th className="text-right">C. Promedio</th><th className="text-right">Valorización</th><th className="text-right">% del total</th></tr></thead>
        <tbody>
          {topRows.map(r => (
            <tr key={r.id}>
              <td className="font-mono text-xs text-[#3B7597]">{r.sku}</td>
              <td className="font-medium text-sm max-w-[220px] truncate">{r.name}</td>
              <td className="text-right tabular-nums">{formatNumber(r.qty)}</td>
              <td className="text-right font-mono text-xs tabular-nums">{formatCurrency(r.avgCost)}</td>
              <td className="text-right font-bold text-[#093C5D] tabular-nums">{formatCurrency(r.valuation)}</td>
              <td className="text-right text-xs text-gray-500 tabular-nums">{totalValuation > 0 ? ((r.valuation / totalValuation) * 100).toFixed(1) : 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
