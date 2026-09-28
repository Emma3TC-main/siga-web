import type { Movement } from '../entities/Movement';
import type { Product } from '../entities/Product';

/** Longitud mínima de la búsqueda para sugerir productos. */
export const MIN_PRODUCT_SEARCH_LENGTH = 2;

export function searchProducts(products: readonly Product[], query: string): Product[] {
  if (query.length < MIN_PRODUCT_SEARCH_LENGTH) return [];
  const q = query.toLowerCase();
  return products.filter(product => product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q));
}

/** Movimientos del producto, del más reciente al más antiguo. */
export function getProductTimeline(movements: readonly Movement[], productId: string): Movement[] {
  return movements
    .filter(movement => movement.productId === productId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
