import type { NewProduct, Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ValidationError } from '../../domain/errors';
import { validateProductIdentity } from '../../domain/rules/catalogRules';

/** Datos que aporta el usuario; el resto de campos toma sus valores por defecto de negocio. */
export type CreateProductInput = Pick<
  NewProduct,
  | 'name' | 'sku' | 'type' | 'categoryId' | 'unitId' | 'description'
  | 'minStock' | 'reorderPoint' | 'avgCost'
  | 'sensitiveMovement' | 'requiresBatch' | 'requiresSerial' | 'requiresExpiry' | 'requiresColada'
>;

export class CreateProduct {
  constructor(private readonly repository: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const errors = validateProductIdentity(input);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de producto inválidos.', errors);

    return this.repository.create({
      ...input,
      status: 'active',
      dispatchStrategy: 'FIFO',
      observations: '',
    });
  }
}
