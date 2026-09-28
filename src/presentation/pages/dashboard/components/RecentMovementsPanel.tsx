import { MovementStatusBadge } from '../../../components/ui';
import type { EnrichedMovement } from '../hooks/useDashboardMetrics';

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
  entrada: { label: 'ENT', color: 'text-emerald-600 bg-emerald-50' },
  salida: { label: 'SAL', color: 'text-red-600 bg-red-50' },
  transferencia: { label: 'TRF', color: 'text-[#3B7597] bg-[#6FD1D7]/20' },
  ajuste_positivo: { label: 'AJ+', color: 'text-emerald-600 bg-emerald-50' },
  ajuste_negativo: { label: 'AJ-', color: 'text-orange-600 bg-orange-50' },
};

export interface RecentMovementsPanelProps {
  movements: readonly EnrichedMovement[];
  onViewAll: () => void;
}

export function RecentMovementsPanel({ movements, onViewAll }: RecentMovementsPanelProps) {
  return (
    <div className="siga-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-[#093C5D] font-display text-sm">Movimientos recientes</h3>
        <button onClick={onViewAll} className="text-xs text-[#3B7597] hover:underline">Ver todos →</button>
      </div>
      <div className="divide-y divide-gray-50">
        {movements.map(mv => {
          const t = TYPE_LABEL[mv.type] ?? { label: mv.type, color: 'text-gray-500 bg-gray-50' };
          return (
            <div key={mv.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50/50">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.color}`}>{t.label}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-700 truncate">{mv.productName ?? mv.productId}</div>
                <div className="text-[10px] text-gray-400">{mv.id} · {mv.createdAt.split(' ')[0]}</div>
              </div>
              <MovementStatusBadge status={mv.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
