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
    <div className="siga-card">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-[#093C5D] font-display text-sm">Alertas críticas</h3>
        <button onClick={onViewAll} className="text-xs text-[#3B7597] hover:underline">Ver todas →</button>
      </div>
      <div className="divide-y divide-gray-50">
        {criticalAlerts.length === 0 && (
          <div className="flex flex-col items-center py-6 text-gray-300">
            <CheckIcon size={24} />
            <span className="text-xs text-gray-400 mt-2">Sin alertas críticas</span>
          </div>
        )}
        {criticalAlerts.map(alert => (
          <div key={alert.id} onClick={() => onAlertClick(alert)}
            className="flex gap-3 px-5 py-3 hover:bg-red-50/30 cursor-pointer transition-colors">
            <span className="text-red-500 flex-shrink-0 mt-0.5"><Alert2Icon size={14} /></span>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-700 truncate">{alert.title}</div>
              <div className="text-xs text-gray-400 truncate">{alert.description}</div>
            </div>
          </div>
        ))}
        {warningAlerts.map(alert => (
          <div key={alert.id} onClick={() => onAlertClick(alert)}
            className="flex gap-3 px-5 py-3 hover:bg-amber-50/30 cursor-pointer transition-colors">
            <span className="text-amber-500 flex-shrink-0 mt-0.5"><Alert2Icon size={14} /></span>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-700 truncate">{alert.title}</div>
              <div className="text-xs text-gray-400 truncate">{alert.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
