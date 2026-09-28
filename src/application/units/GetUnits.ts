import type { UnitOfMeasure } from '../../domain/entities/UnitOfMeasure';
import type { UnitRepository } from '../../domain/repositories/UnitRepository';

export class GetUnits {
  constructor(private readonly repository: UnitRepository) {}

  execute(): Promise<UnitOfMeasure[]> {
    return this.repository.getAll();
  }
}
