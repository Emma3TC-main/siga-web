import type { StockEntry } from '../../domain/entities/Stock';
import type { StockRepository } from '../../domain/repositories/StockRepository';

export class GetStock {
  constructor(private readonly repository: StockRepository) {}

  execute(): Promise<StockEntry[]> {
    return this.repository.getAll();
  }
}
