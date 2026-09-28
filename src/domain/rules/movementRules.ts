import type { Alert } from '../entities/Alert';
import type { Authorization } from '../entities/Authorization';
import type { Movement, MovementLine } from '../entities/Movement';
import type { Product } from '../entities/Product';
import type { StockEntry } from '../entities/Stock';

export function getMovementLines(movement: Movement): MovementLine[] {
  return movement.lines ?? [{
    id: '1', productId: movement.productId, quantity: movement.quantity, unitId: movement.unitId,
    fromLocationId: movement.fromLocationId, toLocationId: movement.toLocationId,
    batch: movement.batch, serial: movement.serial, expiryDate: movement.expiryDate,
    unitCost: movement.unitCost, totalCost: movement.totalCost,
  }];
}

/** Resultado de aplicar un movimiento confirmado: el stock nuevo, o el conflicto (409) que lo impide. */
export interface StockApplication {
  stock: StockEntry[];
  conflict?: string;
}

/**
 * Aplica un movimiento confirmado al stock. Nunca deja stock negativo: si una línea de salida, ajuste negativo
 * o transferencia pide más de lo disponible en su origen, devuelve el conflicto y el stock sin cambios.
 */
export function applyConfirmedMovement(stock: StockEntry[], movement: Movement): StockApplication {
  const lines = getMovementLines(movement);
  const outgoing = movement.type === 'salida' || movement.type === 'ajuste_negativo' || movement.type === 'transferencia';
  if (outgoing) {
    for (const line of lines) {
      if (!line.fromLocationId) continue;
      const available = stock.filter(item => item.productId === line.productId && item.locationId === line.fromLocationId).reduce((total, item) => total + item.quantity, 0);
      if (available < line.quantity) return { stock, conflict: `409 CONFLICT · Stock disponible ${available}; solicitado ${line.quantity} para ${line.productId}.` };
    }
  }

  const next = [...stock];
  const consumeStock = (productId: string, locationId: string, quantity: number) => {
    let remaining = quantity;
    let consumedValue = 0;
    const indexes = next
      .map((item, index) => ({ item, index }))
      .filter(entry => entry.item.productId === productId && entry.item.locationId === locationId && entry.item.quantity > 0)
      .sort((a, b) => (a.item.expiryDate ?? '9999-12-31').localeCompare(b.item.expiryDate ?? '9999-12-31'));
    for (const entry of indexes) {
      if (remaining <= 0) break;
      const taken = Math.min(remaining, next[entry.index].quantity);
      consumedValue += taken * next[entry.index].avgCost;
      next[entry.index] = { ...next[entry.index], quantity: next[entry.index].quantity - taken };
      remaining -= taken;
    }
    return quantity > 0 ? consumedValue / quantity : 0;
  };

  for (const line of lines) {
    if (movement.type === 'entrada' && line.toLocationId) {
      const index = next.findIndex(item => item.productId === line.productId && item.locationId === line.toLocationId && item.batch === line.batch && item.serial === line.serial);
      if (index >= 0) {
        const previous = next[index];
        const quantity = previous.quantity + line.quantity;
        const value = previous.quantity * previous.avgCost + line.quantity * (line.unitCost ?? previous.avgCost);
        next[index] = { ...previous, quantity, avgCost: quantity > 0 ? value / quantity : previous.avgCost };
      } else next.push({ productId: line.productId, locationId: line.toLocationId, quantity: line.quantity, batch: line.batch, serial: line.serial, expiryDate: line.expiryDate, avgCost: line.unitCost ?? 0 });
    }

    if ((movement.type === 'salida' || movement.type === 'ajuste_negativo') && line.fromLocationId) {
      consumeStock(line.productId, line.fromLocationId, line.quantity);
    }

    if (movement.type === 'ajuste_positivo' && line.toLocationId) {
      const index = next.findIndex(item => item.productId === line.productId && item.locationId === line.toLocationId);
      if (index >= 0) next[index] = { ...next[index], quantity: next[index].quantity + line.quantity };
      else next.push({ productId: line.productId, locationId: line.toLocationId, quantity: line.quantity, avgCost: line.unitCost ?? 0 });
    }

    if (movement.type === 'transferencia' && line.fromLocationId && line.toLocationId) {
      const sourceAverage = consumeStock(line.productId, line.fromLocationId, line.quantity);
      const toIndex = next.findIndex(item => item.productId === line.productId && item.locationId === line.toLocationId);
      if (toIndex >= 0) {
        const previous = next[toIndex];
        const newQuantity = previous.quantity + line.quantity;
        const newValue = previous.quantity * previous.avgCost + line.quantity * sourceAverage;
        next[toIndex] = { ...previous, quantity: newQuantity, avgCost: newQuantity > 0 ? newValue / newQuantity : previous.avgCost };
      } else next.push({ productId: line.productId, locationId: line.toLocationId, quantity: line.quantity, batch: line.batch, serial: line.serial, avgCost: sourceAverage || line.unitCost || 0 });
    }
  }
  return { stock: next };
}

/** Id correlativo de un movimiento nuevo: MOV-{año}-{n+1 con 4 dígitos}. */
export function nextMovementId(existingCount: number, year: number): string {
  return `MOV-${year}-${String(existingCount + 1).padStart(4, '0')}`;
}

const AUTHORIZATION_TYPE_LABEL: Record<string, string> = {
  entrada: 'Entrada', salida: 'Salida', transferencia: 'Transferencia', ajuste_negativo: 'Ajuste negativo',
};

/** Solicitud de autorización de un movimiento sensible pendiente. */
export function buildAuthorizationFor(movement: Movement, now: Date): Authorization {
  const lines = getMovementLines(movement);
  const typeLabel = AUTHORIZATION_TYPE_LABEL[movement.type] ?? 'Ajuste positivo';
  return {
    id: `AUTH-${now.getTime()}`,
    movementId: movement.id,
    type: `${typeLabel} - Operación sensible${lines.length > 1 ? ` (${lines.length} ítems)` : ''}`,
    productId: movement.productId,
    quantity: movement.quantity,
    fromLocationId: movement.fromLocationId,
    toLocationId: movement.toLocationId,
    requesterId: movement.requesterId ?? 'res1',
    registeredBy: movement.registeredBy,
    costCenterId: movement.costCenterId,
    motive: movement.motive,
    documentType: movement.documentType,
    status: 'pendiente',
    sensitiveLevel: movement.sensitiveLevel ?? 2,
    createdAt: movement.createdAt,
    lines,
  };
}

export function buildPendingAuthorizationAlert(movement: Movement, authorization: Authorization, now: Date): Alert {
  return {
    id: `alert-${now.getTime()}`,
    type: 'autorizacion_pendiente',
    severity: 'critical',
    title: `Autorización pendiente: ${movement.type}`,
    description: `Movimiento ${movement.id} requiere autorización`,
    movementId: movement.id,
    authorizationId: authorization.id,
    createdAt: movement.createdAt,
    read: false,
    actionRoute: '/autorizaciones',
  };
}

export function buildOutOfStockAlert(product: Product, now: Date): Alert {
  return {
    id: `alert-stock-${now.getTime()}`,
    type: 'sin_stock',
    severity: 'critical',
    title: `Sin stock: ${product.name}`,
    description: `${product.sku} - Existencia actual: 0 ${product.unitId}`,
    productId: product.id,
    createdAt: now.toISOString(),
    read: false,
    actionRoute: '/inventario',
  };
}
