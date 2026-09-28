import type { StockEntry } from '../../../../domain/entities/Stock';
import type { Location } from '../../../../domain/entities/Location';
import { formatCurrency, formatNumber } from '../../../components/ui';

interface ProductLocationsTabProps {
  detailStock: StockEntry[];
  locations: Location[];
}

export function ProductLocationsTab({ detailStock, locations }: ProductLocationsTabProps) {
  return (
    <table className="siga-table">
      <thead><tr><th>Ubicación</th><th className="text-right">Cantidad</th><th>Lote</th><th>Serie</th><th>Costo prom.</th></tr></thead>
      <tbody>
        {detailStock.map((s, i) => {
          const loc = locations.find(l => l.id === s.locationId);
          return (
            <tr key={i}>
              <td className="font-medium">{loc?.name ?? s.locationId}<div className="text-xs text-gray-400 font-mono">{loc?.code}</div></td>
              <td className="text-right font-bold text-[#093C5D]">{formatNumber(s.quantity)}</td>
              <td className="font-mono text-xs">{s.batch ?? '—'}</td>
              <td className="font-mono text-xs">{s.serial ?? '—'}</td>
              <td className="font-mono text-xs">{formatCurrency(s.avgCost)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
