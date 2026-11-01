import type { StockEntry } from '../entities/Stock';

export interface StockCostSummary {
  quantity: number;
  valuation: number;
  avgCost: number;
}

/** Valuation of one canonical stock balance. */
export function stockEntryValuation(entry: StockEntry): number {
  return entry.quantity * entry.avgCost;
}

/** Product-wide totals derived from balances; never from Catalog Product metadata. */
export function aggregateStockCost(entries: readonly StockEntry[]): StockCostSummary {
  const quantity = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const valuation = entries.reduce((sum, entry) => sum + stockEntryValuation(entry), 0);
  return { quantity, valuation, avgCost: quantity > 0 ? valuation / quantity : 0 };
}

export interface StockBalanceDimensions {
  productId: string;
  locationId: string;
  lotId?: string | null;
  assetId?: string | null;
}

function sameNullableDimension(left: string | undefined, right: string | null | undefined): boolean {
  return (left ?? null) === (right || null);
}

/** Resolves one exact stock-balance dimension, including nullable lot and asset semantics. */
export function findExactStockEntry(
  entries: readonly StockEntry[],
  dimensions: StockBalanceDimensions,
): StockEntry | undefined {
  return entries.find(entry =>
    entry.productId === dimensions.productId
    && entry.locationId === dimensions.locationId
    && sameNullableDimension(entry.batch, dimensions.lotId)
    && sameNullableDimension(entry.serial, dimensions.assetId)
  );
}
