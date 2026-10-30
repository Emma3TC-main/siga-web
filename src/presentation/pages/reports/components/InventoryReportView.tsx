import type { InventoryValuationItem } from '../../../../domain/entities/Reporting';
import { Badge, formatCurrency, formatNumber } from '../../../components/ui';

export function InventoryReportView({ rows }: { rows: InventoryValuationItem[] }) {
  if (rows.length === 0) return <div className="siga-card p-8 text-center text-sm text-gray-400">No hay saldos para los filtros seleccionados.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="siga-table">
        <thead><tr><th>SKU</th><th>Producto</th><th>Categoría</th><th>Ubicación</th><th className="text-right">Cantidad</th><th className="text-right">Costo promedio</th><th className="text-right">Valor PEN</th><th>Estado</th></tr></thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.stockBalanceId}>
              <td className="font-mono text-xs text-[#3B7597]">{row.sku}</td>
              <td className="font-medium text-sm">{row.name}</td>
              <td className="text-xs">{row.categoryName ?? row.categoryCode ?? '—'}</td>
              <td className="font-mono text-xs">{row.locationId}</td>
              <td className="text-right tabular-nums">{formatNumber(row.quantity)}</td>
              <td className="text-right tabular-nums">{formatCurrency(row.avgCostPen)}</td>
              <td className="text-right font-semibold tabular-nums">{formatCurrency(row.stockValuePen)}</td>
              <td><Badge variant={row.quantity === 0 ? 'error' : row.quantity < row.minStock ? 'warning' : 'success'}>{row.quantity === 0 ? 'Sin stock' : row.quantity < row.minStock ? 'Bajo mínimo' : 'Normal'}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
