import { useApp } from '../../state/AppContext';
import { useAuthorizations } from '../../hooks/useAuthorizations';
import { useUsers } from '../../hooks/useUsers';
import { useProducts } from '../../hooks/useProducts';
import { useMovements } from '../../hooks/useMovements';
import { useStock } from '../../hooks/useStock';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { countAuthorizationsByStatus, filterAuthorizationsByStatus } from '../../../domain/rules/authorizationRules';
import { Button, PageHeader, ShieldIcon, AlertIcon, BarChartIcon, CheckIcon, XIcon, formatCurrency, MovementStatusBadge } from '../../components/ui';
import { ActivityIcon } from '../../components/ui';
import { routePath } from '../../navigation/routeRegistry';

export default function SupervisorDashboard() {
  const { state, navigate, showToast } = useApp();
  const { authorizations, resolveAuthorization } = useAuthorizations();
  const { users } = useUsers();
  const { products } = useProducts();
  const { movements } = useMovements();
  const { stock } = useStock();
  const { alerts } = state;
  const reportFailure = (error: unknown) => showToast('error', getErrorMessage(error));
  const user = state.currentUser!;

  const pendingAuths = filterAuthorizationsByStatus(authorizations, 'pendiente');
  const { aprobado: approvedToday, rechazado: rejectedToday } = countAuthorizationsByStatus(authorizations);
  const sensitiveMovements = movements.filter(m => m.isSensitive).length;
  const unreadAlerts = alerts.filter(a => !a.read);
  const criticalAlerts = unreadAlerts.filter(a => a.severity === 'critical');
  const inventoryValue = stock.reduce((t, s) => t + s.quantity * s.avgCost, 0);
  const totalProducts = products.filter(p => p.status === 'active').length;
  const lowStock = products.filter(p => {
    const qty = stock.filter(s => s.productId === p.id).reduce((t, s) => t + s.quantity, 0);
    return qty <= p.minStock && qty > 0;
  }).length;
  const zeroStock = products.filter(p => {
    const qty = stock.filter(s => s.productId === p.id).reduce((t, s) => t + s.quantity, 0);
    return qty === 0;
  }).length;

  const recentMovements = movements
    .filter(m => m.isSensitive || m.status === 'pendiente_autorizacion')
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={`Supervisión — ${user.name} ${user.lastName}`}
        description="Supervisor de Almacén · Panel de control y autorizaciones"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <div className="p-4 sm:p-6 space-y-5">

        {/* Alertas críticas */}
        {criticalAlerts.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertIcon size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-800 text-sm">{criticalAlerts.length} alerta{criticalAlerts.length > 1 ? 's' : ''} crítica{criticalAlerts.length > 1 ? 's' : ''} activa{criticalAlerts.length > 1 ? 's' : ''}</div>
              <ul className="mt-1 space-y-0.5">
                {criticalAlerts.slice(0, 3).map(a => (
                  <li key={a.id} className="text-xs text-red-700">· {a.title}</li>
                ))}
              </ul>
            </div>
            <Button size="sm" variant="outline" className="ml-auto border-red-300 text-red-700 hover:bg-red-50" onClick={() => navigate(routePath('alerts'))}>
              Ver alertas
            </Button>
          </div>
        )}

        {/* KPIs de supervisión */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { value: String(pendingAuths.length), label: 'Autorizaciones pendientes', color: pendingAuths.length > 0 ? 'text-amber-600' : 'text-[#093C5D]', bg: pendingAuths.length > 0 ? 'bg-amber-50 border border-amber-200' : '' },
            { value: String(sensitiveMovements), label: 'Movimientos sensibles', color: 'text-[#093C5D]', bg: '' },
            { value: String(approvedToday), label: 'Aprobadas', color: 'text-emerald-600', bg: '' },
            { value: String(rejectedToday), label: 'Rechazadas', color: 'text-red-500', bg: '' },
          ].map(kpi => (
            <div key={kpi.label} className={`siga-card p-4 ${kpi.bg}`}>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-xs text-gray-400 mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Autorizaciones pendientes */}
        <section className="siga-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldIcon size={18} className="text-[#6FD1D7]" />
              <h2 className="font-semibold text-[#093C5D]">Autorizaciones pendientes</h2>
              {pendingAuths.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">{pendingAuths.length}</span>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate(routePath('authorizations'))}>Ver todas</Button>
          </div>
          {pendingAuths.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No hay autorizaciones pendientes</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingAuths.slice(0, 5).map(auth => {
                const product = products.find(p => p.id === auth.productId);
                const requester = users.find(u => u.id === auth.requesterId);
                return (
                  <div key={auth.id} className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <ShieldIcon size={16} className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[#093C5D] truncate">{auth.type}</div>
                      <div className="text-xs text-gray-400 truncate">
                        {product?.name ?? auth.productId} · {requester?.name} {requester?.lastName}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => resolveAuthorization(auth.id, true, user.id).catch(reportFailure)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <CheckIcon size={12} /> Aprobar
                      </button>
                      <button
                        onClick={() => resolveAuthorization(auth.id, false, user.id, 'Rechazado desde dashboard').catch(reportFailure)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <XIcon size={12} /> Rechazar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Indicadores operativos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="siga-card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChartIcon size={16} className="text-[#3B7597]" />
              <h2 className="font-semibold text-[#093C5D] text-sm">Indicadores operativos</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Valor total del inventario', value: formatCurrency(inventoryValue), bar: 100 },
                { label: 'Productos activos', value: String(totalProducts), bar: 80 },
                { label: 'Con stock bajo', value: String(lowStock), bar: lowStock / Math.max(totalProducts, 1) * 100, alert: lowStock > 0 },
                { label: 'Sin stock', value: String(zeroStock), bar: zeroStock / Math.max(totalProducts, 1) * 100, alert: zeroStock > 0 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">{item.label}</span>
                    <span className={`font-semibold ${item.alert ? 'text-amber-600' : 'text-[#093C5D]'}`}>{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.alert ? 'bg-amber-400' : 'bg-[#6FD1D7]'}`}
                      style={{ width: `${Math.min(item.bar, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => navigate(routePath('analytics'))}>
              Ver indicadores completos
            </Button>
          </section>

          <section className="siga-card overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <ActivityIcon size={16} className="text-[#3B7597]" />
              <h2 className="font-semibold text-[#093C5D] text-sm">Movimientos sensibles recientes</h2>
            </div>
            {recentMovements.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">Sin movimientos sensibles recientes</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentMovements.map(m => {
                  const product = products.find(p => p.id === m.productId);
                  return (
                    <div key={m.id} className="p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs text-[#093C5D] truncate">{product?.name ?? m.productId}</div>
                        <div className="text-[10px] text-gray-400">{m.type} · {m.quantity} uds · {m.createdAt.slice(0, 10)}</div>
                      </div>
                      <MovementStatusBadge status={m.status} />
                    </div>
                  );
                })}
              </div>
            )}
            <div className="p-3 border-t border-gray-100">
              <Button size="sm" variant="ghost" className="w-full" onClick={() => navigate(routePath('authorizations'))}>Ver autorizaciones</Button>
            </div>
          </section>
        </div>

        {/* Acciones rápidas */}
        <section className="siga-card p-4 sm:p-5">
          <h2 className="font-semibold text-[#093C5D] text-sm mb-3">Acciones de supervisión</h2>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => navigate(routePath('authorizations'))}>Revisar autorizaciones</Button>
            <Button size="sm" variant="outline" onClick={() => navigate(routePath('adjustments'))}>Ver ajustes</Button>
            <Button size="sm" variant="outline" onClick={() => navigate(routePath('analytics'))}>Indicadores operativos</Button>
            <Button size="sm" variant="outline" onClick={() => navigate(routePath('audit'))}>Auditoría</Button>
            <Button size="sm" variant="outline" onClick={() => navigate(routePath('reports'))}>Reportes</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
