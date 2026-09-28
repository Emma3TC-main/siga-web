import type { CostCenterConsumption } from '../../../../domain/rules/reportRules';
import { formatCurrency } from '../../../components/ui';

interface CostCenterReportViewProps {
  costCenterData: CostCenterConsumption[];
}

export function CostCenterReportView({ costCenterData }: CostCenterReportViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {costCenterData.slice(0, 3).map((cc, i) => (
          <div key={i} className="siga-card p-4">
            <div className="text-xs text-gray-400 mb-1">{cc.name}</div>
            <div className="text-xl font-bold text-[#093C5D]">{formatCurrency(cc.value)}</div>
            <div className="text-xs text-gray-400 mt-0.5">{cc.count} movimientos</div>
          </div>
        ))}
      </div>
      <table className="siga-table">
        <thead><tr><th>Centro de Costo</th><th className="text-right">N° Movimientos</th><th className="text-right">Valor consumido</th></tr></thead>
        <tbody>
          {costCenterData.map((cc, i) => (
            <tr key={i}>
              <td className="font-medium max-w-[240px] truncate">{cc.name}</td>
              <td className="text-right tabular-nums">{cc.count}</td>
              <td className="text-right font-semibold text-[#093C5D] tabular-nums">{formatCurrency(cc.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
