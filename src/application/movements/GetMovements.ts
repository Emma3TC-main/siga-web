import type { Movement } from '../../domain/entities/Movement';
import type { MovementHistoryPage, MovementHistoryQuery, MovementRepository } from '../../domain/repositories/MovementRepository';

export class GetMovements {
  constructor(private readonly repository: MovementRepository) {}

  execute(): Promise<Movement[]> {
    return this.repository.getAll();
  }

  search(query?: MovementHistoryQuery): Promise<MovementHistoryPage> {
    return this.repository.search(query);
  }

  getById(id: string): Promise<Movement | null> {
    return this.repository.getById(id);
  }
}
