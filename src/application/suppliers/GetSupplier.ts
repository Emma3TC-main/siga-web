import type { Supplier } from '../../domain/entities/Supplier';
import { NotFoundError } from '../../domain/errors';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';

export class GetSupplier {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(id: string): Promise<Supplier> {
    const supplier = await this.repository.getById(id);
    if (!supplier) throw new NotFoundError('Proveedor', id);
    return supplier;
  }
}
