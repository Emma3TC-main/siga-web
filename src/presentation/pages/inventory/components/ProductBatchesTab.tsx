import type { StockEntry } from '../../../../domain/entities/Stock';
import { EXPIRY_WARNING_DAYS, daysUntilExpiry } from '../../../../domain/rules/inventoryRules';
import { Badge, formatNumber } from '../../../components/ui';

interface ProductBatchesTabProps {
  detailStock: StockEntry[];
}

export function ProductBatchesTab({ detailStock }: ProductBatchesTabProps) {
  const batches = detailStock.filter(s => s.batch);
  return (
    <table className="siga-table">
      <thead><tr><th>Lote/Colada</th><th>Vencimiento</th><th className="text-right">Cantidad</th><th>Estado</th></tr></thead>
      <tbody>
        {batches.map((s, i) => {
          const days = s.expiryDate ? daysUntilExpiry(s.expiryDate) : null;
          const expStatus = days === null ? 'N/A' : days < 0 ? 'Vencido' : days <= EXPIRY_WARNING_DAYS ? 'Próx. vencer' : 'Vigente';
          return (
            <tr key={i}>
              <td className="font-mono text-sm">{s.batch}</td>
              <td className="text-sm">{s.expiryDate ?? '—'}</td>
              <td className="text-right font-bold text-[#093C5D]">{formatNumber(s.quantity)}</td>
              <td><Badge variant={expStatus === 'Vencido' ? 'error' : expStatus === 'Próx. vencer' ? 'warning' : 'success'}>{expStatus}</Badge></td>
            </tr>
          );
        })}
        {batches.length === 0 && <tr><td colSpan={4} className="text-center text-gray-400 py-4">Sin lotes registrados</td></tr>}
      </tbody>
    </table>
  );
}
