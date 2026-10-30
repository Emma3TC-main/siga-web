import type { Supplier } from '../../domain/entities/Supplier';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';

/** Activa o desactiva mediante el PUT completo y la versión observada por el usuario. */
export class SetSupplierStatus {
  constructor(private readonly repository: SupplierRepository) {}

  execute(current: Supplier, active: boolean): Promise<Supplier> {
    return this.repository.update(current.id, {
      code: current.code,
      taxId: current.taxId,
      businessName: current.businessName,
      tradeName: current.tradeName ?? '',
      contactName: current.contactName ?? '',
      phone: current.phone ?? '',
      email: current.email ?? '',
      address: current.address ?? '',
      active,
      expectedVersion: current.version,
    });
  }
}
