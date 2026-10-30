import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { MovementTrendBucket } from '../../../../domain/entities/Reporting';

const chartData = (items: MovementTrendBucket[]) => items.map(item => ({
  ...item,
  period: new Intl.DateTimeFormat('es-PE', { month: 'short', day: '2-digit', timeZone: 'America/Lima' }).format(new Date(item.periodStart)),
}));

export function MovementTrendChart({ data }: { data: MovementTrendBucket[] }) {
  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <h3 className="font-semibold text-[#093C5D] font-display mb-5">Tendencia de movimientos</h3>
      {data.length === 0 ? (
        <div className="h-[230px] flex items-center justify-center text-sm text-gray-400">Sin movimientos confirmados para el período.</div>
      ) : (
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={chartData(data)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#EEF2F6" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#718096' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#718096' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #DDE3EA', fontSize: '12px' }} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Area type="monotone" dataKey="entries" name="Entradas" stroke="#3B7597" fill="#3B759733" strokeWidth={2} />
            <Area type="monotone" dataKey="exits" name="Salidas" stroke="#6FD1D7" fill="#6FD1D744" strokeWidth={2} />
            <Area type="monotone" dataKey="transfers" name="Transferencias" stroke="#64748B" fill="#64748B22" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
