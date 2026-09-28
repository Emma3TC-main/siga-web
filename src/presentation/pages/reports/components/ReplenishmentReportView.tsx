import type { InventoryReportRow } from '../../../../domain/rules/reportRules';
import { Badge, formatNumber } from '../../../components/ui';

interface ReplenishmentReportViewProps {
  rows: InventoryReportRow[];
}

export function ReplenishmentReportView({ rows }: ReplenishmentReportViewProps) {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
        {rows.length} productos requieren reposición inmediata
      </div>
      <table className="siga-table">
        <thead><tr><th>SKU</th><th>Producto</th><th className="text-right">Stock actual</th><th className="text-right">Stock mínimo</th><th className="text-right">Diferencia</th><th className="text-center">Urgencia</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td className="font-mono text-xs text-[#3B7597]">{r.sku}</td>
              <td className="font-medium text-sm max-w-[220px] truncate">{r.name}</td>
              <td className="text-right font-bold text-red-600 tabular-nums">{formatNumber(r.qty)}</td>
              <td className="text-right text-gray-500 tabular-nums">{r.minStock}</td>
              <td className="text-right font-bold text-red-600 tabular-nums">−{formatNumber(r.minStock - r.qty)}</td>
              <td className="text-center"><Badge variant={r.qty === 0 ? 'error' : 'warning'}>{r.qty === 0 ? 'CRÍTICO' : 'Urgente'}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
