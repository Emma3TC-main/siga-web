import type { Location } from '../entities/Location';

export interface LocationRepository {
  getAll(): Promise<Location[]>;
}
