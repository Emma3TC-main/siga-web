import type { PhysicalCount } from '../../domain/entities/PhysicalCount';
import type { PhysicalCountRepository } from '../../domain/repositories/PhysicalCountRepository';
import { DEMO_PHYSICAL_COUNTS } from '../../data/demo/physicalCounts';

export class DemoPhysicalCountRepository implements PhysicalCountRepository {
  private readonly counts: PhysicalCount[] = [...DEMO_PHYSICAL_COUNTS];

  async getAll(): Promise<PhysicalCount[]> {
    return [...this.counts];
  }
}
