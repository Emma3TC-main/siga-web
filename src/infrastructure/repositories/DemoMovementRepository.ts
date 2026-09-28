import type { Movement } from '../../domain/entities/Movement';
import type { MovementRepository } from '../../domain/repositories/MovementRepository';
import { DEMO_MOVEMENTS } from '../../data/demo/movements';

export class DemoMovementRepository implements MovementRepository {
  private movements: Movement[] = [...DEMO_MOVEMENTS];

  async getAll(): Promise<Movement[]> {
    return [...this.movements];
  }

  async getById(id: string): Promise<Movement | null> {
    return this.movements.find(movement => movement.id === id) ?? null;
  }

  async add(movement: Movement): Promise<Movement> {
    this.movements = [movement, ...this.movements];
    return movement;
  }

  async update(movement: Movement): Promise<Movement> {
    this.movements = this.movements.map(item => (item.id === movement.id ? movement : item));
    return movement;
  }
}
