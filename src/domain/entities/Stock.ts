export interface StockEntry {
  id?: string;
  productId: string;
  locationId: string;
  quantity: number;
  batch?: string;
  serial?: string;
  expiryDate?: string;
  avgCost: number;
}
