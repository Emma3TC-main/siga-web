export interface StockEntry {
  productId: string;
  locationId: string;
  quantity: number;
  batch?: string;
  serial?: string;
  expiryDate?: string;
  avgCost: number;
}
