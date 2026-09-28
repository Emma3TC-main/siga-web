import type { PhysicalCount } from '../../../../../domain/entities/PhysicalCount';
import type { Location } from '../../../../../domain/entities/Location';
import type { User } from '../../../../../domain/entities/User';
import { Badge } from '../../../../components/ui';
import { calcIra } from '../utils/countStats';

function statusBadge(status: string) {
  if (status === 'completado') return <Badge variant="success" dot>Completado</Badge>;
  if (status === 'en_progreso') return <Badge variant="warning" dot>En progreso</Badge>;
  return <Badge variant="info" dot>Borrador</Badge>;
}

export function CountHistoryCard({ count, location, supervisor, onClick }: {
  count: PhysicalCount;
  location: Location | undefined;
  supervisor: User | undefined;
  onClick: () => void;
}) {
  const countedItems = count.items.length;
  const exactItems = count.items.filter(i => i.difference === 0).length;
  const iraCount = calcIra(count.items);
  const diffItems = count.items.filter(i => i.difference !== 0);

  return (
    <div className="siga-card p-5 cursor-pointer hover:shadow-md transition-all" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-xs text-[#3B7597]">{count.id}</div>
          <div className="font-bold text-[#093C5D] mt-0.5">{location?.name ?? 'Todas las ubicaciones'}</div>
        </div>
        <div className="flex gap-2">
          <Badge variant={iraCount >= 95 ? 'success' : 'warning'}>IRA {iraCount}%</Badge>
          {statusBadge(count.status)}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center mb-3">
        <div className="p-2 bg-gray-50 rounded">
          <div className="font-bold text-[#093C5D]">{countedItems}</div>
          <div className="text-[10px] text-gray-400">contados</div>
        </div>
        <div className="p-2 bg-emerald-50 rounded">
          <div className="font-bold text-emerald-600">{exactItems}</div>
          <div className="text-[10px] text-gray-400">exactos</div>
        </div>
        <div className="p-2 bg-amber-50 rounded">
          <div className="font-bold text-amber-600">{diffItems.length}</div>
          <div className="text-[10px] text-gray-400">diferencias</div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Supervisor: {supervisor?.name ?? '—'}</span>
        <span>{count.createdAt.split(' ')[0]}</span>
      </div>
    </div>
  );
}
