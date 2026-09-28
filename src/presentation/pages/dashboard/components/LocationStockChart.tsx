import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LOCATION_STOCK } from '../constants';

export interface LocationStockChartProps {
  onViewDetail: () => void;
}

export function LocationStockChart({ onViewDetail }: LocationStockChartProps) {
  return (
    <div className="siga-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#093C5D] font-display">Inventario por ubicación</h3>
        <button onClick={onViewDetail} className="text-xs text-[#3B7597] hover:underline">Ver detalle →</button>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={LOCATION_STOCK} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#718096' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#718096' }} axisLine={false} tickLine={false} width={90} />
          <Tooltip formatter={(v) => [`${v}%`, 'Participación']} contentStyle={{ borderRadius: '8px', border: '1px solid #DDE3EA', fontSize: '11px' }} />
          <Bar dataKey="value" fill="#3B7597" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
