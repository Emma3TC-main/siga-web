import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useAuditLog } from '../../hooks/useAuditLog';
import { useUsers } from '../../hooks/useUsers';
import { filterAuditEvents, getAuditModules } from '../../../domain/rules/auditRules';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import {
  PageHeader, Badge, Input, Select, Modal, EmptyState, formatNumber,
  ActivityIcon, SearchIcon, EyeIcon, TableActionButton,
} from '../../components/ui';

export default function Audit() {
  const { navigate } = useApp();
  const { auditLog } = useAuditLog();
  const { users } = useUsers();
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [filterResult, setFilterResult] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const modules = getAuditModules(auditLog);

  const filtered = filterAuditEvents(auditLog, { search, module: filterModule, result: filterResult });

  const detail = selected ? auditLog.find(e => e.id === selected) : null;

  const resultBadge = (r: string) => {
    if (r === 'success') return <Badge variant="success" dot>Éxito</Badge>;
    if (r === 'warning') return <Badge variant="warning" dot>Advertencia</Badge>;
    return <Badge variant="error" dot>Error</Badge>;
  };

  const actionColor: Record<string, string> = {
    LOGIN: 'text-[#3B7597] bg-[#6FD1D7]/20',
    CREATE: 'text-emerald-600 bg-emerald-50',
    EDIT: 'text-blue-600 bg-blue-50',
    DELETE: 'text-red-600 bg-red-50',
    AUTHORIZE: 'text-[#5DF8D8]/80 bg-[#5DF8D8]/10 text-emerald-700',
    REJECT: 'text-amber-600 bg-amber-50',
    VIEW: 'text-gray-500 bg-gray-50',
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Auditoría" description={`${auditLog.length} eventos registrados`}
        breadcrumbs={getBreadcrumbs('audit', navigate)}
      />

      <div className="flex gap-3 px-6 py-3 border-b border-gray-200 bg-white flex-wrap">
        <div className="relative flex-1 min-w-48">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar en auditoría..." className="siga-input pl-8 h-8 text-xs" />
        </div>
        <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="siga-select w-36 h-8 text-xs">
          <option value="">Todos los módulos</option>
          {modules.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filterResult} onChange={e => setFilterResult(e.target.value)} className="siga-select w-36 h-8 text-xs">
          <option value="">Todos los resultados</option>
          <option value="success">Éxito</option>
          <option value="warning">Advertencia</option>
          <option value="error">Error</option>
        </select>
      </div>

      {/* Timeline + table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 && <EmptyState icon={<ActivityIcon size={48} />} title="No hay eventos de auditoría" description="Ajuste los filtros para ver resultados" />}

        {/* Table — desktop */}
        <div className="hidden md:block">
          <table className="siga-table">
            <thead><tr><th>Fecha</th><th>Hora</th><th>Usuario</th><th>Acción</th><th>Módulo</th><th>Objeto</th><th>Descripción</th><th>IP</th><th className="text-center">Resultado</th><th className="text-center">Acciones</th></tr></thead>
            <tbody>
              {filtered.map(event => {
                const user = users.find(u => u.id === event.userId);
                return (
                  <tr key={event.id}>
                    <td className="font-mono text-xs">{event.date}</td>
                    <td className="font-mono text-xs text-gray-500">{event.time}</td>
                    <td className="text-xs max-w-[160px] truncate"><div className="font-medium truncate">{user?.name} {user?.lastName}</div><div className="text-gray-400 truncate">{user?.email}</div></td>
                    <td><span className={`text-xs font-bold px-1.5 py-0.5 rounded ${actionColor[event.action] ?? 'text-gray-500 bg-gray-50'}`}>{event.action}</span></td>
                    <td className="text-xs text-[#3B7597] font-medium">{event.module}</td>
                    <td className="text-xs font-mono text-gray-600 max-w-[100px] truncate">{event.object}</td>
                    <td className="text-xs text-gray-500 max-w-[200px] truncate">{event.description}</td>
                    <td className="font-mono text-xs text-gray-400">{event.ip}</td>
                    <td className="text-center">{resultBadge(event.result)}</td>
                    <td className="text-center"><TableActionButton icon={<EyeIcon size={14} />} label="Ver detalle" onClick={() => setSelected(event.id)} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list — mirrors the pattern already used across the app (Fase 7/8) */}
        <div className="md:hidden p-4 space-y-3">
          {filtered.map(event => {
            const user = users.find(u => u.id === event.userId);
            return (
              <button key={event.id} onClick={() => setSelected(event.id)} className="siga-card w-full p-4 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-gray-500">{event.date} · {event.time}</div>
                    <div className="font-medium text-sm text-[#093C5D] mt-0.5 truncate">{user?.name} {user?.lastName}</div>
                    <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                  </div>
                  {resultBadge(event.result)}
                </div>
                <div className="flex items-center gap-2 mt-2 min-w-0">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${actionColor[event.action] ?? 'text-gray-500 bg-gray-50'}`}>{event.action}</span>
                  <span className="text-xs text-[#3B7597] font-medium flex-shrink-0">{event.module}</span>
                  <span className="text-xs font-mono text-gray-500 truncate min-w-0">{event.object}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2 truncate">{event.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Evento de auditoría — ${detail?.id}`} size="md">
        {detail && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Fecha', detail.date],
                ['Hora', detail.time],
                ['IP', detail.ip],
                ['Acción', detail.action],
                ['Módulo', detail.module],
                ['Objeto', detail.object],
                ['Resultado', ''],
                ['Usuario', `${users.find(u => u.id === detail.userId)?.name} ${users.find(u => u.id === detail.userId)?.lastName}`],
              ].map(([k, v], i) => (
                <div key={i} className="p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-400">{k}</div>
                  <div className="font-medium text-[#093C5D]">{k === 'Resultado' ? resultBadge(detail.result) : v}</div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-[#093C5D]/3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Descripción completa</div>
              <div className="text-sm text-gray-700">{detail.description}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
