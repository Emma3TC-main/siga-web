import type { Movement } from '../entities/Movement';
import type { PhysicalCount } from '../entities/PhysicalCount';
import type { Product } from '../entities/Product';
import type { StockEntry } from '../entities/Stock';
import { sumQuantity, stockEntriesOfProduct } from './inventoryRules';
import { getMachinery, machineryAvailability } from './machineryRules';

export interface AnalyticsKpis {
  operativeMachinery: number;
  totalMachinery: number;
  machineryAvailability: number;
  totalStockValue: number;
  consumedValue: number;
  rotation: number;
  countedItems: number;
  exactItems: number;
  /** Exactitud del registro de inventario (IRA), en %. */
  ira: number;
  adjustmentsCount: number;
  adjustmentRate: number;
  productsWithoutMovement: number;
}

export function computeAnalyticsKpis(
  products: readonly Product[],
  stock: readonly StockEntry[],
  movements: readonly Movement[],
  physicalCounts: readonly PhysicalCount[],
): AnalyticsKpis {
  const machinery = getMachinery(products);
  const operative = machinery.filter(machine => machine.machineryStatus === 'operativo').length;

  const totalValue = products
    .map(product => sumQuantity(stockEntriesOfProduct(stock, product.id)) * product.avgCost)
    .reduce((sum, value) => sum + value, 0);
  const consumed = movements
    .filter(movement => movement.type === 'salida' && movement.status === 'confirmado')
    .reduce((sum, movement) => sum + (movement.totalCost ?? 0), 0);
  const rotation = totalValue > 0 ? Math.round((consumed / totalValue) * 100) / 100 : 0;

  const countedItems = physicalCounts.reduce((sum, count) => sum + count.items.length, 0);
  const exactItems = physicalCounts.reduce((sum, count) => sum + count.items.filter(item => item.difference === 0).length, 0);
  const ira = countedItems > 0 ? Math.round((exactItems / countedItems) * 1000) / 10 : 0;

  const adjustments = movements.filter(movement => (movement.type === 'ajuste_positivo' || movement.type === 'ajuste_negativo') && movement.status === 'confirmado');
  const adjustmentRate = movements.length > 0 ? Math.round((adjustments.length / movements.length) * 1000) / 10 : 0;

  return {
    operativeMachinery: operative,
    totalMachinery: machinery.length,
    machineryAvailability: machineryAvailability(machinery),
    totalStockValue: totalValue,
    consumedValue: consumed,
    rotation,
    countedItems,
    exactItems,
    ira,
    adjustmentsCount: adjustments.length,
    adjustmentRate,
    productsWithoutMovement: products.filter(product => product.type !== 'maquinaria' && !movements.find(movement => movement.productId === product.id)).length,
  };
}
