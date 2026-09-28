import type { Location } from '../../domain/entities/Location';
import type { LocationRepository } from '../../domain/repositories/LocationRepository';
import { DEMO_LOCATIONS } from '../../data/demo/locations';

export class DemoLocationRepository implements LocationRepository {
  private readonly locations: Location[] = [...DEMO_LOCATIONS];

  async getAll(): Promise<Location[]> {
    return [...this.locations];
  }
}
