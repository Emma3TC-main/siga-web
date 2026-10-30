import type { Supplier, SupplierDraft } from '../../domain/entities/Supplier';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { ValidationError } from '../../domain/errors';
import { validateSupplierDraft } from '../../domain/rules/supplierRules';

export class UpdateSupplier {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(current: Supplier, draft: SupplierDraft): Promise<Supplier> {
    const errors = validateSupplierDraft(draft);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de proveedor inválidos.', errors);
    return this.repository.update(current.id, {
      ...draft,
      active: current.active,
      expectedVersion: current.version,
    });
  }
}
