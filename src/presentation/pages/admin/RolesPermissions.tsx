import { useMemo, useState } from 'react';
import { checkAdminMutationPreflight } from '../../../application/auth/adminMutationPreflight';
import type { AdminPermission, AdminRole } from '../../../domain/entities/AdminRole';
import { NotFoundError, ValidationError } from '../../../domain/errors';
import { ApiError } from '../../../infrastructure/http/ApiClient';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import {
  Badge,
  Button,
  EditIcon,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  PlusIcon,
  RefreshIcon,
  ShieldIcon,
  Spinner,
} from '../../components/ui';
import { useAdminRoles } from '../../hooks/useAdminRoles';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { useApp } from '../../state/AppContext';

const EMPTY_CREATE_FORM = { code: '', name: '', permissionIds: [] as string[] };
const ROLE_CODE_PATTERN = /^[A-Z][A-Z0-9_]{0,79}$/;

function shortId(value: string): string {
  return value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value;
}

function problemCode(error: ApiError): string | null {
  return typeof error.data?.code === 'string' ? error.data.code : null;
}

function listErrorMessage(error: unknown, resource: string): string | null {
  if (!error) return null;
  if (error instanceof ApiError && error.status === 401) return 'La sesión ya no es válida. Vuelve a iniciar sesión.';
  if (error instanceof ApiError && error.status === 403) return `No tienes el permiso ROLE_MANAGE para consultar ${resource}.`;
  return getErrorMessage(error);
}

function mutationErrorMessage(error: unknown): string {
  if (error instanceof ValidationError) return 'Revisa los datos ingresados.';
  if (error instanceof NotFoundError) return 'El rol o uno de los permisos ya no está disponible.';
  if (error instanceof ApiError) {
    const code = problemCode(error);
    if (error.status === 400 || code === 'VALIDATION_ERROR') return 'Revisa el código, nombre y permisos seleccionados.';
    if (error.status === 401 || code === 'AUTH_INVALID') return 'La sesión ya no es válida. Vuelve a iniciar sesión.';
    if (error.status === 403 || code === 'AUTH_FORBIDDEN') return 'No fue posible autorizar la operación. Verifica tus permisos o vuelve a iniciar sesión.';
    if (code === 'ROLE_NOT_FOUND') return 'El rol ya no está disponible.';
    if (code === 'PERMISSION_NOT_FOUND') return 'Uno de los permisos seleccionados ya no está disponible.';
    if (code === 'ROLE_PROTECTED') return 'El rol ADMIN está protegido y sus permisos no pueden reemplazarse.';
    if (code === 'ROLE_INACTIVE') return 'El rol está inactivo y no admite esta operación.';
    if (code === 'DATA_CONFLICT') return 'El código del rol o la asignación entra en conflicto con datos existentes.';
  }
  return getErrorMessage(error);
}

