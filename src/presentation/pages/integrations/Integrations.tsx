import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { PageHeader, Badge, Button } from '../../components/ui';

const INTEGRATIONS = [
  { id: 'bi', name: 'Power BI', description: 'Conexión para reportes ejecutivos y dashboards analíticos avanzados', status: 'activo', type: 'BI', lastSync: '2026-08-24 08:00', icon: '📊' },
  { id: 'erp', name: 'ERP Corporativo', description: 'Sincronización bidireccional con el sistema ERP de la empresa', status: 'activo', type: 'ERP', lastSync: '2026-08-24 07:45', icon: '🏢' },
  { id: 'storage', name: 'MinIO / Google Cloud Storage', description: 'Almacenamiento compatible con S3 para evidencias y documentos de soporte', status: 'activo', type: 'Storage', lastSync: '2026-08-24 08:00', icon: '☁️' },
  { id: 'sap', name: 'SAP MM', description: 'Integración con módulo de materiales SAP para órdenes de compra', status: 'inactivo', type: 'ERP', lastSync: '2026-07-10 14:00', icon: '⚙️' },
  { id: 'email', name: 'SMTP / Notificaciones', description: 'Envío de alertas, autorizaciones y reportes por correo electrónico', status: 'activo', type: 'Comunicación', lastSync: '2026-08-24 08:00', icon: '✉️' },
  { id: 'api', name: 'API REST Externa', description: 'Endpoint público para sistemas de terceros autorizados', status: 'pendiente', type: 'API', lastSync: '—', icon: '🔌' },
];

export default function Integrations() {
  const { navigate, showToast } = useApp();
  const [syncing, setSyncing] = useState<string | null>(null);

  async function handleSync(id: string) {
    setSyncing(id);
    await new Promise(r => setTimeout(r, 1400));
    setSyncing(null);
    showToast('success', 'Sincronización completada correctamente.');
  }

  const statusVariant = (s: string) => s === 'activo' ? 'success' : s === 'inactivo' ? 'error' : 'warning';

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Integraciones" description="Estado de conexiones con sistemas externos"
        breadcrumbs={getBreadcrumbs('integrations', navigate)}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {INTEGRATIONS.map(intg => (
            <div key={intg.id} className="siga-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">{intg.icon}</div>
                  <div>
                    <div className="font-bold text-[#093C5D]">{intg.name}</div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#093C5D]/10 text-[#093C5D]">{intg.type}</span>
                  </div>
                </div>
                <Badge variant={statusVariant(intg.status) as any} dot>
                  {intg.status === 'activo' ? 'Activo' : intg.status === 'inactivo' ? 'Inactivo' : 'Pendiente'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mb-4">{intg.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">Última sync: <span className="font-mono">{intg.lastSync}</span></div>
                {intg.status === 'activo' && (
                  <Button variant="outline" size="sm" onClick={() => handleSync(intg.id)} loading={syncing === intg.id}>
                    {syncing === intg.id ? 'Sincronizando...' : 'Sincronizar'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
