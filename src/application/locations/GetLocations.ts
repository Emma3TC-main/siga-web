import type { Location } from '../../domain/entities/Location';
import type { LocationRepository } from '../../domain/repositories/LocationRepository';

export class GetLocations {
  constructor(private readonly repository: LocationRepository) {}

  execute(): Promise<Location[]> {
    return this.repository.getAll();
  }
}
