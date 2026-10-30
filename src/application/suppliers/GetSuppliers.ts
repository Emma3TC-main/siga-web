import type { SupplierListQuery, SupplierPage } from '../../domain/entities/Supplier';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';

export class GetSuppliers {
  constructor(private readonly repository: SupplierRepository) {}

  execute(query: SupplierListQuery): Promise<SupplierPage> {
    return this.repository.list(query);
  }
}
