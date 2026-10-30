import type { MovementReportItem } from '../../../../domain/entities/Reporting';
import { Badge, formatCurrency } from '../../../components/ui';

const typeLabel: Record<string, string> = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
  TRANSFER: 'Transferencia',
  ADJUST_POSITIVE: 'Ajuste positivo',
  ADJUST_NEGATIVE: 'Ajuste negativo',
};

export function MovementFlowReportView({ rows }: { rows: MovementReportItem[] }) {
  if (rows.length === 0) return <div className="siga-card p-8 text-center text-sm text-gray-400">No hay movimientos confirmados para el período.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="siga-table">
        <thead><tr><th>Fecha</th><th>Código</th><th>Tipo</th><th>Centro de costo</th><th className="text-right">Costo base</th><th>Sensible</th></tr></thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.movementId}>
              <td className="text-xs">{new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Lima' }).format(new Date(row.confirmedAt))}</td>
              <td className="font-mono text-xs text-[#3B7597]">{row.movementCode}</td>
              <td>{typeLabel[row.movementType] ?? row.movementType}</td>
              <td>{row.costCenterNameSnapshot ?? row.costCenterCode ?? '—'}</td>
              <td className="text-right font-semibold tabular-nums">{formatCurrency(row.totalBaseCostPen)}</td>
              <td><Badge variant={row.sensitive ? 'warning' : 'muted'}>{row.sensitive ? 'Sí' : 'No'}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
