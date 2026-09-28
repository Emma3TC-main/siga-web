import type { Supplier } from '../../domain/entities/Supplier';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';

export class GetSuppliers {
  constructor(private readonly repository: SupplierRepository) {}

  execute(): Promise<Supplier[]> {
    return this.repository.getAll();
  }
}
