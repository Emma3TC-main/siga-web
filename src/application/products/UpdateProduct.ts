import type { Product, ProductChanges } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { NotFoundError, ValidationError } from '../../domain/errors';
import { validateProductIdentity } from '../../domain/rules/catalogRules';

export class UpdateProduct {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string, changes: ProductChanges): Promise<Product> {
    const existing = await this.repository.getById(id);
    if (!existing) throw new NotFoundError('Producto', id);

    const updated: Product = { ...existing, ...changes };
    const errors = validateProductIdentity(updated);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de producto inválidos.', errors);

    return this.repository.update(updated);
  }
}
