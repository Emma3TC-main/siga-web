import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS, CATEGORY_DIST } from '../constants';

export function CategoryDistributionChart() {
  return (
    <div className="siga-card p-5">
      <h3 className="font-semibold text-[#093C5D] font-display mb-4">Distribución por categoría</h3>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={CATEGORY_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
            {CATEGORY_DIST.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ borderRadius: '8px', border: '1px solid #DDE3EA', fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5 mt-2">
        {CATEGORY_DIST.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i] }} />
              <span className="text-xs text-gray-600">{item.name}</span>
            </div>
            <span className="text-xs font-semibold text-[#093C5D]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
