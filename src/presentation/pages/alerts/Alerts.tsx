import { useEffect } from 'react';
import { useApp } from '../../state/AppContext';
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
  MOVEMENT_CONFIRMED: 'Movimiento confirmado',
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
  MOVEMENT_CONFIRMED: 'info',
};
const SEVERITY_LABELS: Record<string, string> = {
  critical: 'Crítica',
  warning: 'Advertencia',
  info: 'Informativa',
  CRITICAL: 'Crítica',
  WARNING: 'Advertencia',
  INFO: 'Informativa',
};

function formatNotificationDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function Alerts() {
  const { state, navigate, markAlertRead, refreshNotifications } = useApp();
  const { alerts, unreadNotificationCount, notificationsLoading, notificationError } = state;

  const { unread, read } = splitAlertsByRead(alerts);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Centro de Alertas" description={`${unreadNotificationCount ?? '—'} notificaciones sin leer`}
        breadcrumbs={getBreadcrumbs('alerts', navigate)}
        actions={unread.length > 0 ? <Button variant="outline" size="sm" onClick={() => unread.forEach(a => markAlertRead(a.id))}>Marcar todas como leídas</Button> : undefined}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {notificationsLoading && alerts.length === 0 && (
          <div className="siga-card p-6 text-sm text-gray-500">Cargando notificaciones…</div>
        )}

        {notificationError && (
          <div className="siga-card p-6 border-l-4 border-red-400 text-sm text-red-700">
            No se pudieron cargar las notificaciones. Se reintentará automáticamente.
          </div>
        )}

        {unread.length > 0 && (
          <div>
            <h3 className="font-semibold text-[#093C5D] mb-3">Sin leer ({unread.length})</h3>
            <div className="space-y-3">
              {unread.map(alert => (
                  <div key={alert.id} className={`siga-card p-4 border-l-4 ${alert.severity === 'CRITICAL' ? 'border-red-400' : alert.severity === 'WARNING' ? 'border-amber-400' : 'border-[#6FD1D7]'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : alert.severity === 'WARNING' ? 'bg-amber-100 text-amber-600' : 'bg-[#6FD1D7]/20 text-[#3B7597]'}`}>
                          <AlertIcon size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={TYPE_COLORS[alert.type] ?? 'info'}>{TYPE_LABELS[alert.type] ?? alert.type}</Badge>
                            <Badge variant={alert.severity === 'CRITICAL' ? 'error' : alert.severity === 'WARNING' ? 'warning' : 'info'} dot>{SEVERITY_LABELS[alert.severity] ?? alert.severity}</Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                          <p className="text-sm text-gray-700">{alert.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{alert.referenceType}: {alert.referenceId}</p>
                          <p className="text-xs text-gray-300 mt-1">{formatNotificationDate(alert.createdAt)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => markAlertRead(alert.id)}>Marcar leída</Button>
                    </div>
                  </div>
              ))}
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
                    <Badge variant={TYPE_COLORS[alert.type] ?? 'info'}>{TYPE_LABELS[alert.type] ?? alert.type}</Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                    <span className="text-xs text-gray-300">{formatNotificationDate(alert.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!notificationsLoading && !notificationError && alerts.length === 0 && (
          <EmptyState icon={<BellIcon size={48} />} title="No hay notificaciones" description="No tienes notificaciones registradas" />
        )}
      </div>
    </div>
  );
}
