import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MovementFlowPeriod } from '../../../../domain/entities/ReportSeries';
import { formatCurrency } from '../../../components/ui';

interface MovementFlowReportViewProps {
  flowData: MovementFlowPeriod[];
}

export function MovementFlowReportView({ flowData }: MovementFlowReportViewProps) {
  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={flowData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
          <XAxis dataKey="period" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #DDE3EA', fontSize: '12px' }} />
          <Bar dataKey="entradas" name="Entradas" fill="#3B7597" radius={[4, 4, 0, 0]} />
          <Bar dataKey="salidas" name="Salidas" fill="#6FD1D7" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <table className="siga-table">
        <thead><tr><th>Período</th><th className="text-right">N° Entradas</th><th className="text-right">N° Salidas</th><th className="text-right">Valor entradas</th><th className="text-right">Valor salidas</th></tr></thead>
        <tbody>
          {flowData.map((r, i) => (
            <tr key={i}>
              <td className="font-medium">{r.period}</td>
              <td className="text-right text-emerald-600 font-semibold tabular-nums">{r.entradas}</td>
              <td className="text-right text-red-500 font-semibold tabular-nums">{r.salidas}</td>
              <td className="text-right font-mono tabular-nums">{formatCurrency(r.valor_ent)}</td>
              <td className="text-right font-mono tabular-nums">{formatCurrency(r.valor_sal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
