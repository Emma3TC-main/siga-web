import { useApp } from '../../state/AppContext';
import { useProducts } from '../../hooks/useProducts';
import { splitAlertsByRead } from '../../../domain/rules/alertRules';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Button, PageHeader, Badge, EmptyState, AlertIcon, BellIcon } from '../../components/ui';

const TYPE_LABELS: Record<string, string> = {
  sin_stock: 'Sin stock',
  bajo_minimo: 'Bajo mínimo',
  proximo_vencer: 'Próximo a vencer',
  vencido: 'Vencido',
  movimiento_sensible: 'Movimiento sensible',
  autorizacion_pendiente: 'Autorización pendiente',
  ajuste: 'Ajuste',
  maquinaria: 'Maquinaria',
};
const TYPE_COLORS: Record<string, 'error' | 'warning' | 'info' | 'primary'> = {
  sin_stock: 'error',
  bajo_minimo: 'warning',
  proximo_vencer: 'warning',
  vencido: 'error',
  movimiento_sensible: 'warning',
  autorizacion_pendiente: 'info',
  ajuste: 'primary',
  maquinaria: 'primary',
};
const SEVERITY_LABELS: Record<string, string> = {
  critical: 'Crítica',
  warning: 'Advertencia',
  info: 'Informativa',
};

export default function Alerts() {
  const { state, navigate, markAlertRead } = useApp();
  const { alerts } = state;
  const { products } = useProducts();

  const { unread, read } = splitAlertsByRead(alerts);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Centro de Alertas" description={`${unread.length} alertas sin leer`}
        breadcrumbs={getBreadcrumbs('alerts', navigate)}
        actions={unread.length > 0 ? <Button variant="outline" size="sm" onClick={() => unread.forEach(a => markAlertRead(a.id))}>Marcar todas como leídas</Button> : undefined}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {unread.length > 0 && (
          <div>
            <h3 className="font-semibold text-[#093C5D] mb-3">Sin leer ({unread.length})</h3>
            <div className="space-y-3">
              {unread.map(alert => {
                const prod = products.find(p => p.id === alert.productId);
                return (
                  <div key={alert.id} className={`siga-card p-4 border-l-4 ${alert.severity === 'critical' ? 'border-red-400' : alert.severity === 'warning' ? 'border-amber-400' : 'border-[#6FD1D7]'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${alert.severity === 'critical' ? 'bg-red-100 text-red-600' : alert.severity === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-[#6FD1D7]/20 text-[#3B7597]'}`}>
                          <AlertIcon size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={TYPE_COLORS[alert.type]}>{TYPE_LABELS[alert.type] ?? alert.type}</Badge>
                            <Badge variant={alert.severity === 'critical' ? 'error' : alert.severity === 'warning' ? 'warning' : 'info'} dot>{SEVERITY_LABELS[alert.severity] ?? alert.severity}</Badge>
                          </div>
                          <p className="text-sm text-gray-700">{alert.description}</p>
                          {prod && <p className="text-xs text-gray-400 mt-1">Producto: {prod.name} — {prod.sku}</p>}
                          <p className="text-xs text-gray-300 mt-1">{alert.createdAt}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => markAlertRead(alert.id)}>Marcar leída</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {read.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-400 mb-3">Leídas ({read.length})</h3>
            <div className="space-y-2">
              {read.map(alert => (
                <div key={alert.id} className="siga-card p-3 opacity-60">
                  <div className="flex items-center gap-3">
                    <Badge variant={TYPE_COLORS[alert.type]}>{TYPE_LABELS[alert.type] ?? alert.type}</Badge>
                    <p className="text-sm text-gray-600 flex-1">{alert.description}</p>
                    <span className="text-xs text-gray-300">{alert.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && <EmptyState icon={<BellIcon size={48} />} title="No hay alertas" description="El sistema no ha generado alertas" />}
      </div>
    </div>
  );
}
