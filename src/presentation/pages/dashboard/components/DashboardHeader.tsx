const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  supervisor: 'Supervisor de Almacén',
  warehouse: 'Encargado de Almacén',
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export interface DashboardHeaderProps {
  userName?: string;
  role?: string;
  period: string;
  onPeriodChange: (period: string) => void;
}

export function DashboardHeader({ userName, role, period, onPeriodChange }: DashboardHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-xl font-bold text-[#093C5D] font-display">
          {greeting()}, {userName}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {ROLE_LABEL[role ?? '']} · Resumen operativo del almacén
        </p>
      </div>
      <div className="flex items-center gap-2">
        <select value={period} onChange={e => onPeriodChange(e.target.value)} className="siga-select w-auto text-sm">
          <option value="agosto">Agosto 2025</option>
          <option value="julio">Julio 2025</option>
          <option value="junio">Junio 2025</option>
        </select>
        <select className="siga-select w-auto text-sm">
          <option>Todos los almacenes</option>
          <option>Almacén Principal</option>
          <option>Almacén Secundario</option>
        </select>
      </div>
    </div>
  );
}
