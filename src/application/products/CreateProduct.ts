import type { CreateProductCommand, Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ValidationError } from '../../domain/errors';
import { validateProduct } from '../../domain/rules/catalogRules';

export type CreateProductInput = CreateProductCommand;

export class CreateProduct {
  constructor(private readonly repository: ProductRepository) {}
  async execute(input: CreateProductInput): Promise<Product> {
    const errors = validateProduct(input);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de producto inválidos.', errors);
    return this.repository.create({
      ...input,
      sku: input.sku.trim(),
      name: input.name.trim(),
      technicalAttributes: structuredClone(input.technicalAttributes),
      conversions: input.conversions.map(conversion => ({ ...conversion })),
    });
  }
}
