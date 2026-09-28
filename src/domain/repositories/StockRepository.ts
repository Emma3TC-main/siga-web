import type { StockEntry } from '../entities/Stock';

export interface StockRepository {
  getAll(): Promise<StockEntry[]>;
  /** Persiste el stock resultante de aplicar un movimiento confirmado. */
  save(stock: StockEntry[]): Promise<void>;
}