export default function RolesPermissions() {
  const { state, navigate, showToast, logout } = useApp();
  const currentUser = state.currentUser;
  const canManage = currentUser?.permissions?.includes('ROLE_MANAGE') ?? false;
  const {
    roles,
    permissions,
    rolesLoading,
    permissionsLoading,
    saving,
    rolesError,
    permissionsError,
    loadRoles,
    loadPermissions,
    loadLatestRole,
    createRole,
    replaceRolePermissions,
  } = useAdminRoles();

  const [createOpen, setCreateOpen] = useState(false);
  const [editorRole, setEditorRole] = useState<AdminRole | null>(null);
  const [editorLoading, setEditorLoading] = useState(false);
  const [reauthOpen, setReauthOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ ...EMPTY_CREATE_FORM });
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const permissionById = useMemo(
    () => new Map(permissions.map(permission => [permission.id, permission])),
    [permissions],
  );

  function requireFresh(): boolean {
    const result = checkAdminMutationPreflight(currentUser, ['ROLE_MANAGE']);
    if (result.allowed) return true;
    if (result.reason === 'REAUTHENTICATION_REQUIRED') setReauthOpen(true);
    else showToast('error', 'No tienes el permiso ROLE_MANAGE para realizar esta operación.');
    return false;
  }

  function openCreate() {
    setCreateForm({ ...EMPTY_CREATE_FORM, permissionIds: [] });
    setFormError(null);
    setCreateOpen(true);
  }

  async function submitCreate() {
    const code = createForm.code.trim();
    const name = createForm.name.trim();
    if (!ROLE_CODE_PATTERN.test(code)) {
      setFormError('El código debe iniciar con una letra mayúscula y contener solo A-Z, 0-9 o guion bajo (máximo 80).');
      return;
    }
    if (!name || name.length > 120) {
      setFormError('El nombre es obligatorio y admite hasta 120 caracteres.');
      return;
    }
    if (!requireFresh()) return;
    setFormError(null);
    try {
      await createRole({ code, name, permissionIds: createForm.permissionIds });
      setCreateOpen(false);
      setCreateForm({ ...EMPTY_CREATE_FORM, permissionIds: [] });
      showToast('success', 'Rol creado correctamente.');
    } catch (cause) {
      setFormError(mutationErrorMessage(cause));
    }
  }

  async function openPermissionEditor(role: AdminRole) {
    if (role.code === 'ADMIN') {
      showToast('error', 'El rol ADMIN está protegido por Identity.');
      return;
    }
    setEditorLoading(true);
    setFormError(null);
    try {
      const [latest] = await Promise.all([loadLatestRole(role.id), loadPermissions()]);
      setEditorRole(latest);
      setSelectedPermissionIds([...latest.permissionIds]);
    } catch (cause) {
      showToast('error', mutationErrorMessage(cause));
    } finally {
      setEditorLoading(false);
    }
  }

  async function submitPermissionReplacement() {
    if (!editorRole || !requireFresh()) return;
    setFormError(null);
    try {
      await replaceRolePermissions(editorRole.id, selectedPermissionIds);
      setEditorRole(null);
      setSelectedPermissionIds([]);
      showToast('success', 'Conjunto completo de permisos actualizado.');
    } catch (cause) {
      setFormError(mutationErrorMessage(cause));
    }
  }

  const rolesMessage = listErrorMessage(rolesError, 'roles');
  const permissionsMessage = listErrorMessage(permissionsError, 'permisos');
  const unknownSelectedIds = selectedPermissionIds.filter(id => !permissionById.has(id));

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Roles y Permisos"
        description="Administración remota de Identity · los permisos se reemplazan como conjunto completo"
        breadcrumbs={getBreadcrumbs('roles', navigate)}
        actions={canManage ? (
          <Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={openCreate}>Nuevo rol</Button>
        ) : undefined}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <section className="siga-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <div><h2 className="font-semibold text-[#093C5D]">Roles de Identity</h2><p className="text-xs text-gray-500">Estado informativo; este módulo no activa ni desactiva roles.</p></div>
            <Button variant="outline" size="sm" icon={<RefreshIcon size={13} />} disabled={rolesLoading} onClick={() => void loadRoles().catch(() => undefined)}>Actualizar</Button>
          </div>
          {rolesLoading && <Loading label="Cargando roles de Identity…" />}
          {!rolesLoading && rolesMessage && <ErrorState title="No fue posible consultar roles" message={rolesMessage} onRetry={() => void loadRoles().catch(() => undefined)} />}
          {!rolesLoading && !rolesMessage && roles.length === 0 && <EmptyState icon={<ShieldIcon size={44} />} title="No hay roles" description="Identity devolvió un catálogo de roles vacío." />}
          {!rolesLoading && !rolesMessage && roles.length > 0 && (
            <div className="overflow-x-auto"><table className="siga-table">
              <thead><tr><th>Rol</th><th>Nombre</th><th>Estado</th><th>Permisos</th><th className="text-right">Acción</th></tr></thead>
              <tbody>{roles.map(role => (
                <tr key={role.id}>
                  <td><div className="flex items-center gap-2"><span className="font-mono text-sm font-semibold text-[#093C5D]">{role.code}</span>{role.code === 'ADMIN' && <Badge variant="warning">Protegido</Badge>}</div><div className="font-mono text-xs text-gray-400">{shortId(role.id)}</div></td>
                  <td className="text-sm text-gray-700">{role.name}</td>
                  <td><Badge variant={role.active ? 'success' : 'muted'}>{role.active ? 'Activo' : 'Inactivo'}</Badge></td>
                  <td><PermissionSummary role={role} permissionById={permissionById} /></td>
                  <td className="text-right"><Button variant="ghost" size="sm" icon={<EditIcon size={13} />} disabled={role.code === 'ADMIN' || editorLoading} onClick={() => void openPermissionEditor(role)}>{role.code === 'ADMIN' ? 'Protegido' : 'Editar permisos'}</Button></td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </section>

        <section className="siga-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <div><h2 className="font-semibold text-[#093C5D]">Catálogo de permisos</h2><p className="text-xs text-gray-500">Catálogo de solo lectura, ordenado por Identity.</p></div>
            <Button variant="outline" size="sm" icon={<RefreshIcon size={13} />} disabled={permissionsLoading} onClick={() => void loadPermissions().catch(() => undefined)}>Actualizar</Button>
          </div>
          {permissionsLoading && <Loading label="Cargando permisos de Identity…" />}
          {!permissionsLoading && permissionsMessage && <ErrorState title="No fue posible consultar permisos" message={permissionsMessage} onRetry={() => void loadPermissions().catch(() => undefined)} />}
          {!permissionsLoading && !permissionsMessage && permissions.length === 0 && <EmptyState icon={<ShieldIcon size={44} />} title="No hay permisos" description="Identity devolvió un catálogo de permisos vacío." />}
          {!permissionsLoading && !permissionsMessage && permissions.length > 0 && (
            <div className="overflow-x-auto"><table className="siga-table">
              <thead><tr><th>Código</th><th>Descripción</th><th>ID</th></tr></thead>
              <tbody>{permissions.map(permission => (
                <tr key={permission.id}><td className="font-mono text-sm font-semibold text-[#093C5D]">{permission.code}</td><td className="text-sm text-gray-700">{permission.description}</td><td className="font-mono text-xs text-gray-400">{shortId(permission.id)}</td></tr>
              ))}</tbody>
            </table></div>
          )}
        </section>
      </div>

      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setFormError(null); }} title="Nuevo rol" size="lg" footer={<><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button><Button variant="primary" loading={saving} onClick={() => void submitCreate()}>Crear rol</Button></>}>
        <div className="space-y-4">
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <Input label="Código" value={createForm.code} maxLength={80} autoComplete="off" hint="Formato: MAYUSCULAS_Y_GUION_BAJO" onChange={event => setCreateForm(form => ({ ...form, code: event.target.value }))} />
          <Input label="Nombre" value={createForm.name} maxLength={120} autoComplete="off" onChange={event => setCreateForm(form => ({ ...form, name: event.target.value }))} />
          <PermissionChecklist permissions={permissions} selected={createForm.permissionIds} onChange={permissionIds => setCreateForm(form => ({ ...form, permissionIds }))} legend="Permisos iniciales (opcional)" />
          <p className="text-xs text-gray-500">No se asignan permisos implícitos. Solo se enviará el conjunto seleccionado.</p>
        </div>
      </Modal>

      <Modal open={editorRole !== null} onClose={() => { setEditorRole(null); setSelectedPermissionIds([]); setFormError(null); }} title={`Reemplazar permisos — ${editorRole?.code ?? ''}`} size="lg" footer={<><Button variant="outline" onClick={() => setEditorRole(null)}>Cancelar</Button><Button variant="primary" loading={saving} onClick={() => void submitPermissionReplacement()}>Confirmar reemplazo</Button></>}>
        <div className="space-y-4">
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Esta operación reemplaza el conjunto completo. No existe control de versión; otro administrador podría sobrescribir esta selección.</div>
          <PermissionChecklist permissions={permissions} selected={selectedPermissionIds} onChange={setSelectedPermissionIds} legend="Conjunto completo de permisos" />
          {unknownSelectedIds.length > 0 && (
            <div className="rounded-lg border border-gray-200 p-3"><div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Permisos desconocidos conservados</div><div className="mt-2 flex flex-wrap gap-2">{unknownSelectedIds.map(id => <Badge key={id} variant="muted">Permiso desconocido · {shortId(id)}</Badge>)}</div><p className="mt-2 text-xs text-gray-500">Identity asignó estos IDs, pero no aparecen en el catálogo recibido. No se eliminarán silenciosamente.</p></div>
          )}
        </div>
      </Modal>

      <Modal open={reauthOpen} onClose={() => setReauthOpen(false)} title="Autenticación reciente requerida" size="sm" footer={<><Button variant="outline" onClick={() => setReauthOpen(false)}>Cancelar</Button><Button variant="primary" onClick={logout}>Volver a iniciar sesión</Button></>}>
        <p className="text-sm text-gray-600">Por seguridad, vuelve a iniciar sesión para realizar este cambio. La operación no fue enviada y no se reintentará automáticamente.</p>
      </Modal>
    </div>
  );
}

function Loading({ label }: { label: string }) {
  return <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500"><Spinner /> {label}</div>;
}

function ErrorState({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) {
  return <div className="p-6"><EmptyState icon={<ShieldIcon size={44} />} title={title} description={message} action={<Button variant="outline" onClick={onRetry}>Reintentar</Button>} /></div>;
}

function PermissionSummary({ role, permissionById }: { role: AdminRole; permissionById: Map<string, AdminPermission> }) {
  if (role.permissionIds.length === 0) return <span className="text-xs text-gray-400">Sin permisos</span>;
  return <div><div className="text-sm font-semibold text-gray-700">{role.permissionIds.length}</div><div className="mt-1 flex max-w-xl flex-wrap gap-1">{role.permissionIds.map(id => { const permission = permissionById.get(id); return <Badge key={id} variant={permission ? 'primary' : 'muted'}>{permission?.code ?? `Desconocido ${shortId(id)}`}</Badge>; })}</div></div>;
}

function PermissionChecklist({ permissions, selected, onChange, legend }: {
  permissions: AdminPermission[];
  selected: string[];
  onChange: (permissionIds: string[]) => void;
  legend: string;
}) {
  if (permissions.length === 0) return <p className="text-sm text-gray-500">No hay permisos disponibles para seleccionar.</p>;
  return (
    <fieldset><legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">{legend}</legend><div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
      {permissions.map(permission => { const checked = selected.includes(permission.id); return (
        <label key={permission.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:border-[#3B7597]"><input type="checkbox" className="mt-1" checked={checked} onChange={event => onChange(event.target.checked ? [...selected, permission.id] : selected.filter(id => id !== permission.id))} /><span><strong className="font-mono text-[#093C5D]">{permission.code}</strong><span className="block text-xs text-gray-500">{permission.description}</span></span></label>
      ); })}
    </div></fieldset>
  );
}
