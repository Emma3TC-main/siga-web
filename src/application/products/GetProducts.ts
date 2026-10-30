import type { ProductListQuery, ProductPage } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class GetProducts {
  constructor(private readonly repository: ProductRepository) {}
  execute(query: ProductListQuery): Promise<ProductPage> { return this.repository.list(query); }
}
