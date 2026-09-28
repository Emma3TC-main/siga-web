import type { PhysicalCount } from '../entities/PhysicalCount';

export interface PhysicalCountRepository {
  getAll(): Promise<PhysicalCount[]>;
}
