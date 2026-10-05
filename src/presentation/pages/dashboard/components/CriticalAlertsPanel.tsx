import type { Alert } from '../../../../domain/entities/Alert';
import { CheckIcon, AlertIcon as Alert2Icon } from '../../../components/ui';

export interface CriticalAlertsPanelProps {
  criticalAlerts: readonly Alert[];
  warningAlerts: readonly Alert[];
  onAlertClick: (alert: Alert) => void;
  onViewAll: () => void;
}

export function CriticalAlertsPanel({ criticalAlerts, warningAlerts, onAlertClick, onViewAll }: CriticalAlertsPanelProps) {
  return (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">

      <div className="flex items-center gap-2.5">

        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
          <Alert2Icon
            size={16}
            className="text-red-500"
          />
        </div>

        <h3 className="font-semibold text-[#093C5D] font-display text-sm">
          Alertas críticas
        </h3>

      </div>

      <button
        onClick={onViewAll}
        className="text-xs font-medium text-[#3B7597] hover:text-[#093C5D] transition-colors"
      >
        Ver todas →
      </button>

    </div>


    <div className="divide-y divide-gray-100">

      {criticalAlerts.length === 0 && (

        <div className="flex flex-col items-center justify-center py-8 text-gray-300">

          <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckIcon
              size={20}
              className="text-emerald-500"
            />
          </div>

          <span className="text-xs text-gray-400 mt-2">
            Sin alertas críticas
          </span>

        </div>

      )}


      {criticalAlerts.map(alert => (

        <div
          key={alert.id}
          onClick={() => onAlertClick(alert)}
          className="group flex items-center gap-3 px-5 py-3.5 hover:bg-red-50/50 cursor-pointer transition-colors"
        >

          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">

            <Alert2Icon
              size={15}
              className="text-red-500"
            />

          </div>


          <div className="min-w-0 flex-1">

            <div className="text-xs font-semibold text-gray-700 truncate">
              {alert.title}
            </div>

            <div className="text-xs text-gray-400 truncate mt-0.5">
              {alert.description}
            </div>

          </div>


          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />

        </div>

      ))}


      {warningAlerts.map(alert => (

        <div
          key={alert.id}
          onClick={() => onAlertClick(alert)}
          className="group flex items-center gap-3 px-5 py-3.5 hover:bg-amber-50/50 cursor-pointer transition-colors"
        >

          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">

            <Alert2Icon
              size={15}
              className="text-amber-500"
            />

          </div>


          <div className="min-w-0 flex-1">

            <div className="text-xs font-semibold text-gray-700 truncate">
              {alert.title}
            </div>

            <div className="text-xs text-gray-400 truncate mt-0.5">
              {alert.description}
            </div>

          </div>


          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />

        </div>

      ))}

    </div>

  </div>
);
}
