import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Button, PageHeader, Badge, Input } from '../../components/ui';
import type { UserRole } from '../../../types';
import { ROLE_PERMISSIONS } from '../../../domain/rules/permissionRules';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador', supervisor: 'Supervisor', warehouse: 'Almacenero',
};

export default function Profile() {
  const { state, navigate, showToast } = useApp();
  const { currentUser } = state;
  const [name, setName] = useState(currentUser?.name ?? '');
  const [lastName, setLastName] = useState(currentUser?.lastName ?? '');
  const [saving, setSaving] = useState(false);

  if (!currentUser) return null;

  const perms = ROLE_PERMISSIONS[currentUser.role];

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    showToast('success', 'Perfil actualizado.');
    setSaving(false);
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Mi Perfil" description="Datos de su cuenta y permisos asignados"
        breadcrumbs={getBreadcrumbs('profile', navigate)}
        actions={<Button variant="primary" size="sm" onClick={handleSave} loading={saving}>Guardar cambios</Button>}
      />
      <div className="flex-1 overflow-auto p-6 space-y-5 max-w-2xl">
        <div className="siga-card p-6">
          <div className="flex items-center gap-5 mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#093C5D] to-[#3B7597] text-white text-2xl flex items-center justify-center font-bold">
              {currentUser.name[0]}{currentUser.lastName[0]}
            </div>
            <div>
              <div className="text-xl font-bold text-[#093C5D]">{currentUser.name} {currentUser.lastName}</div>
              <div className="text-sm text-gray-400">{currentUser.email}</div>
              <div className="mt-1"><Badge variant="primary">{ROLE_LABELS[currentUser.role]}</Badge></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombres" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Apellidos" value={lastName} onChange={e => setLastName(e.target.value)} />
            <Input label="Correo electrónico" value={currentUser.email} disabled hint="El correo no puede modificarse" />
            <Input label="Alcance" value={currentUser.scope ?? '—'} disabled />
          </div>
        </div>

        <div className="siga-card p-5">
          <h3 className="font-semibold text-[#093C5D] mb-3">Permisos de mi rol — {ROLE_LABELS[currentUser.role]}</h3>
          <div className="space-y-2">
            {Object.entries(perms).map(([module, actions]) => (
              <div key={module} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600 capitalize">{module}</span>
                <div className="flex gap-1 flex-wrap">
                  {(actions as string[]).map(a => (
                    <span key={a} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#6FD1D7]/20 text-[#3B7597]">{a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
