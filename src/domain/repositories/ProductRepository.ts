import type { CreateProductCommand, Product, ProductListQuery, ProductPage, UpdateProductCommand } from '../entities/Product';

export interface ProductRepository {
  list(query: ProductListQuery): Promise<ProductPage>;
  getById(id: string): Promise<Product | null>;
  create(product: CreateProductCommand): Promise<Product>;
  update(id: string, product: UpdateProductCommand): Promise<Product>;
}
