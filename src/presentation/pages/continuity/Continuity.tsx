import { useApp } from '../../state/AppContext';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Badge, Button, CheckIcon, PageHeader, RefreshIcon, ServerIcon } from '../../components/ui';

const CHECKS = [
  { name: 'Aplicación web y API', target: 'RTO ≤ 4 h', value: 'Operativo', ok: true },
  { name: 'Base de datos PostgreSQL', target: 'RPO ≤ 15 min', value: 'Réplica al día', ok: true },
  { name: 'Evidencias MinIO / GCS', target: 'RPO ≤ 24 h', value: 'Último backup 08:00', ok: true },
  { name: 'Cola de sincronización móvil', target: 'Reintento automático', value: '2 pendientes', ok: true },
];

export default function Continuity() {
  const { navigate, showToast } = useApp();
  return <div className="flex flex-col h-full">
    <PageHeader title="Continuidad operacional" description="Salud, respaldo y recuperación del servicio SIGA"
      breadcrumbs={getBreadcrumbs('continuity', navigate)}
      actions={<Button variant="outline" size="sm" icon={<RefreshIcon size={14} />} onClick={() => showToast('success', 'Prueba de continuidad ejecutada: todos los controles responden.')}>Ejecutar prueba</Button>}
    />
    <div className="p-4 sm:p-6 flex-1 overflow-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[['Disponibilidad', '99.98%', 'Últimos 30 días'], ['Último respaldo', '08:00', 'Verificado'], ['Incidentes abiertos', '0', 'Sin afectación']].map(([label, value, hint]) => <div key={label} className="siga-card p-5"><div className="text-xs uppercase tracking-wide text-gray-400">{label}</div><div className="text-2xl font-bold text-[#093C5D] mt-1">{value}</div><div className="text-xs text-emerald-600 mt-1">{hint}</div></div>)}
      </div>
      <section className="siga-card overflow-hidden"><div className="p-5 border-b border-gray-100 flex items-center gap-2"><ServerIcon size={18} className="text-[#3B7597]" /><h2 className="font-semibold text-[#093C5D]">Controles de recuperación</h2></div>
        <div className="divide-y divide-gray-100">{CHECKS.map(check => <div key={check.name} className="p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"><div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckIcon size={15} /></div><div className="flex-1"><div className="font-medium text-sm text-[#093C5D]">{check.name}</div><div className="text-xs text-gray-400">Objetivo: {check.target}</div></div><Badge variant="success">{check.value}</Badge></div>)}</div>
      </section>
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800"><strong>Modo degradado móvil:</strong> si se pierde conexión, las operaciones se conservan localmente como borrador. La confirmación de stock ocurre solo al sincronizar con el servidor, evitando actualizaciones optimistas sensibles.</div>
    </div>
  </div>;
}
