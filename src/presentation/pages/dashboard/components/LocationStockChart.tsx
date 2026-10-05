import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LOCATION_STOCK } from '../constants';

export interface LocationStockChartProps {
  onViewDetail: () => void;
}

export function LocationStockChart({ onViewDetail }: LocationStockChartProps) {
  return (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">

    <div className="flex items-center justify-between mb-5">

      <h3 className="font-semibold text-[#093C5D] font-display">
        Inventario por ubicación
      </h3>

      <button
        onClick={onViewDetail}
        className="text-xs font-medium text-[#3B7597] hover:text-[#093C5D] transition-colors"
      >
        Ver detalle →
      </button>

    </div>


    <div className="w-full h-[165px]">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart
          data={LOCATION_STOCK}
          layout="vertical"
          margin={{
            top: 5,
            right: 15,
            left: 5,
            bottom: 0
          }}
        >

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#EEF2F6"
            horizontal={false}
          />

          <XAxis
            type="number"
            tick={{
              fontSize: 11,
              fill: '#718096'
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}%`}
          />

          <YAxis
            type="category"
            dataKey="name"
            tick={{
              fontSize: 11,
              fill: '#4A5568'
            }}
            axisLine={false}
            tickLine={false}
            width={95}
          />

          <Tooltip
            formatter={(v) => [`${v}%`, 'Participación']}
            cursor={{
              fill: '#F7FAFC'
            }}
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid #DDE3EA',
              boxShadow: '0 6px 18px rgba(9, 60, 93, 0.08)',
              fontSize: '11px',
              backgroundColor: '#FFFFFF'
            }}
            labelStyle={{
              color: '#093C5D',
              fontWeight: 600
            }}
          />

          <Bar
            dataKey="value"
            fill="#3B7597"
            radius={[0, 6, 6, 0]}
            barSize={14}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  </div>
);
}
