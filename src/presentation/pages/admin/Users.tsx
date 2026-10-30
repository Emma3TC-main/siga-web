import { useMemo, useState } from 'react';
import { checkAdminMutationPreflight } from '../../../application/auth/adminMutationPreflight';
import type { AdminRole } from '../../../domain/entities/AdminRole';
import type { AdminUser } from '../../../domain/entities/AdminUser';
import { ApiError } from '../../../infrastructure/http/ApiClient';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { useApp } from '../../state/AppContext';
import {
  Badge, Button, DetailField, DetailHeader, DetailSection, EditIcon, EmptyState,
  EyeIcon, Input, Modal, PageHeader, Spinner, TableActionButton, UsersIcon, PlusIcon,
} from '../../components/ui';

const emptyCreateForm = { username: '', email: '', password: '', roleIds: [] as string[] };

function shortId(value: string): string {
  return value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value;
}

function mutationErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const code = typeof error.data?.code === 'string' ? error.data.code : null;
    if (error.status === 403) return 'No fue posible autorizar la operación. Verifica tus permisos o vuelve a iniciar sesión.';
    if (code === 'SELF_DEACTIVATION') return 'No puedes desactivar tu propia cuenta.';
    if (code === 'MFA_REQUIRED') return 'La operación requiere una autenticación MFA reciente.';
    if (code === 'ROLE_INACTIVE') return 'Uno de los roles seleccionados ya no está activo.';
    if (code === 'ROLE_NOT_FOUND') return 'Uno de los roles seleccionados ya no está disponible.';
    if (code === 'DATA_CONFLICT') return 'Los datos entran en conflicto con un usuario existente.';
  }
  return getErrorMessage(error);
}

