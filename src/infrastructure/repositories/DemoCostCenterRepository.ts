import type { CostCenter } from '../../domain/entities/CostCenter';
import type { CostCenterRepository } from '../../domain/repositories/CostCenterRepository';
import { DEMO_COST_CENTERS } from '../../data/demo/costCenters';

export class DemoCostCenterRepository implements CostCenterRepository {
  private readonly costCenters: CostCenter[] = [...DEMO_COST_CENTERS];

  async getAll(): Promise<CostCenter[]> {
    return [...this.costCenters];
  }
}
