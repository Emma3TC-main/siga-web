import type { NewProduct, Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { DEMO_PRODUCTS } from '../../data/demo/products';
import { simulateLatency } from './simulateLatency';

const WRITE_LATENCY_MS = 600;

export class DemoProductRepository implements ProductRepository {
  private products: Product[] = [...DEMO_PRODUCTS];

  async getAll(): Promise<Product[]> {
    return [...this.products];
  }

  async getById(id: string): Promise<Product | null> {
    return this.products.find(product => product.id === id) ?? null;
  }

  async create(input: NewProduct): Promise<Product> {
    await simulateLatency(WRITE_LATENCY_MS);
    const product: Product = { ...input, id: `P${Date.now()}` };
    this.products = [...this.products, product];
    return product;
  }

  async update(product: Product): Promise<Product> {
    await simulateLatency(WRITE_LATENCY_MS);
    this.products = this.products.map(item => (item.id === product.id ? product : item));
    return product;
  }
}
