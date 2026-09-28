import { useApp } from '../../state/AppContext';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { PageHeader, Badge, ShieldIcon } from '../../components/ui';
import type { UserRole } from '../../../types';
import { ROLE_PERMISSIONS } from '../../../domain/rules/permissionRules';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  warehouse: 'Almacenero',
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: '#DC2626',
  supervisor: '#D97706',
  warehouse: '#093C5D',
};

const MODULE_LABELS: Record<string, string> = {
  inventory: 'Inventario',
  entries: 'Entradas',
  exits: 'Salidas',
  transfers: 'Transferencias',
  adjustments: 'Ajustes',
  authorizations: 'Autorizaciones',
  history: 'Historial y trazabilidad',
  audit: 'Auditoría',
  reports: 'Reportes',
  analytics: 'Indicadores',
  catalogs: 'Catálogos',
  users: 'Usuarios',
  config: 'Configuración',
  costs: 'Costos',
  integrations: 'Integraciones',
  continuity: 'Continuidad',
};

const ACTION_LABELS: Record<string, string> = {
  view: 'Ver',
  edit: 'Editar',
  create: 'Crear',
  delete: 'Eliminar',
  authorize: 'Autorizar',
  export: 'Exportar',
  configure: 'Configurar',
};

const ALL_ACTIONS = ['view', 'create', 'edit', 'delete', 'authorize', 'export', 'configure'];

export default function RolesPermissions() {
  const { navigate } = useApp();

  const roles = Object.keys(ROLE_PERMISSIONS) as UserRole[];
  const modules = Object.keys(MODULE_LABELS);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Roles y Permisos" description="Matriz de control de acceso por módulo y rol"
        breadcrumbs={getBreadcrumbs('roles', navigate)}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          {Object.entries(ACTION_LABELS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs">
              <div className="w-5 h-5 rounded text-xs flex items-center justify-center bg-[#093C5D]/10 text-[#093C5D] font-bold">{k[0].toUpperCase()}</div>
              <span className="text-gray-600">{v}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-xs ml-4"><div className="w-5 h-5 rounded bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600">✓</div><span>Permitido</span></div>
          <div className="flex items-center gap-1.5 text-xs"><div className="w-5 h-5 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300">✗</div><span>No permitido</span></div>
        </div>

        {/* Matrix table */}
        <div className="siga-card overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#093C5D] text-white">
                <th className="text-left p-3 font-semibold w-44 sticky left-0 bg-[#093C5D] z-10">Módulo</th>
                {roles.map(role => (
                  <th key={role} colSpan={7} className="text-center p-3 border-l border-white/10">
                    <div className="font-bold">{ROLE_LABELS[role]}</div>
                    <div className="text-[10px] text-white/60 font-normal">{role}</div>
                  </th>
                ))}
              </tr>
              <tr className="bg-[#3B7597] text-white">
                <th className="sticky left-0 bg-[#3B7597] z-10 p-2"></th>
                {roles.map(role =>
                  ALL_ACTIONS.map(a => (
                    <th key={`${role}-${a}`} className="text-center p-1.5 border-l border-white/10 w-7">
                      <div className="font-bold text-[10px]">{a[0].toUpperCase()}</div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod, rowIdx) => (
                <tr key={mod} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className={`p-3 font-medium text-[#093C5D] sticky left-0 z-10 border-r border-gray-100 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    {MODULE_LABELS[mod]}
                  </td>
                  {roles.map(role => {
                    const rolePerms = ROLE_PERMISSIONS[role];
                    const modPerms = rolePerms[mod] ?? [];
                    return ALL_ACTIONS.map(action => {
                      const allowed = modPerms.includes(action);
                      return (
                        <td key={`${role}-${action}`} className="text-center p-1.5 border-l border-gray-100">
                          <div className={`w-5 h-5 mx-auto rounded flex items-center justify-center text-xs ${allowed ? 'bg-emerald-100 border border-emerald-300 text-emerald-600' : 'bg-gray-50 border border-gray-100 text-gray-200'}`}>
                            {allowed ? '✓' : '✗'}
                          </div>
                        </td>
                      );
                    });
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Role cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {roles.map(role => {
            const rolePerms = ROLE_PERMISSIONS[role];
            const totalActions = Object.values(rolePerms).reduce((sum, actions) => sum + (actions as string[]).length, 0);
            const modsAccess = Object.keys(rolePerms).length;
            return (
              <div key={role} className="siga-card p-4 border-t-4" style={{ borderTopColor: ROLE_COLORS[role] }}>
                <div className="font-bold text-[#093C5D] mb-1">{ROLE_LABELS[role]}</div>
                <div className="font-mono text-xs text-gray-400 mb-3">{role}</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Módulos con acceso:</span><span className="font-bold text-[#093C5D]">{modsAccess}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Acciones totales:</span><span className="font-bold text-[#093C5D]">{totalActions}</span></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {Object.keys(rolePerms).map(m => (
                    <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{MODULE_LABELS[m] ?? m}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
