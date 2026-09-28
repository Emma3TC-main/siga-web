import type { Supplier, SupplierDraft } from '../../domain/entities/Supplier';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { NotFoundError, ValidationError } from '../../domain/errors';
import { validateSupplierDraft } from '../../domain/rules/supplierRules';

export class UpdateSupplier {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(id: string, draft: SupplierDraft): Promise<Supplier> {
    const existing = await this.repository.getById(id);
    if (!existing) throw new NotFoundError('Proveedor', id);

    const errors = validateSupplierDraft(draft, await this.repository.getAll(), id);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de proveedor inválidos.', errors);

    return this.repository.update({ ...existing, ...draft });
  }
}
