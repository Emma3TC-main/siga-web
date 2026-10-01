import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '../../../components/ui';
import { MOVEMENT_TREND } from '../constants';

export function MovementTrendChart() {
 return (
  <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-5">

    <div className="flex items-center justify-between mb-5">

      <div>
        <h3 className="font-semibold text-[#093C5D] font-display">
          Tendencia de movimientos
        </h3>
      </div>

      <Badge variant="info">
        Últimos 6 meses
      </Badge>

    </div>


    <div className="w-full h-[230px]">

      <ResponsiveContainer width="100%" height="100%">

        <AreaChart
          data={MOVEMENT_TREND}
          margin={{
            top: 10,
            right: 10,
            left: -10,
            bottom: 0
          }}
        >

          <defs>

            <linearGradient
              id="entradas"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#3B7597"
                stopOpacity={0.25}
              />
              <stop
                offset="95%"
                stopColor="#3B7597"
                stopOpacity={0.02}
              />
            </linearGradient>


            <linearGradient
              id="salidas"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#6FD1D7"
                stopOpacity={0.28}
              />
              <stop
                offset="95%"
                stopColor="#6FD1D7"
                stopOpacity={0.02}
              />
            </linearGradient>

          </defs>


          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#EEF2F6"
            vertical={false}
          />


          <XAxis
            dataKey="mes"
            tick={{
              fontSize: 11,
              fill: '#718096'
            }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />


          <YAxis
            tick={{
              fontSize: 11,
              fill: '#718096'
            }}
            axisLine={false}
            tickLine={false}
          />


          <Tooltip
            cursor={{
              stroke: '#DDE3EA',
              strokeDasharray: '4 4'
            }}
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid #DDE3EA',
              boxShadow: '0 6px 18px rgba(9, 60, 93, 0.08)',
              fontSize: '12px',
              backgroundColor: '#FFFFFF'
            }}
            labelStyle={{
              color: '#093C5D',
              fontWeight: 600
            }}
          />


          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '10px'
            }}
          />


          <Area
            type="monotone"
            dataKey="entradas"
            name="Entradas"
            stroke="#3B7597"
            fill="url(#entradas)"
            strokeWidth={2.5}
            dot={{
              r: 3,
              fill: '#3B7597',
              strokeWidth: 0
            }}
            activeDot={{
              r: 5,
              stroke: '#FFFFFF',
              strokeWidth: 2
            }}
          />


          <Area
            type="monotone"
            dataKey="salidas"
            name="Salidas"
            stroke="#6FD1D7"
            fill="url(#salidas)"
            strokeWidth={2.5}
            dot={{
              r: 3,
              fill: '#6FD1D7',
              strokeWidth: 0
            }}
            activeDot={{
              r: 5,
              stroke: '#FFFFFF',
              strokeWidth: 2
            }}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  </div>
);
}
