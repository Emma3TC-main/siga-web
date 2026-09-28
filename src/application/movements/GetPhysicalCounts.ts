import type { PhysicalCount } from '../../domain/entities/PhysicalCount';
import type { PhysicalCountRepository } from '../../domain/repositories/PhysicalCountRepository';

export class GetPhysicalCounts {
  constructor(private readonly repository: PhysicalCountRepository) {}

  execute(): Promise<PhysicalCount[]> {
    return this.repository.getAll();
  }
}
