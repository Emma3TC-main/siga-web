import type { DashboardRange } from '../../reports/reportingDates';
import { formatDataUpdatedAt } from '../../reports/reportingDates';

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  supervisor: 'Supervisor de Almacén',
  warehouse: 'Encargado de Almacén',
};

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export function DashboardHeader({
  userName,
  role,
  range,
  onRangeChange,
  dataUpdatedAt,
}: {
  userName?: string;
  role?: string;
  range: DashboardRange;
  onRangeChange: (range: DashboardRange) => void;
  dataUpdatedAt: string | null;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-[#093C5D] font-display">{greeting()}, {userName}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{ROLE_LABEL[role ?? '']} · Resumen operativo del almacén</p>
        <p className="text-xs text-gray-400 mt-1">{formatDataUpdatedAt(dataUpdatedAt)}</p>
      </div>
      <select value={range} onChange={event => onRangeChange(event.target.value as DashboardRange)} className="siga-select w-auto text-sm">
        <option value="LAST_7_DAYS">Últimos 7 días</option>
        <option value="LAST_30_DAYS">Últimos 30 días</option>
        <option value="CURRENT_MONTH">Mes actual</option>
        <option value="LAST_6_MONTHS">Últimos 6 meses</option>
      </select>
    </div>
  );
}
