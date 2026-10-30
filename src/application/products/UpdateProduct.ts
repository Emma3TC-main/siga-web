import type { CreateProductCommand, Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ValidationError } from '../../domain/errors';
import { validateProduct } from '../../domain/rules/catalogRules';

export class UpdateProduct {
  constructor(private readonly repository: ProductRepository) {}
  async execute(current: Product, input: CreateProductCommand): Promise<Product> {
    const errors = validateProduct(input);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de producto inválidos.', errors);
    return this.repository.update(current.id, {
      ...input,
      sku: input.sku.trim(),
      name: input.name.trim(),
      technicalAttributes: structuredClone(input.technicalAttributes),
      conversions: input.conversions.map(conversion => ({ ...conversion })),
      active: current.active,
      expectedVersion: current.version,
    });
  }
}
