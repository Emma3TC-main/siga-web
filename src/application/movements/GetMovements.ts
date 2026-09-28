import type { Movement } from '../../domain/entities/Movement';
import type { MovementRepository } from '../../domain/repositories/MovementRepository';

export class GetMovements {
  constructor(private readonly repository: MovementRepository) {}

  execute(): Promise<Movement[]> {
    return this.repository.getAll();
  }
}
