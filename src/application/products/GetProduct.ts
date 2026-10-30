import type { Product } from '../../domain/entities/Product';
import { NotFoundError } from '../../domain/errors';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class GetProduct {
  constructor(private readonly repository: ProductRepository) {}
  async execute(id: string): Promise<Product> {
    const product = await this.repository.getById(id);
    if (!product) throw new NotFoundError('Producto', id);
    return product;
  }
}
