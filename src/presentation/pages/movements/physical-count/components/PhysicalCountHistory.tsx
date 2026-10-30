import type { PhysicalCount } from '../../../../../domain/entities/PhysicalCount';
import type { Location } from '../../../../../domain/entities/Location';
import { Button, EmptyState, PackageIcon } from '../../../../components/ui';
import { CountHistoryCard } from './CountHistoryCard';

export function PhysicalCountHistory({ physicalCounts, locations, page, size, totalElements, onPageChange, onSelect, onNew }: {
  physicalCounts: PhysicalCount[];
  locations: Location[];
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <div>
      <h3 className="font-semibold text-[#093C5D] mb-3">Historial de conteos</h3>
      {physicalCounts.length === 0 && (
        <EmptyState icon={<PackageIcon size={48} />} title="No hay conteos registrados" description="Cree el primer conteo físico"
          action={<Button variant="primary" size="sm" onClick={onNew}>Iniciar conteo</Button>} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {physicalCounts.map(count => (
          <CountHistoryCard
            key={count.id}
            count={count}
            location={locations.find(l => l.id === count.locationId)}
            onClick={() => onSelect(count.id)}
          />
        ))}
      </div>
      {totalElements > size && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Página {page + 1} · {totalElements} conteos</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => onPageChange(page - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={(page + 1) * size >= totalElements} onClick={() => onPageChange(page + 1)}>Siguiente</Button>
          </div>
        </div>
      )}
    </div>
  );
}
