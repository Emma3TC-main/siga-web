import type { CostCenter } from '../../domain/entities/CostCenter';
import type { CostCenterRepository } from '../../domain/repositories/CostCenterRepository';

export class GetCostCenters {
  constructor(private readonly repository: CostCenterRepository) {}

  execute(): Promise<CostCenter[]> {
    return this.repository.getAll();
  }
}
