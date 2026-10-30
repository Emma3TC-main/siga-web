import type { CreateProductCommand, Product, ProductListQuery, ProductPage, ProductType, UpdateProductCommand } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { DEMO_PRODUCTS, type LegacyDemoProduct } from '../../data/demo/products';
import { simulateLatency } from './simulateLatency';

const WRITE_LATENCY_MS = 600;

export class DemoProductRepository implements ProductRepository {
  private products: Product[] = DEMO_PRODUCTS.map(DemoProductRepository.fromLegacy);

  async list(query: ProductListQuery): Promise<ProductPage> {
    let filtered = this.products.filter(product =>
      (!query.q || `${product.sku} ${product.name}`.toLowerCase().includes(query.q.toLowerCase()))
      && (query.active === undefined || product.active === query.active)
      && (!query.categoryId || product.categoryId === query.categoryId)
      && (!query.productType || product.productType === query.productType));
    const [field, direction] = query.sort.split(',') as ['sku' | 'name', 'asc' | 'desc'];
    filtered = [...filtered].sort((left, right) => {
      const comparison = left[field].localeCompare(right[field]) || left.id.localeCompare(right.id);
      return direction === 'asc' ? comparison : -comparison;
    });
    const start = query.page * query.size;
    return { content: filtered.slice(start, start + query.size), page: query.page, size: query.size, totalElements: filtered.length };
  }

  async getById(id: string): Promise<Product | null> {
    return this.products.find(product => product.id === id) ?? null;
  }

  async create(input: CreateProductCommand): Promise<Product> {
    await simulateLatency(WRITE_LATENCY_MS);
    const product: Product = { ...input, id: `P${Date.now()}`, active: true, version: 0 };
    this.products = [...this.products, product];
    return product;
  }

  async update(id: string, input: UpdateProductCommand): Promise<Product> {
    await simulateLatency(WRITE_LATENCY_MS);
    const product: Product = { id, ...input, version: input.expectedVersion + 1 };
    this.products = this.products.map(item => (item.id === id ? product : item));
    return product;
  }

  private static fromLegacy(product: LegacyDemoProduct): Product {
    return {
      id: product.id, sku: product.sku, name: product.name, categoryId: product.categoryId,
      productType: product.type.toUpperCase() as ProductType,
      storageUnitId: product.unitId, baseUnitId: product.unitId, minStock: product.minStock,
      requiresLot: product.requiresBatch, requiresHeatNumber: product.requiresColada,
      requiresExpiry: product.requiresExpiry, requiresSerial: product.requiresSerial,
      technicalAttributes: {}, conversions: [], active: product.status === 'active', version: 0,
      type: product.type, status: product.status, unitId: product.unitId,
      requiresBatch: product.requiresBatch, requiresColada: product.requiresColada,
      description: product.description, reorderPoint: product.reorderPoint, dispatchStrategy: product.dispatchStrategy,
      avgCost: product.avgCost, sensitiveMovement: product.sensitiveMovement, observations: product.observations,
      image: product.image, vin: product.vin, assetCode: product.assetCode, brand: product.brand,
      model: product.model, hourMeter: product.hourMeter, machineryStatus: product.machineryStatus,
    };
  }
}
