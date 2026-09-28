import type { CostCenter } from '../entities/CostCenter';

export interface CostCenterRepository {
  getAll(): Promise<CostCenter[]>;
}
