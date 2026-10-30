import type { MovementReportItem } from '../../../../domain/entities/Reporting';
import { Badge, formatCurrency } from '../../../components/ui';

export function AdjustmentReportView({ rows }: { rows: MovementReportItem[] }) {
  if (rows.length === 0) return <div className="siga-card p-8 text-center text-sm text-gray-400">No hay ajustes confirmados para el período.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="siga-table">
        <thead><tr><th>Fecha</th><th>Código</th><th>Tipo</th><th>Motivo</th><th className="text-right">Costo base</th><th>Autorización</th></tr></thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.movementId}>
              <td className="text-xs">{new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Lima' }).format(new Date(row.confirmedAt))}</td>
              <td className="font-mono text-xs text-[#3B7597]">{row.movementCode}</td>
              <td><Badge variant={row.movementType === 'ADJUST_POSITIVE' ? 'success' : 'warning'}>{row.movementType === 'ADJUST_POSITIVE' ? 'Positivo' : 'Negativo'}</Badge></td>
              <td>{row.reason ?? '—'}</td>
              <td className="text-right font-semibold tabular-nums">{formatCurrency(row.totalBaseCostPen)}</td>
              <td className="font-mono text-xs">{row.authorizedByUserId ?? 'No requerida'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
