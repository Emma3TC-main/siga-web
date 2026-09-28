import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useAuthorizations } from '../../hooks/useAuthorizations';
import { useMovements } from '../../hooks/useMovements';
import { useProducts } from '../../hooks/useProducts';
import { useLocations } from '../../hooks/useLocations';
import { useUsers } from '../../hooks/useUsers';
import { useUnits } from '../../hooks/useUnits';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { PageHeader, Tabs, EmptyState, ShieldIcon } from '../../components/ui';
import { hasPermission } from '../../../domain/rules/permissionRules';
import { countAuthorizationsByStatus, filterAuthorizationsByStatus } from '../../../domain/rules/authorizationRules';
import { resolveAuthorization } from './utils/resolveAuthorization';
import { AuthorizationCard } from './components/AuthorizationCard';
import { AuthorizationDetailModal } from './components/AuthorizationDetailModal';
import { RejectAuthorizationModal } from './components/RejectAuthorizationModal';
import { MfaConfirmModal } from './components/MfaConfirmModal';

export default function Authorizations() {
  const { state, navigate, showToast } = useApp();
  const { responsibles, currentUser, costCenters } = state;
  const { users } = useUsers();
  const { authorizations, resolveAuthorization: resolveRequest, verifyMfaCode } = useAuthorizations();
  const { movements, confirmMovement } = useMovements();
  const { products } = useProducts();
  const { locations } = useLocations();
  const { units } = useUnits();
  const [tab, setTab] = useState('pendiente');
  const [selectedAuth, setSelectedAuth] = useState<string | null>(null);
  const [viewAuthId, setViewAuthId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [mfaModal, setMfaModal] = useState(false);
  const [totp, setTotp] = useState('');
  const [totpError, setTotpError] = useState('');

  const canAuthorize = hasPermission(currentUser?.role, 'authorizations', 'authorize');

  const filtered = filterAuthorizationsByStatus(authorizations, tab);
  const counts = countAuthorizationsByStatus(authorizations);
  const lookupSources = { products, units, locations, responsibles, users, costCenters, movements };

  async function handleApprove(authId: string) {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    await resolveRequest(authId, true, currentUser?.id ?? 'u1');
    showToast('success', 'Movimiento autorizado. Aún no afecta stock: falta confirmarlo con MFA.');
    setSelectedAuth(null);
    setLoading(false);
  }

  async function handleReject() {
    if (!rejectReason.trim() || !selectedAuth) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    await resolveRequest(selectedAuth, false, currentUser?.id ?? 'u1', rejectReason);
    showToast('warning', 'Solicitud rechazada. El inventario no fue modificado.');
    setRejectModal(false);
    setSelectedAuth(null);
    setRejectReason('');
    setLoading(false);
  }

  async function handleMfaConfirm() {
    const auth = authorizations.find(item => item.id === selectedAuth);
    if (!auth) return;
    if (!(await verifyMfaCode(totp))) {
      setTotpError('Código inválido o vencido. Para esta demostración use 123456.');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    await confirmMovement(auth.movementId, currentUser?.id ?? 'u1');
    setLoading(false);
    setMfaModal(false);
    setSelectedAuth(null);
    setTotp('');
    setTotpError('');
  }

  // Datos completos para el modal de detalle (solo consulta; no altera el flujo de autorización).
  const viewAuth = authorizations.find(a => a.id === viewAuthId);
  const viewResolved = viewAuth ? resolveAuthorization(viewAuth, lookupSources) : undefined;

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
        {filtered.length === 0 && (
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
              canAuthorize={canAuthorize}
              loading={loading}
              onOpen={setSelectedAuth}
              onView={setViewAuthId}
              onApprove={handleApprove}
              onReject={id => { setSelectedAuth(id); setRejectModal(true); }}
              onConfirmMfa={id => { setSelectedAuth(id); setMfaModal(true); }}
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

      <MfaConfirmModal
        open={mfaModal}
        onClose={() => { setMfaModal(false); setTotp(''); setTotpError(''); }}
        totp={totp}
        totpError={totpError}
        onTotpChange={value => { setTotp(value); setTotpError(''); }}
        onConfirm={handleMfaConfirm}
        loading={loading}
      />

      {/* Detail modal — solo consulta, no cambia estados ni el flujo de autorización */}
      <AuthorizationDetailModal
        open={!!viewAuthId}
        onClose={() => setViewAuthId(null)}
        resolved={viewResolved}
      />
    </div>
  );
}
