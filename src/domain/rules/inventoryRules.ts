import type { Category } from '../entities/Category';
import type { Location } from '../entities/Location';
import type { Product, ProductStatus } from '../entities/Product';
import type { StockEntry } from '../entities/Stock';
import type { UnitOfMeasure } from '../entities/UnitOfMeasure';

/** Días de anticipación desde los cuales un lote se considera "próximo a vencer". */
export const EXPIRY_WARNING_DAYS = 60;

const MS_PER_DAY = 86400000;

/** Días hasta el vencimiento (negativo si ya venció). */
export function daysUntilExpiry(expiryDate: string, now: number = Date.now()): number {
  return (new Date(expiryDate).getTime() - now) / MS_PER_DAY;
}

export type InventoryStatus = Extract<ProductStatus, 'sin_stock' | 'bajo_stock' | 'vencido' | 'proximo_vencer' | 'normal'>;

export function getInventoryStatus(stock: number, minStock: number, expiryDate?: string): InventoryStatus {
  if (stock === 0 && minStock > 0) return 'sin_stock';
  if (stock < minStock && minStock > 0) return 'bajo_stock';
  if (expiryDate) {
    const days = daysUntilExpiry(expiryDate);
    if (days < 0) return 'vencido';
    if (days <= EXPIRY_WARNING_DAYS) return 'proximo_vencer';
  }
  return 'normal';
}

export function sumQuantity(entries: readonly StockEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.quantity, 0);
}

export function stockEntriesOfProduct(stock: readonly StockEntry[], productId: string): StockEntry[] {
  return stock.filter(entry => entry.productId === productId);
}

/** Entrada de stock con el vencimiento más cercano. */
export function nearestExpiryEntry(entries: readonly StockEntry[]): StockEntry | undefined {
  return entries
    .filter(entry => entry.expiryDate)
    .sort((a, b) => ((a.expiryDate ?? '') < (b.expiryDate ?? '') ? -1 : 1))[0];
}

/** `status` sustituye al estado activo/inactivo del producto, igual que la consulta original. */
export interface InventoryRow extends Omit<Product, 'status'> {
  totalQty: number;
  status: InventoryStatus;
  nearestExpiry: StockEntry | undefined;
  cat: Category | undefined;
  unit: UnitOfMeasure | undefined;
  valuation: number;
}

/** Filas de la consulta de inventario: un producto (no maquinaria) con su stock total, estado y valorización. */
export function buildInventoryRows(
  products: readonly Product[],
  stock: readonly StockEntry[],
  categories: readonly Category[],
  units: readonly UnitOfMeasure[],
): InventoryRow[] {
  return products
    .filter(product => product.type !== 'maquinaria')
    .map(product => {
      const entries = stockEntriesOfProduct(stock, product.id);
      const totalQty = sumQuantity(entries);
      const nearestExpiry = nearestExpiryEntry(entries);
      return {
        ...product,
        totalQty,
        status: getInventoryStatus(totalQty, product.minStock, nearestExpiry?.expiryDate),
        nearestExpiry,
        cat: categories.find(category => category.id === product.categoryId),
        unit: units.find(unit => unit.id === product.unitId),
        valuation: totalQty * product.avgCost,
      };
    });
}

export interface InventoryFilters {
  search: string;
  type: string;
  status: string;
  categoryId: string;
}

export function filterInventoryRows(rows: readonly InventoryRow[], filters: InventoryFilters): InventoryRow[] {
  const query = filters.search.toLowerCase();
  return rows.filter(row => {
    if (query && !row.name.toLowerCase().includes(query) && !row.sku.toLowerCase().includes(query)) return false;
    if (filters.type && row.type !== filters.type) return false;
    if (filters.status && row.status !== filters.status) return false;
    if (filters.categoryId && row.categoryId !== filters.categoryId) return false;
    return true;
  });
}

/** Id de la ubicación y de todas sus descendientes. */
export function getLocationDescendantIds(id: string, locations: readonly Location[]): string[] {
  const children = locations.filter(location => location.parentId === id);
  return [id, ...children.flatMap(child => getLocationDescendantIds(child.id, locations))];
}
