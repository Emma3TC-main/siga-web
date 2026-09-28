import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { useApp } from '../../state/AppContext';
import { useProducts } from '../../hooks/useProducts';
import { useMovements } from '../../hooks/useMovements';
import { useStock } from '../../hooks/useStock';
import { usePhysicalCounts } from '../../hooks/usePhysicalCounts';
import { useReportSeries } from '../../hooks/useReportSeries';
import { computeAnalyticsKpis } from '../../../domain/rules/analyticsRules';
import { getMachinery } from '../../../domain/rules/machineryRules';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { PageHeader, KpiCard, Badge, formatCurrency, formatNumber, BarChartIcon, TruckIcon, ActivityIcon, PackageIcon } from '../../components/ui';

const COLORS = ['#093C5D', '#3B7597', '#6FD1D7', '#5DF8D8', '#94a3b8'];

export default function Analytics() {
  const { navigate } = useApp();
  const { products } = useProducts();
  const { movements } = useMovements();
  const { stock } = useStock();
  const { physicalCounts } = usePhysicalCounts();
  const { reportSeries } = useReportSeries();

  const machinery = getMachinery(products);
  const {
    operativeMachinery: operative, totalMachinery, machineryAvailability: machineryAvail,
    totalStockValue: totalVal, consumedValue: consumed, rotation, countedItems, exactItems, ira,
    adjustmentsCount: adjustmentsLen, adjustmentRate: adjustRate, productsWithoutMovement: noMovement,
  } = computeAnalyticsKpis(products, stock, movements, physicalCounts);
  const adjustments = { length: adjustmentsLen };

  const machineryRadial = [
    { name: 'Operativo', value: machineryAvail, fill: '#5DF8D8' },
    { name: 'No operativo', value: 100 - machineryAvail, fill: '#e2e8f0' },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Indicadores Analíticos" description="KPIs operativos y tendencias del período"
        breadcrumbs={getBreadcrumbs('analytics', navigate)}
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Core KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="IRA — Exactitud inventario" value={`${ira}%`} icon={<ActivityIcon size={20} />}
            variant={ira >= 95 ? 'success' : ira >= 85 ? 'info' : 'warning'}
            trend={ira >= 95 ? 'up' : 'neutral'} trendLabel={`${exactItems}/${countedItems} ítems exactos`} />
          <KpiCard title="Rotación del inventario" value={rotation.toFixed(2)} unit="veces" icon={<PackageIcon size={20} />}
            variant="info" trend="up" trendLabel="vs período anterior" />
          <KpiCard title="Disponibilidad maquinaria" value={`${machineryAvail}%`} icon={<TruckIcon size={20} />}
            variant={machineryAvail >= 80 ? 'success' : 'warning'} trendLabel={`${operative}/${totalMachinery} operativos`} />
          <KpiCard title="Tasa de ajustes" value={`${adjustRate}%`} unit="del total" icon={<BarChartIcon size={20} />}
            variant={adjustRate < 5 ? 'success' : adjustRate < 10 ? 'warning' : 'error'} trendLabel={`${adjustments.length} ajustes`} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Trend */}
          <div className="lg:col-span-2 siga-card p-5">
            <h3 className="font-semibold text-[#093C5D] font-display mb-4">Tendencia mensual entradas vs salidas (S/)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={(reportSeries?.monthlyTrend ?? [])}>
                <defs>
                  <linearGradient id="e" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B7597" stopOpacity={0.25} /><stop offset="95%" stopColor="#3B7597" stopOpacity={0} /></linearGradient>
                  <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5DF8D8" stopOpacity={0.25} /><stop offset="95%" stopColor="#5DF8D8" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [formatCurrency(v as number), '']} contentStyle={{ borderRadius: '8px', border: '1px solid #DDE3EA', fontSize: '11px' }} />
                <Area type="monotone" dataKey="entradas" name="Entradas" stroke="#3B7597" fill="url(#e)" strokeWidth={2} dot={{ r: 3, fill: '#3B7597' }} />
                <Area type="monotone" dataKey="salidas" name="Salidas" stroke="#5DF8D8" fill="url(#s)" strokeWidth={2} dot={{ r: 3, fill: '#5DF8D8' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Machinery radial */}
          <div className="siga-card p-5 flex flex-col">
            <h3 className="font-semibold text-[#093C5D] font-display mb-4">Disponibilidad de maquinaria</h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <ResponsiveContainer width={180} height={180}>
                  <RadialBarChart innerRadius={50} outerRadius={80} data={machineryRadial} startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="value" cornerRadius={6} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-[#093C5D] font-display">{machineryAvail}%</div>
                  <div className="text-xs text-gray-400">disponible</div>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {[
                { label: 'Operativo', count: operative, color: '#5DF8D8' },
                { label: 'En mantenimiento', count: machinery.filter(m => m.machineryStatus === 'mantenimiento').length, color: '#D97706' },
                { label: 'Inoperativo', count: machinery.filter(m => m.machineryStatus === 'inoperativo').length, color: '#DC2626' },
                { label: 'En tránsito', count: machinery.filter(m => m.machineryStatus === 'transito').length, color: '#6FD1D7' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} /><span className="text-gray-600">{s.label}</span></div>
                  <span className="font-bold text-[#093C5D]">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category consumption */}
          <div className="siga-card p-5">
            <h3 className="font-semibold text-[#093C5D] font-display mb-4">Consumo por categoría</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={(reportSeries?.categoryConsumption ?? [])} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={4}>
                  {(reportSeries?.categoryConsumption ?? []).map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [formatCurrency(v as number), '']} contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {(reportSeries?.categoryConsumption ?? []).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} /><span>{item.name}</span></div>
                  <span className="font-semibold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Adjustment frequency */}
          <div className="siga-card p-5">
            <h3 className="font-semibold text-[#093C5D] font-display mb-4">Frecuencia de ajustes</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={(reportSeries?.adjustmentFrequency ?? [])}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="ajustes" name="Ajustes" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* KPI summary table */}
          <div className="siga-card p-5">
            <h3 className="font-semibold text-[#093C5D] font-display mb-4">Resumen de indicadores</h3>
            <div className="space-y-3">
              {[
                { label: 'IRA (Exactitud)', value: `${ira}%`, status: ira >= 95 ? 'success' : 'warning' },
                { label: 'Rotación inventario', value: `${rotation.toFixed(2)}x`, status: 'info' },
                { label: 'Disp. maquinaria', value: `${machineryAvail}%`, status: machineryAvail >= 80 ? 'success' : 'warning' },
                { label: 'Tasa ajustes', value: `${adjustRate}%`, status: adjustRate < 5 ? 'success' : 'warning' },
                { label: 'Sin movimiento', value: `${noMovement} productos`, status: 'muted' },
                { label: 'Total valorización', value: formatCurrency(totalVal), status: 'primary' },
                { label: 'Consumo período', value: formatCurrency(consumed), status: 'info' },
              ].map((kpi, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{kpi.label}</span>
                  <Badge variant={kpi.status as any}>{kpi.value}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
