import type { Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class SetProductStatus {
  constructor(private readonly repository: ProductRepository) {}
  execute(current: Product, active: boolean): Promise<Product> {
    return this.repository.update(current.id, {
      sku: current.sku,
      name: current.name,
      categoryId: current.categoryId,
      productType: current.productType,
      storageUnitId: current.storageUnitId,
      baseUnitId: current.baseUnitId,
      minStock: current.minStock,
      requiresLot: current.requiresLot,
      requiresHeatNumber: current.requiresHeatNumber,
      requiresExpiry: current.requiresExpiry,
      requiresSerial: current.requiresSerial,
      technicalAttributes: structuredClone(current.technicalAttributes),
      conversions: current.conversions.map(conversion => ({ ...conversion })),
      active,
      expectedVersion: current.version,
    });
  }
}
