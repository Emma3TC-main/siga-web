import type {
  LocationActiveFilter,
  LocationAdmin,
  LocationCreateCommand,
  LocationType,
  LocationUpdateCommand,
} from '../../domain/entities/LocationAdmin';
import type { LocationAdminRepository } from '../../domain/repositories/LocationAdminRepository';
import { DEMO_LOCATIONS } from '../../data/demo/locations';

const toCanonicalType = (value: string): LocationType => value.toUpperCase() as LocationType;

export class DemoLocationAdminRepository implements LocationAdminRepository {
  private locations: LocationAdmin[] = DEMO_LOCATIONS.map(location => ({
    id: location.id,
    code: location.code,
    name: location.name,
    locationType: toCanonicalType(location.type),
    parentId: location.parentId ?? null,
    active: location.status === 'active',
    version: 0,
  }));

  async listLocations(filter: LocationActiveFilter): Promise<LocationAdmin[]> {
    return this.locations.filter(location => filter === 'all'
      || (filter === 'active' ? location.active : !location.active)).map(location => ({ ...location }));
  }

  async getLocation(id: string): Promise<LocationAdmin> {
    return { ...this.required(id) };
  }

  async createLocation(command: LocationCreateCommand): Promise<LocationAdmin> {
    const created: LocationAdmin = { ...command, id: crypto.randomUUID(), active: true, version: 0 };
    this.locations = [...this.locations, created];
    return { ...created };
  }

  async updateLocation(id: string, command: LocationUpdateCommand): Promise<LocationAdmin> {
    const current = this.required(id);
    if (current.version !== command.expectedVersion) throw new Error('VERSION_CONFLICT');
    const unchanged = current.name === command.name && current.locationType === command.locationType
      && current.parentId === command.parentId;
    const updated = unchanged ? current : {
      ...current,
      name: command.name,
      locationType: command.locationType,
      parentId: command.parentId,
      version: current.version + 1,
    };
    this.replace(updated);
    return { ...updated };
  }

  async deactivateLocation(id: string, expectedVersion: number): Promise<LocationAdmin> {
    return this.setActive(id, false, expectedVersion);
  }

  async reactivateLocation(id: string, expectedVersion: number): Promise<LocationAdmin> {
    return this.setActive(id, true, expectedVersion);
  }

  private setActive(id: string, active: boolean, expectedVersion: number): LocationAdmin {
    const current = this.required(id);
    if (current.version !== expectedVersion) throw new Error('VERSION_CONFLICT');
    const updated = current.active === active ? current : { ...current, active, version: current.version + 1 };
    this.replace(updated);
    return { ...updated };
  }

  private required(id: string): LocationAdmin {
    const location = this.locations.find(candidate => candidate.id === id);
    if (!location) throw new Error('LOCATION_NOT_FOUND');
    return location;
  }

  private replace(location: LocationAdmin) {
    this.locations = this.locations.map(current => current.id === location.id ? location : current);
  }
}
