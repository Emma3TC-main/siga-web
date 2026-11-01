import type { Movement } from '../../domain/entities/Movement';
import type { MovementHistoryPage, MovementHistoryQuery, MovementRepository } from '../../domain/repositories/MovementRepository';
import { DEMO_MOVEMENTS } from '../../data/demo/movements';

export class DemoMovementRepository implements MovementRepository {
  private movements: Movement[] = [...DEMO_MOVEMENTS];

  async getAll(): Promise<Movement[]> {
    return [...this.movements];
  }

  async search(query: MovementHistoryQuery = {}): Promise<MovementHistoryPage> {
    const page = query.page ?? 0;
    const size = query.size ?? 20;
    const typeMap = { ENTRY: 'entrada', EXIT: 'salida', TRANSFER: 'transferencia', ADJUST_POSITIVE: 'ajuste_positivo', ADJUST_NEGATIVE: 'ajuste_negativo' } as const;
    const statusMap = { DRAFT: 'borrador', PENDING_AUTHORIZATION: 'pendiente_autorizacion', AUTHORIZED: 'autorizado', CONFIRMED: 'confirmado', REJECTED: 'rechazado', CANCELLED: 'cancelado' } as const;
    const filtered = this.movements.filter(movement => {
      if (query.movementType && movement.type !== typeMap[query.movementType]) return false;
      if (query.status && movement.status !== statusMap[query.status]) return false;
      if (query.movementCode && (movement.movementCode ?? movement.documentNumber) !== query.movementCode) return false;
      if (query.productId && !movement.lines?.some(line => line.productId === query.productId)) return false;
      if (query.lotId && !movement.lines?.some(line => line.batch === query.lotId)) return false;
      if (query.assetId && !movement.lines?.some(line => line.serial === query.assetId)) return false;
      if (query.locationId && !movement.lines?.some(line => line.fromLocationId === query.locationId || line.toLocationId === query.locationId)) return false;
      if (query.sourceLocationId && !movement.lines?.some(line => line.fromLocationId === query.sourceLocationId)) return false;
      if (query.destinationLocationId && !movement.lines?.some(line => line.toLocationId === query.destinationLocationId)) return false;
      if (query.sensitive !== undefined && Boolean(movement.isSensitive) !== query.sensitive) return false;
      if (query.referenceDocNumber && movement.referenceDocNumber !== query.referenceDocNumber) return false;
      return true;
    });
    return { content: filtered.slice(page * size, (page + 1) * size), page, size, totalElements: filtered.length };
  }

  async getById(id: string): Promise<Movement | null> {
    return this.movements.find(movement => movement.id === id) ?? null;
  }

  async add(movement: Movement): Promise<Movement> {
    this.movements = [movement, ...this.movements];
    return movement;
  }

  async submit(id: string): Promise<Movement> {
    const movement = this.movements.find(item => item.id === id);
    if (!movement) throw new Error(`Movimiento ${id} no encontrado.`);
    return movement;
  }

  async update(movement: Movement): Promise<Movement> {
    this.movements = this.movements.map(item => (item.id === movement.id ? movement : item));
    return movement;
  }
}
