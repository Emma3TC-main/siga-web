import type { CreateUnitCommand, UnitOfMeasure } from '../entities/UnitOfMeasure';

export interface UnitRepository {
  getAll(): Promise<UnitOfMeasure[]>;
  create(unit: CreateUnitCommand): Promise<UnitOfMeasure>;
}
