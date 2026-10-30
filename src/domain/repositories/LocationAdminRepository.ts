import type {
  LocationActiveFilter,
  LocationAdmin,
  LocationCreateCommand,
  LocationUpdateCommand,
} from '../entities/LocationAdmin';

export interface LocationAdminRepository {
  listLocations(activeFilter: LocationActiveFilter): Promise<LocationAdmin[]>;
  getLocation(id: string): Promise<LocationAdmin>;
  createLocation(command: LocationCreateCommand): Promise<LocationAdmin>;
  updateLocation(id: string, command: LocationUpdateCommand): Promise<LocationAdmin>;
  deactivateLocation(id: string, expectedVersion: number): Promise<LocationAdmin>;
  reactivateLocation(id: string, expectedVersion: number): Promise<LocationAdmin>;
}
