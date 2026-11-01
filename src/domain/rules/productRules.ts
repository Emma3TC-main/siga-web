import type { Product } from '../entities/Product';

export function isActiveProduct(product: Product): boolean {
  return product.active;
}

export function isInventoryProduct(product: Product): boolean {
  return product.productType !== 'MAQUINARIA';
}

export function requiresLotIdentity(product: Product): boolean {
  return product.requiresLot || product.requiresHeatNumber || product.requiresExpiry;
}

/** Stock is expressed using Catalog's canonical storage unit. */
export function productStorageUnitId(product: Product): string {
  return product.storageUnitId;
}
