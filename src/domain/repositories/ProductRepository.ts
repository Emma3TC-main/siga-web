import type { NewProduct, Product } from '../entities/Product';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(product: NewProduct): Promise<Product>;
  update(product: Product): Promise<Product>;
}
