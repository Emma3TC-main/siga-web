import type { Movement } from '../../domain/entities/Movement';
import type { AlertRepository } from '../../domain/repositories/AlertRepository';
import type { AuditRepository } from '../../domain/repositories/AuditRepository';
import type { AuthorizationRepository } from '../../domain/repositories/AuthorizationRepository';
import type { MovementRepository } from '../../domain/repositories/MovementRepository';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import type { StockRepository } from '../../domain/repositories/StockRepository';
import { sumQuantity, stockEntriesOfProduct } from '../../domain/rules/inventoryRules';
import {
  applyConfirmedMovement, buildAuthorizationFor, buildOutOfStockAlert, buildPendingAuthorizationAlert,
} from '../../domain/rules/movementRules';

export interface RegisterMovementInput {
  movement: Movement;
  /** Conectividad del cliente: sin conexión solo se conservan borradores. */
  online: boolean;
}

export type RegisterMovementResult =
  | { outcome: 'registered'; movement: Movement }
  /** Sin conexión, la operación no se registró. */
  | { outcome: 'offline' }
  /** El stock disponible no alcanza: no se registró ni cambió el stock (409). */
  | { outcome: 'conflict'; message: string };

export class RegisterMovement {
  constructor(
    private readonly movements: MovementRepository,
    private readonly stock: StockRepository,
    private readonly authorizations: AuthorizationRepository,
    private readonly alerts: AlertRepository | null,
    private readonly audit: AuditRepository,
    private readonly products: ProductRepository,
    private readonly clock: () => Date = () => new Date(),
  ) {}

  async execute({ movement, online }: RegisterMovementInput): Promise<RegisterMovementResult> {
    if (!online && movement.status !== 'borrador') return { outcome: 'offline' };

    const authoritative = this.movements.isAuthoritative;

    if (!authoritative) {
      if (!this.alerts) throw new Error('Demo alert persistence is not configured');
      const alerts = this.alerts;
      let stock = await this.stock.getAll();
      if (movement.status === 'confirmado') {
        const applied = applyConfirmedMovement(stock, movement);
        if (applied.conflict) return { outcome: 'conflict', message: applied.conflict };
        stock = applied.stock;
        await this.stock.save(stock);
      }

      const now = this.clock();
      if (movement.isSensitive && movement.status === 'pendiente_autorizacion') {
        const authorization = buildAuthorizationFor(movement, now);
        await this.authorizations.add(authorization);
        await alerts.add(buildPendingAuthorizationAlert(movement, authorization, now));
      }

      const product = await this.products.getById(movement.productId);
      if (product && sumQuantity(stockEntriesOfProduct(stock, movement.productId)) === 0) {
        const alreadyAlerted = (await alerts.getAll()).some(alert => alert.productId === movement.productId && alert.type === 'sin_stock');
        if (!alreadyAlerted) await alerts.add(buildOutOfStockAlert(product, now));
      }
    }

    const savedMovement = await this.movements.add(movement);
    if (!authoritative) {
      const confirmed = savedMovement.status === 'confirmado';
      await this.audit.add({
        userId: savedMovement.registeredBy,
        action: 'CREATE',
        module: 'Movimientos',
        object: `Movimiento ${savedMovement.id}`,
        result: confirmed ? 'success' : 'warning',
        description: `${savedMovement.type} ${confirmed ? 'confirmado' : 'pendiente'}: ${savedMovement.quantity} uds de producto ${savedMovement.productId}`,
      });
    }

    return { outcome: 'registered', movement: savedMovement };
  }

  submitExisting(movementId: string): Promise<Movement> {
    return this.movements.submit(movementId);
  }
}
