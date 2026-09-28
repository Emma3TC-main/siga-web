import type { StockEntry } from '../../domain/entities/Stock';
import type { StockRepository } from '../../domain/repositories/StockRepository';
import { DEMO_STOCK } from '../../data/demo/stock';

export class DemoStockRepository implements StockRepository {
  private stock: StockEntry[] = [...DEMO_STOCK];

  async getAll(): Promise<StockEntry[]> {
    return [...this.stock];
  }

  async save(stock: StockEntry[]): Promise<void> {
    this.stock = [...stock];
  }
}
