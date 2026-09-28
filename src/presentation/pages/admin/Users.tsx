import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useUsers } from '../../hooks/useUsers';
import { filterUsers } from '../../../domain/rules/userRules';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import {
  Button, PageHeader, Badge, Modal, Input, Select, EmptyState,
  DetailSection, DetailField, TableActionButton,
  UsersIcon, PlusIcon, EditIcon, EyeIcon, SearchIcon,
} from '../../components/ui';
import { UserRole } from '../../../types';
import { ROLE_PERMISSIONS, hasPermission } from '../../../domain/rules/permissionRules';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  warehouse: 'Almacenero',
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'error',
  supervisor: 'warning',
  warehouse: 'primary',
};

const emptyForm = { name: '', lastName: '', email: '', username: '', role: 'warehouse' as UserRole, scope: '' };

export default function Users() {
  const { state, navigate, showToast } = useApp();
  const { currentUser } = state;
  const { users, createUser, updateUser, setUserStatus } = useUsers();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);

  const canManage = hasPermission(currentUser?.role, 'users', 'edit');

  const filtered = filterUsers(users, { search, role: filterRole });

  const detail = detailId ? users.find(u => u.id === detailId) : null;

  function openNew() {
    setForm({ ...emptyForm });
    setEditMode(false);
    setDetailId(null);
    setModalOpen(true);
  }

  function openEdit(uid: string) {
    const u = users.find(x => x.id === uid)!;
    setForm({ name: u.name, lastName: u.lastName, email: u.email, username: u.username, role: u.role, scope: u.scope ?? '' });
    setEditMode(true);
    setDetailId(uid);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.email.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    try {
      if (editMode && detailId) {
        await updateUser(detailId, { name: form.name, lastName: form.lastName, email: form.email, username: form.username, role: form.role, scope: form.scope });
        showToast('success', 'Usuario actualizado correctamente.');
      } else {
        await createUser({ name: form.name, lastName: form.lastName, email: form.email, username: form.username, role: form.role, scope: form.scope });
        showToast('success', 'Usuario creado correctamente.');
      }
      setModalOpen(false);
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(uid: string) {
    const u = users.find(x => x.id === uid)!;
    try {
      await setUserStatus(u, u.status === 'active' ? 'inactive' : 'active');
      showToast('info', u.status === 'active' ? 'Usuario desactivado.' : 'Usuario activado.');
    } catch (error) {
      showToast('error', getErrorMessage(error));
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Gestión de Usuarios" description={`${users.length} usuarios registrados`}
        breadcrumbs={getBreadcrumbs('users', navigate)}
        actions={canManage ? <Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={openNew}>Nuevo usuario</Button> : undefined}
      />

      <div className="flex gap-3 px-6 py-3 border-b border-gray-200 bg-white flex-wrap">
        <div className="relative flex-1 min-w-48">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuarios..." className="siga-input pl-8 h-8 text-xs" />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="siga-select w-44 h-8 text-xs">
          <option value="">Todos los roles</option>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="hidden md:block">
        <table className="siga-table">
          <thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Área / Alcance</th><th>Username</th><th className="text-center">Estado</th><th className="text-center">Acciones</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#093C5D] to-[#3B7597] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {u.name[0]}{u.lastName[0]}
                    </div>
                    <div className="min-w-0"><div className="font-medium text-sm max-w-[180px] truncate">{u.name} {u.lastName}</div><div className="text-xs text-gray-400">{u.id}</div></div>
                  </div>
                </td>
                <td className="text-sm font-mono text-gray-600 max-w-[180px] truncate">{u.email}</td>
                <td><Badge variant={ROLE_COLORS[u.role] as any}>{ROLE_LABELS[u.role]}</Badge></td>
                <td className="text-sm text-gray-600 max-w-[140px] truncate">{u.scope ?? '—'}</td>
                <td className="font-mono text-xs text-gray-500">{u.username}</td>
                <td className="text-center">
                  <button onClick={() => canManage && toggleStatus(u.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${u.status === 'active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                    {u.status === 'active' ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="text-center">
                  <div className="flex gap-1 justify-center">
                    <TableActionButton icon={<EyeIcon size={14} />} label="Ver perfil" onClick={() => setDetailId(u.id)} />
                    {canManage && <TableActionButton icon={<EditIcon size={14} />} label="Editar" onClick={() => openEdit(u.id)} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Mobile card list — mirrors the pattern already used in ProductsTable/SuppliersTable/InventoryTable */}
        <div className="md:hidden p-4 space-y-3">
          {filtered.map(u => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
            <div key={u.id} onClick={() => setDetailId(u.id)} className="siga-card w-full p-4 text-left cursor-pointer" role="button" tabIndex={0}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#093C5D] to-[#3B7597] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {u.name[0]}{u.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#093C5D] truncate">{u.name} {u.lastName}</div>
                    <div className="text-xs text-gray-400 truncate font-mono">{u.email}</div>
                  </div>
                </div>
                <div className="flex-shrink-0"><Badge variant={ROLE_COLORS[u.role] as any}>{ROLE_LABELS[u.role]}</Badge></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>{u.scope ?? '—'}</span>
                <button onClick={e => { e.stopPropagation(); canManage && toggleStatus(u.id); }}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                  {u.status === 'active' ? 'Activo' : 'Inactivo'}
                </button>
              </div>
              {canManage && (
                <div className="flex gap-1 justify-end mt-2 pt-2 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                  <TableActionButton icon={<EyeIcon size={14} />} label="Ver perfil" onClick={() => setDetailId(u.id)} />
                  <TableActionButton icon={<EditIcon size={14} />} label="Editar" onClick={() => openEdit(u.id)} />
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && <EmptyState icon={<UsersIcon size={48} />} title="No hay usuarios" description="Ajuste los filtros o cree un nuevo usuario" />}
      </div>

      {/* Detail modal */}
      <Modal open={!!detailId && !modalOpen} onClose={() => setDetailId(null)} title={`Perfil — ${detail?.name} ${detail?.lastName}`} size="md">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#093C5D]/3 rounded-lg">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#093C5D] to-[#3B7597] text-white text-xl flex items-center justify-center font-bold">
                {detail.name[0]}{detail.lastName[0]}
              </div>
              <div>
                <div className="font-bold text-[#093C5D] text-lg">{detail.name} {detail.lastName}</div>
                <div className="text-sm text-gray-500">{detail.email}</div>
                <div className="mt-1"><Badge variant={ROLE_COLORS[detail.role] as any}>{ROLE_LABELS[detail.role]}</Badge></div>
              </div>
            </div>
            <DetailSection title="Información de la cuenta">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <DetailField label="ID de usuario" value={detail.id} />
                <DetailField label="Username" value={detail.username} />
                <DetailField label="Alcance" value={detail.scope ?? '—'} />
                <DetailField label="Estado" value={detail.status === 'active' ? 'Activo' : 'Inactivo'} />
                <DetailField label="Creado" value={detail.createdAt} />
                <DetailField label="Último acceso" value={detail.lastAccess ?? '—'} />
              </div>
            </DetailSection>

            <DetailSection title="Permisos del rol">
              <div className="p-3 bg-gray-50 rounded-lg flex flex-wrap gap-1.5">
                {Object.entries(ROLE_PERMISSIONS[detail.role]).map(([module, actions]) => (
                  <span key={module} className="text-xs bg-[#093C5D]/10 text-[#093C5D] px-2 py-0.5 rounded font-mono">{module}: {(actions as string[]).join(', ')}</span>
                ))}
              </div>
            </DetailSection>
          </div>
        )}
      </Modal>

      {/* Create/edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? 'Editar usuario' : 'Nuevo usuario'} size="md"
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button><Button variant="primary" onClick={handleSave} loading={loading} disabled={!form.name.trim() || !form.email.trim()}>{editMode ? 'Guardar cambios' : 'Crear usuario'}</Button></>}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombres" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Juan" />
            <Input label="Apellidos" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Pérez" />
          </div>
          <Input label="Correo electrónico" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="usuario@empresa.com" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="jperez" />
            <Select label="Rol" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}>
              {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </div>
          <Input label="Área / Alcance" value={form.scope} onChange={e => setForm(f => ({ ...f, scope: e.target.value }))} placeholder="Almacén Principal" />
        </div>
      </Modal>
    </div>
  );
}
