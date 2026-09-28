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
  | { outcome: 'registered' }
  /** Sin conexión, la operación no se registró. */
  | { outcome: 'offline' }
  /** El stock disponible no alcanza: no se registró ni cambió el stock (409). */
  | { outcome: 'conflict'; message: string };

export class RegisterMovement {
  constructor(
    private readonly movements: MovementRepository,
    private readonly stock: StockRepository,
    private readonly authorizations: AuthorizationRepository,
    private readonly alerts: AlertRepository,
    private readonly audit: AuditRepository,
    private readonly products: ProductRepository,
    private readonly clock: () => Date = () => new Date(),
  ) {}

  async execute({ movement, online }: RegisterMovementInput): Promise<RegisterMovementResult> {
    if (!online && movement.status !== 'borrador') return { outcome: 'offline' };

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
      await this.alerts.add(buildPendingAuthorizationAlert(movement, authorization, now));
    }

    const product = await this.products.getById(movement.productId);
    if (product && sumQuantity(stockEntriesOfProduct(stock, movement.productId)) === 0) {
      const alreadyAlerted = (await this.alerts.getAll()).some(alert => alert.productId === movement.productId && alert.type === 'sin_stock');
      if (!alreadyAlerted) await this.alerts.add(buildOutOfStockAlert(product, now));
    }

    await this.movements.add(movement);
    const confirmed = movement.status === 'confirmado';
    await this.audit.add({
      userId: movement.registeredBy,
      action: 'CREATE',
      module: 'Movimientos',
      object: `Movimiento ${movement.id}`,
      result: confirmed ? 'success' : 'warning',
      description: `${movement.type} ${confirmed ? 'confirmado' : 'pendiente'}: ${movement.quantity} uds de producto ${movement.productId}`,
    });
    return { outcome: 'registered' };
  }
}