export default function Users() {
  const { state, navigate, showToast, logout } = useApp();
  const currentUser = state.currentUser;
  const permissions = currentUser?.permissions ?? [];
  const canManageRoles = permissions.includes('ROLE_MANAGE');
  const {
    users, page, size, totalElements, detail, roles, loading, detailLoading, saving,
    error, roleError, loadPage, openUser, closeDetail, createUser, updateUser, replaceUserRoles,
  } = useAdminUsers(canManageRoles);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [reauthOpen, setReauthOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ ...emptyCreateForm });
  const [editForm, setEditForm] = useState({ email: '', active: true });
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const roleById = useMemo(() => new Map(roles.map(role => [role.id, role])), [roles]);
  const roleLabels = (user: AdminUser): string[] => user.roleIds.map(roleId => {
    const role = roleById.get(roleId);
    return role ? role.name : `Rol ${shortId(roleId)}`;
  });

  function requireFresh(requiredPermissions: string[]): boolean {
    const result = checkAdminMutationPreflight(currentUser, requiredPermissions);
    if (result.allowed) return true;
    if (result.reason === 'REAUTHENTICATION_REQUIRED') setReauthOpen(true);
    else showToast('error', 'No tienes los permisos necesarios para realizar esta operación.');
    return false;
  }

  async function showDetail(id: string) {
    setDetailId(id);
    setFormError(null);
    try { await openUser(id); }
    catch (cause) { setFormError(getErrorMessage(cause)); }
  }

  function closeUserDetail() {
    setDetailId(null);
    setFormError(null);
    closeDetail();
  }

  function openCreate() {
    setCreateForm({ ...emptyCreateForm, roleIds: [] });
    setFormError(null);
    setCreateOpen(true);
  }

  async function submitCreate() {
    const username = createForm.username.trim();
    const email = createForm.email.trim();
    if (!username || !email) {
      setFormError('Username y correo electrónico son obligatorios.');
      return;
    }
    if (createForm.password.length < 12 || createForm.password.length > 1024) {
      setFormError('La contraseña inicial debe tener entre 12 y 1024 caracteres.');
      return;
    }
    const required = createForm.roleIds.length > 0 ? ['USER_MANAGE', 'ROLE_MANAGE'] : ['USER_MANAGE'];
    if (!requireFresh(required)) return;
    setFormError(null);
    try {
      await createUser({
        username,
        email,
        password: createForm.password,
        ...(canManageRoles && createForm.roleIds.length > 0 ? { roleIds: createForm.roleIds } : {}),
      });
      setCreateForm({ ...emptyCreateForm, roleIds: [] });
      setCreateOpen(false);
      showToast('success', 'Usuario creado correctamente.');
    } catch (cause) {
      setFormError(mutationErrorMessage(cause));
    }
  }

  async function openEdit(user: AdminUser) {
    setFormError(null);
    try {
      const latest = await openUser(user.id);
      setEditForm({ email: latest.email, active: latest.active });
      setEditOpen(true);
    } catch (cause) {
      showToast('error', getErrorMessage(cause));
    }
  }

  async function submitEdit() {
    if (!detail || !editForm.email.trim()) {
      setFormError('El correo electrónico es obligatorio.');
      return;
    }
    if (!requireFresh(['USER_MANAGE'])) return;
    setFormError(null);
    try {
      await updateUser(detail.id, { email: editForm.email.trim(), active: editForm.active });
      setEditOpen(false);
      showToast('success', 'Usuario actualizado correctamente.');
    } catch (cause) {
      setFormError(mutationErrorMessage(cause));
    }
  }

  async function openRoleEditor(user: AdminUser) {
    if (!canManageRoles) return;
    setFormError(null);
    try {
      const latest = await openUser(user.id);
      setSelectedRoleIds([...latest.roleIds]);
      setRolesOpen(true);
    } catch (cause) {
      showToast('error', getErrorMessage(cause));
    }
  }

  async function submitRoles() {
    if (!detail || !requireFresh(['ROLE_MANAGE'])) return;
    setFormError(null);
    try {
      await replaceUserRoles(detail.id, selectedRoleIds);
      setRolesOpen(false);
      showToast('success', 'Asignación completa de roles actualizada.');
    } catch (cause) {
      setFormError(mutationErrorMessage(cause));
    }
  }

  const listError = error instanceof ApiError && error.status === 403
    ? 'No tienes el permiso USER_MANAGE para consultar usuarios.'
    : error ? getErrorMessage(error) : null;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Gestión de Usuarios"
        description={`${totalElements} usuarios · orden username ASC`}
        breadcrumbs={getBreadcrumbs('users', navigate)}
        actions={permissions.includes('USER_MANAGE') ? (
          <Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={openCreate}>Nuevo usuario</Button>
        ) : undefined}
      />

      {Boolean(roleError) && canManageRoles && (
        <div className="mx-6 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Los usuarios están disponibles, pero no fue posible cargar las etiquetas de roles.
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {loading && <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500"><Spinner /> Cargando usuarios de Identity…</div>}
        {!loading && listError && (
          <div className="p-6">
            <EmptyState icon={<UsersIcon size={48} />} title="No fue posible consultar usuarios" description={listError} />
            <div className="flex justify-center mt-4"><Button variant="outline" onClick={() => void loadPage(page).catch(() => undefined)}>Reintentar</Button></div>
          </div>
        )}
        {!loading && !listError && users.length === 0 && <EmptyState icon={<UsersIcon size={48} />} title="No hay usuarios" description="Identity no devolvió usuarios para esta página." />}
        {!loading && !listError && users.length > 0 && (
          <>
            <div className="hidden md:block">
              <table className="siga-table">
                <thead><tr><th>Username</th><th>Email</th><th>Roles</th><th>MFA</th><th>Estado</th><th className="text-center">Acciones</th></tr></thead>
                <tbody>{users.map(user => (
                  <tr key={user.id}>
                    <td><div className="font-medium text-sm">{user.username}</div><div className="font-mono text-xs text-gray-400">{shortId(user.id)}</div></td>
                    <td className="text-sm text-gray-600">{user.email}</td>
                    <td><div className="flex flex-wrap gap-1">{roleLabels(user).length > 0 ? roleLabels(user).map(label => <Badge key={label} variant="primary">{label}</Badge>) : <span className="text-xs text-gray-400">Sin roles</span>}</div></td>
                    <td><Badge variant={user.mfaEnabled ? 'success' : 'muted'}>{user.mfaEnabled ? 'Habilitado' : 'No habilitado'}</Badge></td>
                    <td><Badge variant={user.active ? 'success' : 'muted'}>{user.active ? 'Activo' : 'Inactivo'}</Badge></td>
                    <td className="text-center"><div className="flex justify-center gap-1">
                      <TableActionButton icon={<EyeIcon size={14} />} label="Ver usuario" onClick={() => void showDetail(user.id)} />
                      <TableActionButton icon={<EditIcon size={14} />} label="Editar email y estado" onClick={() => void openEdit(user)} />
                      {canManageRoles && <Button variant="ghost" size="sm" onClick={() => void openRoleEditor(user)}>Roles</Button>}
                    </div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="md:hidden p-4 space-y-3">{users.map(user => (
              <button key={user.id} type="button" onClick={() => void showDetail(user.id)} className="siga-card w-full p-4 text-left">
                <div className="flex justify-between gap-3"><div><div className="font-semibold text-[#093C5D]">{user.username}</div><div className="text-xs text-gray-500">{user.email}</div></div><Badge variant={user.active ? 'success' : 'muted'}>{user.active ? 'Activo' : 'Inactivo'}</Badge></div>
                <div className="flex flex-wrap gap-1 mt-3">{roleLabels(user).map(label => <Badge key={label} variant="primary">{label}</Badge>)}</div>
              </button>
            ))}</div>
          </>
        )}
      </div>

      {!loading && !listError && totalElements > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3 text-sm">
          <span className="text-gray-500">Página {page + 1} de {totalPages} · {totalElements} usuarios</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => void loadPage(page - 1).catch(() => undefined)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => void loadPage(page + 1).catch(() => undefined)}>Siguiente</Button>
          </div>
        </div>
      )}

      <Modal open={detailId !== null} onClose={closeUserDetail} title="Detalle de usuario" size="md">
        {detailLoading && <div className="flex justify-center py-10"><Spinner /></div>}
        {!detailLoading && formError && !detail && <p className="text-sm text-red-600">{formError}</p>}
        {!detailLoading && detail && (
          <div className="space-y-4">
            <DetailHeader eyebrow={detail.id} title={detail.username} badges={<><Badge variant={detail.active ? 'success' : 'muted'}>{detail.active ? 'Activo' : 'Inactivo'}</Badge><Badge variant={detail.mfaEnabled ? 'success' : 'muted'}>MFA {detail.mfaEnabled ? 'habilitado' : 'no habilitado'}</Badge></>} />
            <DetailSection title="Cuenta"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><DetailField label="Username" value={detail.username} /><DetailField label="Correo" value={detail.email} /></div></DetailSection>
            <DetailSection title="Roles asignados"><div className="p-3 bg-gray-50 rounded-lg flex flex-wrap gap-1.5">{roleLabels(detail).length > 0 ? roleLabels(detail).map(label => <Badge key={label} variant="primary">{label}</Badge>) : <span className="text-sm text-gray-500">Sin roles asignados</span>}</div></DetailSection>
            <p className="text-xs text-gray-500">El estado MFA es únicamente informativo. Su administración no forma parte de este módulo.</p>
          </div>
        )}
      </Modal>

      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setCreateForm({ ...emptyCreateForm, roleIds: [] }); setFormError(null); }} title="Nuevo usuario" size="md" footer={<><Button variant="outline" onClick={() => { setCreateOpen(false); setCreateForm({ ...emptyCreateForm, roleIds: [] }); }}>Cancelar</Button><Button variant="primary" loading={saving} onClick={() => void submitCreate()}>Crear usuario</Button></>}>
        <div className="space-y-4">
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <Input label="Username" value={createForm.username} maxLength={100} autoComplete="off" onChange={event => setCreateForm(form => ({ ...form, username: event.target.value }))} />
          <Input label="Correo electrónico" type="email" value={createForm.email} maxLength={254} autoComplete="off" onChange={event => setCreateForm(form => ({ ...form, email: event.target.value }))} />
          <Input label="Contraseña inicial" type="password" value={createForm.password} minLength={12} maxLength={1024} autoComplete="new-password" hint="Dato transitorio; no se almacena en el navegador." onChange={event => setCreateForm(form => ({ ...form, password: event.target.value }))} />
          {canManageRoles && <RoleChecklist roles={roles} selected={createForm.roleIds} onChange={roleIds => setCreateForm(form => ({ ...form, roleIds }))} />}
          {!canManageRoles && <p className="text-xs text-gray-500">El usuario se creará sin roles porque tu sesión no posee ROLE_MANAGE.</p>}
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => { setEditOpen(false); setFormError(null); }} title={`Editar ${detail?.username ?? 'usuario'}`} size="sm" footer={<><Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button><Button variant="primary" loading={saving} onClick={() => void submitEdit()}>Guardar cambios</Button></>}>
        <div className="space-y-4">
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <Input label="Correo electrónico" type="email" value={editForm.email} maxLength={254} onChange={event => setEditForm(form => ({ ...form, email: event.target.value }))} />
          <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm"><input type="checkbox" checked={editForm.active} onChange={event => setEditForm(form => ({ ...form, active: event.target.checked }))} /><span><strong>Cuenta activa</strong><span className="block text-xs text-gray-500">Desmarcar desactiva el acceso. Identity impide la autodesactivación.</span></span></label>
          <p className="text-xs text-gray-500">Username y MFA no son editables en este MVP.</p>
        </div>
      </Modal>

      <Modal open={rolesOpen} onClose={() => { setRolesOpen(false); setFormError(null); }} title={`Reemplazar roles — ${detail?.username ?? ''}`} size="sm" footer={<><Button variant="outline" onClick={() => setRolesOpen(false)}>Cancelar</Button><Button variant="primary" loading={saving} onClick={() => void submitRoles()}>Confirmar reemplazo</Button></>}>
        <div className="space-y-4">
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <p className="text-sm text-gray-600">Esta operación reemplaza el conjunto completo de roles. Otro administrador concurrente podría sobrescribirlo.</p>
          <RoleChecklist roles={roles} selected={selectedRoleIds} onChange={setSelectedRoleIds} />
        </div>
      </Modal>

      <Modal open={reauthOpen} onClose={() => setReauthOpen(false)} title="Autenticación reciente requerida" size="sm" footer={<><Button variant="outline" onClick={() => setReauthOpen(false)}>Cancelar</Button><Button variant="primary" onClick={logout}>Volver a iniciar sesión</Button></>}>
        <p className="text-sm text-gray-600">Por seguridad, vuelve a iniciar sesión para realizar este cambio. La operación no fue enviada y no se reintentará automáticamente.</p>
      </Modal>
    </div>
  );
}

function RoleChecklist({ roles, selected, onChange }: {
  roles: AdminRole[];
  selected: string[];
  onChange: (roleIds: string[]) => void;
}) {
  if (roles.length === 0) return <p className="text-sm text-gray-500">No hay roles disponibles.</p>;
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Roles</legend>
      {roles.map(role => {
        const checked = selected.includes(role.id);
        const disabled = !role.active && !checked;
        return (
          <label key={role.id} className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
            <input type="checkbox" checked={checked} disabled={disabled} onChange={event => onChange(event.target.checked ? [...selected, role.id] : selected.filter(id => id !== role.id))} />
            <span><strong>{role.name}</strong><span className="block font-mono text-xs text-gray-500">{role.code}{!role.active ? ' · inactivo' : ''}</span></span>
          </label>
        );
      })}
    </fieldset>
  );
}
