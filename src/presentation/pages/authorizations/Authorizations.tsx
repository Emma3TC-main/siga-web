import { useEffect, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useAuthorizations } from '../../hooks/useAuthorizations';
import { useMovements } from '../../hooks/useMovements';
import { useProducts } from '../../hooks/useProducts';
import { useLocations } from '../../hooks/useLocations';
import { useUsers } from '../../hooks/useUsers';
import { useUnits } from '../../hooks/useUnits';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { PageHeader, Tabs, EmptyState, ShieldIcon } from '../../components/ui';
import { hasUserPermission } from '../../../domain/rules/permissionRules';
import { countAuthorizationsByStatus, filterAuthorizationsByStatus } from '../../../domain/rules/authorizationRules';
import { resolveAuthorization } from './utils/resolveAuthorization';
import { AuthorizationCard } from './components/AuthorizationCard';
import { AuthorizationDetailModal } from './components/AuthorizationDetailModal';
import { RejectAuthorizationModal } from './components/RejectAuthorizationModal';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { ApiError } from '../../../infrastructure/http/ApiClient';

function authorizationError(error: unknown): string {
  if (error instanceof ApiError && error.status === 403) {
    return 'La autorización requiere una sesión con OTP reciente. Vuelva a autenticarse e inténtelo otra vez.';
  }
  return getErrorMessage(error);
}

export default function Authorizations() {
  const { state, navigate, showToast } = useApp();
  const { responsibles, currentUser, costCenters } = state;
  const { users } = useUsers();
  const {
    authorizations,
    loading: listLoading,
    error: listError,
    getAuthorizationDetail,
    resolveAuthorization: resolveRequest,
  } = useAuthorizations();
  const { movements, confirmMovement } = useMovements();
  const { products } = useProducts();
  const { locations } = useLocations();
  const { units } = useUnits();
  const [tab, setTab] = useState('pendiente');
  const [selectedAuth, setSelectedAuth] = useState<string | null>(null);
  const [viewAuthId, setViewAuthId] = useState<string | null>(null);
  const [viewAuthorization, setViewAuthorization] = useState<(typeof authorizations)[number] | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  const canAuthorize = hasUserPermission(currentUser, 'authorizations', 'authorize');

  const filtered = filterAuthorizationsByStatus(authorizations, tab);
  const counts = countAuthorizationsByStatus(authorizations);
  const lookupSources = { products, units, locations, responsibles, users, costCenters, movements };

  useEffect(() => {
    if (!viewAuthId) {
      setViewAuthorization(null);
      setDetailError(null);
      setDetailLoading(false);
      return;
    }
    let active = true;
    setViewAuthorization(null);
    setDetailError(null);
    setDetailLoading(true);
    getAuthorizationDetail(viewAuthId)
      .then(detail => {
        if (!active) return;
        if (!detail) throw new Error('La autorización ya no está disponible.');
        setViewAuthorization(detail);
      })
      .catch(error => {
        if (active) setDetailError(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setDetailLoading(false);
      });
    return () => { active = false; };
  }, [getAuthorizationDetail, viewAuthId]);

  async function handleApprove(authId: string) {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      await resolveRequest(authId, true, currentUser?.id ?? 'u1');
      showToast('success', 'Movimiento autorizado. Aún no afecta stock: falta confirmarlo con MFA.');
      setSelectedAuth(null);
    } catch (error) {
      showToast('error', authorizationError(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim() || !selectedAuth) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      await resolveRequest(selectedAuth, false, currentUser?.id ?? 'u1', rejectReason);
      showToast('warning', 'Solicitud rechazada. El inventario no fue modificado.');
      setRejectModal(false);
      setSelectedAuth(null);
      setRejectReason('');
    } catch (error) {
      showToast('error', authorizationError(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(authId: string) {
    const auth = authorizations.find(item => item.id === authId);
    if (!auth) return;
    setLoading(true);
    try {
      await confirmMovement(auth.movementId, currentUser?.id ?? 'u1');
      showToast('success', 'Movimiento confirmado.');
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
      setSelectedAuth(null);
    }
  }

  // Datos completos para el modal de detalle (solo consulta; no altera el flujo de autorización).
  const viewResolved = viewAuthorization ? resolveAuthorization(viewAuthorization, lookupSources) : undefined;

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Autorizaciones" description="Autorice y confirme con MFA las operaciones sensibles"
        breadcrumbs={getBreadcrumbs('authorizations', navigate)}
      />

      {!canAuthorize && (
        <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2 text-sm text-blue-700">
          <ShieldIcon size={16} className="flex-shrink-0 mt-0.5" />
          <span>Su rol no tiene permisos para aprobar o rechazar autorizaciones. Solo puede consultar.</span>
        </div>
      )}

      <div className="px-6 pt-4">
        <Tabs active={tab} onChange={setTab} tabs={[
          { id: 'pendiente', label: 'Pendientes', count: counts.pendiente },
          { id: 'aprobado', label: 'Autorizadas', count: counts.aprobado },
          { id: 'rechazado', label: 'Rechazadas', count: counts.rechazado },
        ]} />
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6 mt-4">
        {listLoading && <div className="py-8 text-center text-sm text-gray-500">Cargando autorizaciones…</div>}
        {listError && <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">No se pudieron cargar las autorizaciones: {getErrorMessage(listError)}</div>}
        {!listLoading && !listError && filtered.length === 0 && (
          <EmptyState icon={<ShieldIcon size={48} />}
            title={tab === 'pendiente' ? 'No hay autorizaciones pendientes' : tab === 'aprobado' ? 'No hay operaciones autorizadas' : 'No hay autorizaciones rechazadas'}
            description={tab === 'pendiente' ? 'Todas las operaciones sensibles han sido procesadas' : undefined}
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(auth => (
            <AuthorizationCard
              key={auth.id}
              resolved={resolveAuthorization(auth, lookupSources)}
              canAuthorize={canAuthorize && auth.registeredBy !== currentUser?.id}
              loading={loading}
              onOpen={setSelectedAuth}
              onView={setViewAuthId}
              onApprove={handleApprove}
              onReject={id => { setSelectedAuth(id); setRejectModal(true); }}
              onConfirm={handleConfirm}
            />
          ))}
        </div>
      </div>

      <RejectAuthorizationModal
        open={rejectModal}
        onClose={() => setRejectModal(false)}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onConfirm={handleReject}
        loading={loading}
      />

      {/* Detail modal — solo consulta, no cambia estados ni el flujo de autorización */}
      <AuthorizationDetailModal
        open={!!viewAuthId}
        onClose={() => setViewAuthId(null)}
        resolved={viewResolved}
        loading={detailLoading}
        error={detailError}
      />
    </div>
  );
}
