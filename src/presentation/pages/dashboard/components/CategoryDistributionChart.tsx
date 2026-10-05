import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS, CATEGORY_DIST } from '../constants';

export function CategoryDistributionChart() {
  return (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">

    <div className="flex items-center justify-between mb-4">

      <h3 className="font-semibold text-[#093C5D] font-display">
        Distribución por categoría
      </h3>

      <div className="text-[10px] text-gray-400 uppercase tracking-wide">
        Total
      </div>

    </div>


    <div className="relative">

      <ResponsiveContainer width="100%" height={180}>

        <PieChart>

          <Pie
            data={CATEGORY_DIST}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            dataKey="value"
            paddingAngle={4}
            stroke="none"
          >

            {CATEGORY_DIST.map((_, i) => (

              <Cell
                key={i}
                fill={CHART_COLORS[i % CHART_COLORS.length]}
              />

            ))}

          </Pie>


          <Tooltip
            formatter={(v) => [`${v}%`, '']}
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid #DDE3EA',
              boxShadow: '0 6px 18px rgba(9, 60, 93, 0.08)',
              fontSize: '11px',
              backgroundColor: '#FFFFFF'
            }}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>


    <div className="space-y-2 mt-1">

      {CATEGORY_DIST.map((item, i) => (

        <div
          key={i}
          className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >

          <div className="flex items-center gap-2">

            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                background: CHART_COLORS[i % CHART_COLORS.length]
              }}
            />

            <span className="text-xs text-gray-600 truncate">
              {item.name}
            </span>

          </div>


          <span className="text-xs font-semibold text-[#093C5D]">
            {item.value}%
          </span>

        </div>

      ))}

    </div>

  </div>
);
}
