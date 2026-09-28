import type { PhysicalCount } from '../../../../../domain/entities/PhysicalCount';
import type { Location } from '../../../../../domain/entities/Location';
import type { User } from '../../../../../domain/entities/User';
import { Button, EmptyState, PackageIcon } from '../../../../components/ui';
import { CountHistoryCard } from './CountHistoryCard';

export function PhysicalCountHistory({ physicalCounts, locations, users, onSelect, onNew }: {
  physicalCounts: PhysicalCount[];
  locations: Location[];
  users: User[];
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
            supervisor={users.find(u => u.id === count.createdBy)}
            onClick={() => onSelect(count.id)}
          />
        ))}
      </div>
    </div>
  );
}
