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
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">

      <h3 className="font-semibold text-[#093C5D] font-display text-sm">
        Estado de maquinaria
      </h3>

      <button
        onClick={onViewAll}
        className="text-xs font-medium text-[#3B7597] hover:text-[#093C5D] transition-colors"
      >
        Ver todas →
      </button>

    </div>


    <div className="divide-y divide-gray-100">

      {machinery.slice(0, 6).map(maq => {

        const status = maq.machineryStatus ?? 'operativo';

        const statusStyle =
          status === 'operativo'
            ? {
                bg: 'bg-emerald-50',
                dot: 'bg-emerald-500',
              }
            : status === 'mantenimiento'
              ? {
                  bg: 'bg-amber-50',
                  dot: 'bg-amber-500',
                }
              : {
                  bg: 'bg-red-50',
                  dot: 'bg-red-500',
                };

        return (

          <div
            key={maq.id}
            onClick={onSelectMachinery}
            className="group flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/70 cursor-pointer transition-colors"
          >

            <div
              className={`w-10 h-10 rounded-xl ${statusStyle.bg} flex items-center justify-center flex-shrink-0`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot}`}
              />
            </div>


            <div className="flex-1 min-w-0">

              <div className="text-xs font-semibold text-[#093C5D] truncate">
                {maq.name}
              </div>

              <div className="text-[10px] text-gray-400 truncate mt-0.5">
                {maq.assetCode} · {maq.brand} {maq.model}
              </div>

            </div>


            <div className="flex-shrink-0">
              <MachineryStatusBadge
                status={status}
              />
            </div>

          </div>

        );

      })}

    </div>


    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between gap-4">

      <div className="flex gap-2">

        {summary.map((s, i) => (

          <div
            key={i}
            className="min-w-[54px] px-2.5 py-2 rounded-lg bg-white border border-gray-100 text-center shadow-sm"
          >

            <div className={`text-sm font-bold ${s.color}`}>
              {s.count}
            </div>

            <div className="text-[9px] text-gray-400 mt-0.5">
              {s.label}
            </div>

          </div>

        ))}

      </div>


      <div className="text-right">

        <div className="text-lg font-bold text-[#3B7597]">
          {machineryAvailability}%
        </div>

        <div className="text-[10px] text-gray-400">
          disponible
        </div>

      </div>

    </div>

  </div>
);
}
