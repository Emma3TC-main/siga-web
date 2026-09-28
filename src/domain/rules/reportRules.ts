import type { Category } from '../entities/Category';
import type { CostCenter } from '../entities/CostCenter';
import type { Movement } from '../entities/Movement';
import type { Product } from '../entities/Product';
import type { StockEntry } from '../entities/Stock';
import type { UnitOfMeasure } from '../entities/UnitOfMeasure';
import { sumQuantity, stockEntriesOfProduct } from './inventoryRules';

export interface InventoryReportRow extends Product {
  qty: number;
  cat: Category | undefined;
  unit: UnitOfMeasure | undefined;
  valuation: number;
}

/** Inventario actual valorizado (sin maquinaria), opcionalmente de una sola categoría. */
export function buildInventoryReport(
  products: readonly Product[],
  stock: readonly StockEntry[],
  categories: readonly Category[],
  units: readonly UnitOfMeasure[],
  categoryId: string,
): InventoryReportRow[] {
  return products
    .filter(product => product.type !== 'maquinaria')
    .map(product => {
      const qty = sumQuantity(stockEntriesOfProduct(stock, product.id));
      return {
        ...product,
        qty,
        cat: categories.find(category => category.id === product.categoryId),
        unit: units.find(unit => unit.id === product.unitId),
        valuation: qty * product.avgCost,
      };
    })
    .filter(row => !categoryId || row.categoryId === categoryId);
}

/** Productos en o por debajo de su stock mínimo. */
export function getReplenishmentRows(rows: readonly InventoryReportRow[]): InventoryReportRow[] {
  return rows.filter(row => row.qty <= row.minStock && row.minStock > 0);
}

export function totalValuation(rows: readonly InventoryReportRow[]): number {
  return rows.reduce((sum, row) => sum + row.valuation, 0);
}

export interface CostCenterConsumption {
  name: string;
  value: number;
  count: number;
}

/** Consumo (salidas confirmadas) por centro de costo, de mayor a menor. */
export function buildCostCenterConsumption(costCenters: readonly CostCenter[], movements: readonly Movement[]): CostCenterConsumption[] {
  return costCenters
    .map(costCenter => {
      const consumed = movements.filter(movement => movement.costCenterId === costCenter.id && movement.type === 'salida' && movement.status === 'confirmado');
      return { name: costCenter.name, value: consumed.reduce((sum, movement) => sum + (movement.totalCost ?? 0), 0), count: consumed.length };
    })
    .filter(row => row.value > 0)
    .sort((a, b) => b.value - a.value);
}

/** Suma la valorización de un tipo de producto (material, insumo, repuesto...). */
export function valuationByType(rows: readonly InventoryReportRow[], type: string): number {
  return rows.filter(row => row.type === type).reduce((sum, row) => sum + row.valuation, 0);
}

/** Porcentaje de la valorización total que aporta un tipo de producto. */
export function valuationSharePercent(rows: readonly InventoryReportRow[], type: string): number {
  const total = totalValuation(rows);
  return total > 0 ? Math.round((valuationByType(rows, type) / total) * 100) : 0;
}
