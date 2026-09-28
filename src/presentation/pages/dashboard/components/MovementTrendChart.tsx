import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '../../../components/ui';
import { MOVEMENT_TREND } from '../constants';

export function MovementTrendChart() {
  return (
    <div className="lg:col-span-2 siga-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#093C5D] font-display">Tendencia de movimientos</h3>
        <Badge variant="info">Últimos 6 meses</Badge>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={MOVEMENT_TREND}>
          <defs>
            <linearGradient id="entradas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B7597" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3B7597" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="salidas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6FD1D7" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6FD1D7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#718096' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#718096' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #DDE3EA', fontSize: '12px' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
          <Area type="monotone" dataKey="entradas" name="Entradas" stroke="#3B7597" fill="url(#entradas)" strokeWidth={2} dot={{ r: 3, fill: '#3B7597' }} />
          <Area type="monotone" dataKey="salidas" name="Salidas" stroke="#6FD1D7" fill="url(#salidas)" strokeWidth={2} dot={{ r: 3, fill: '#6FD1D7' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
