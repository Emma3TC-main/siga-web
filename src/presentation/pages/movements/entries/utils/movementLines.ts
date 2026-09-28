import type { Movement, MovementLine } from '../../../../../domain/entities/Movement';

/** Devuelve las líneas del movimiento; si no tiene multidetalle, arma una línea única de compatibilidad. */
export function movementLines(movement: Movement): MovementLine[] {
  return movement.lines ?? [{
    id: '1',
    productId: movement.productId,
    quantity: movement.quantity,
    unitId: movement.unitId,
    toLocationId: movement.toLocationId,
    batch: movement.batch,
    serial: movement.serial,
    expiryDate: movement.expiryDate,
    unitCost: movement.unitCost,
    totalCost: movement.totalCost,
  }];
}
