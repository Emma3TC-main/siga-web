import type { Movement } from '../entities/Movement';

export interface MovementRepository {
  getAll(): Promise<Movement[]>;
  getById(id: string): Promise<Movement | null>;
  /** El movimiento nuevo queda primero (orden más reciente → más antiguo). */
  add(movement: Movement): Promise<Movement>;
  /** Reintenta el envío de un movimiento que ya fue creado. */
  submit(id: string): Promise<Movement>;
  update(movement: Movement): Promise<Movement>;
  readonly isAuthoritative?: boolean;
}
