import type { NewUnitOfMeasure, UnitOfMeasure } from '../../domain/entities/UnitOfMeasure';
import type { UnitRepository } from '../../domain/repositories/UnitRepository';
import { DEMO_UNITS } from '../../data/demo/units';

export class DemoUnitRepository implements UnitRepository {
  private units: UnitOfMeasure[] = [...DEMO_UNITS];

  async getAll(): Promise<UnitOfMeasure[]> {
    return [...this.units];
  }

  async create(input: NewUnitOfMeasure): Promise<UnitOfMeasure> {
    const unit: UnitOfMeasure = { ...input, id: `un-${Date.now()}` };
    this.units = [...this.units, unit];
    return unit;
  }
}
