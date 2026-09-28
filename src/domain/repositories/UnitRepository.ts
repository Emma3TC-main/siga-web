import type { NewUnitOfMeasure, UnitOfMeasure } from '../entities/UnitOfMeasure';

export interface UnitRepository {
  getAll(): Promise<UnitOfMeasure[]>;
  create(unit: NewUnitOfMeasure): Promise<UnitOfMeasure>;
}
