import type {
  LocationActiveFilter,
  LocationCreateCommand,
  LocationUpdateCommand,
} from '../../domain/entities/LocationAdmin';
import type { LocationAdminRepository } from '../../domain/repositories/LocationAdminRepository';

export class LocationAdminUseCases {
  constructor(private readonly repository: LocationAdminRepository) {}

  listLocations(filter: LocationActiveFilter) { return this.repository.listLocations(filter); }
  getLocation(id: string) { return this.repository.getLocation(id); }
  createLocation(command: LocationCreateCommand) { return this.repository.createLocation(command); }
  updateLocation(id: string, command: LocationUpdateCommand) {
    return this.repository.updateLocation(id, command);
  }
  deactivateLocation(id: string, expectedVersion: number) {
    return this.repository.deactivateLocation(id, expectedVersion);
  }
  reactivateLocation(id: string, expectedVersion: number) {
    return this.repository.reactivateLocation(id, expectedVersion);
  }
}
