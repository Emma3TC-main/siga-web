import type { Supplier, SupplierDraft } from '../../domain/entities/Supplier';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { ValidationError } from '../../domain/errors';
import { validateSupplierDraft } from '../../domain/rules/supplierRules';

export class CreateSupplier {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(draft: SupplierDraft): Promise<Supplier> {
    const errors = validateSupplierDraft(draft, await this.repository.getAll());
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de proveedor inválidos.', errors);

    return this.repository.create({ ...draft, status: 'active' });
  }
}
