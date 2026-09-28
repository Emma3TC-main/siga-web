import type { AuditRepository } from '../../domain/repositories/AuditRepository';
import type { MovementRepository } from '../../domain/repositories/MovementRepository';
import type { StockRepository } from '../../domain/repositories/StockRepository';
import { applyConfirmedMovement } from '../../domain/rules/movementRules';

export interface ConfirmMovementInput {
  movementId: string;
  confirmerId: string;
  online: boolean;
}

export type ConfirmMovementResult =
  | { outcome: 'confirmed'; movementId: string }
  /** Confirmar una operación sensible exige conexión. */
  | { outcome: 'offline' }
  /** El movimiento no existe o no está autorizado: no hay nada que confirmar. */
  | { outcome: 'ignored' }
  | { outcome: 'conflict'; message: string };

/** Confirma (con segundo factor) un movimiento ya autorizado y recién entonces afecta el stock. */
export class ConfirmMovement {
  constructor(
    private readonly movements: MovementRepository,
    private readonly stock: StockRepository,
    private readonly audit: AuditRepository,
    private readonly clock: () => Date = () => new Date(),
  ) {}

  async execute({ movementId, confirmerId, online }: ConfirmMovementInput): Promise<ConfirmMovementResult> {
    if (!online) return { outcome: 'offline' };

    const movement = await this.movements.getById(movementId);
    if (!movement || movement.status !== 'autorizado') return { outcome: 'ignored' };

    const applied = applyConfirmedMovement(await this.stock.getAll(), movement);
    if (applied.conflict) return { outcome: 'conflict', message: applied.conflict };

    await this.stock.save(applied.stock);
    await this.movements.update({
      ...movement,
      status: 'confirmado',
      confirmedAt: this.clock().toLocaleString('es-PE'),
      version: (movement.version ?? 1) + 1,
    });
    await this.audit.add({
      userId: confirmerId,
      action: 'CONFIRM_MFA',
      module: 'Movimientos',
      object: `Movimiento ${movement.id}`,
      result: 'success',
      description: `Movimiento ${movement.id} confirmado con segundo factor.`,
    });
    return { outcome: 'confirmed', movementId: movement.id };
  }
}
