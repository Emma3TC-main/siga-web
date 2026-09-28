import type { Supplier } from '../../domain/entities/Supplier';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { NotFoundError } from '../../domain/errors';

/** Activa o desactiva un proveedor sin alterar el resto de sus datos. */
export class SetSupplierStatus {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(id: string, status: Supplier['status']): Promise<Supplier> {
    const existing = await this.repository.getById(id);
    if (!existing) throw new NotFoundError('Proveedor', id);

    return this.repository.update({ ...existing, status });
  }
}
