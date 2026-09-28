import type { Product } from '../../../../domain/entities/Product';
import { countMachineryByStatus } from '../../../../domain/rules/machineryRules';
import { MachineryStatusBadge } from '../../../components/ui';

export interface MachineryStatusPanelProps {
  machinery: readonly Product[];
  machineryAvailability: number;
  onSelectMachinery: () => void;
  onViewAll: () => void;
}

export function MachineryStatusPanel({ machinery, machineryAvailability, onSelectMachinery, onViewAll }: MachineryStatusPanelProps) {
  const counts = countMachineryByStatus(machinery);
  const summary = [
    { label: 'Operativo', count: counts.operativo, color: 'text-emerald-600' },
    { label: 'Mant.', count: counts.mantenimiento, color: 'text-amber-600' },
    { label: 'Inop.', count: counts.inoperativo, color: 'text-red-600' },
  ];

  return (
    <div className="siga-card">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-[#093C5D] font-display text-sm">Estado de maquinaria</h3>
        <button onClick={onViewAll} className="text-xs text-[#3B7597] hover:underline">Ver todas →</button>
      </div>
      <div className="divide-y divide-gray-50">
        {machinery.slice(0, 6).map(maq => (
          <div key={maq.id} onClick={onSelectMachinery} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50/50 cursor-pointer">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-700 truncate">{maq.name}</div>
              <div className="text-[10px] text-gray-400 truncate">{maq.assetCode} · {maq.brand} {maq.model}</div>
            </div>
            <MachineryStatusBadge status={maq.machineryStatus ?? 'operativo'} />
          </div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex gap-3">
          {summary.map((s, i) => (
            <div key={i} className="text-center">
              <div className={`text-sm font-bold ${s.color}`}>{s.count}</div>
              <div className="text-[9px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="text-sm font-bold text-[#5DF8D8]">{machineryAvailability}% <span className="text-xs font-normal text-gray-400">disponible</span></div>
      </div>
    </div>
  );
}
