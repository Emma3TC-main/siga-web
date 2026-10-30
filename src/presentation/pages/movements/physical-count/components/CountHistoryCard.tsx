import type { PhysicalCount } from '../../../../../domain/entities/PhysicalCount';
import type { Location } from '../../../../../domain/entities/Location';
import { Badge } from '../../../../components/ui';
import { calcIra } from '../utils/countStats';

function statusBadge(status: string) {
  if (status === 'COMPLETED') return <Badge variant="success" dot>Completado</Badge>;
  if (status === 'CANCELLED') return <Badge variant="error" dot>Cancelado</Badge>;
  if (status === 'IN_PROGRESS') return <Badge variant="warning" dot>En progreso</Badge>;
  return <Badge variant="info" dot>Borrador</Badge>;
}

export function CountHistoryCard({ count, location, onClick }: {
  count: PhysicalCount;
  location: Location | undefined;
  onClick: () => void;
}) {
  const countedItems = count.lines.filter(line => line.countedQuantity !== null).length;
  const exactItems = count.lines.filter(line => line.difference === 0).length;
  const iraCount = calcIra(count.lines);
  const diffItems = count.lines.filter(line => line.difference !== null && line.difference !== 0);

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
        <span title={count.createdByUserId}>Actor: {shortId(count.createdByUserId)}</span>
        <span>{new Date(count.createdAt).toLocaleDateString('es-PE')}</span>
      </div>
    </div>
  );
}

function shortId(value: string) {
  return value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value;
}
