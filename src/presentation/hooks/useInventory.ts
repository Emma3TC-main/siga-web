import { useCallback, useMemo } from 'react';
import { buildInventoryRows, stockEntriesOfProduct } from '../../domain/rules/inventoryRules';
import { useCategories } from './useCategories';
import { useProducts } from './useProducts';
import { useStock } from './useStock';
import { useUnits } from './useUnits';

/** Consulta de inventario: el cálculo vive en `domain/rules/inventoryRules`. */
export function useInventory() {
  const { stock } = useStock();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { units } = useUnits();

  const rows = useMemo(() => buildInventoryRows(products, stock, categories, units), [products, stock, categories, units]);
  const getStockEntries = useCallback((productId: string) => stockEntriesOfProduct(stock, productId), [stock]);
  return { rows, getStockEntries };
}
