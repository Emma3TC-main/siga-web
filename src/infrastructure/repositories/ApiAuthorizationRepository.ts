import type { Authorization } from '../../domain/entities/Authorization';
import type { Movement } from '../../domain/entities/Movement';
import type { AuthorizationRepository } from '../../domain/repositories/AuthorizationRepository';
import type { MovementRepository } from '../../domain/repositories/MovementRepository';

export class ApiAuthorizationRepository implements AuthorizationRepository {
  constructor(private readonly movements: MovementRepository) {}

  async getAll(): Promise<Authorization[]> {
    return (await this.movements.getAll())
      .filter(movement => ['pendiente_autorizacion', 'autorizado', 'rechazado'].includes(movement.status))
      .map(movement => this.fromMovement(movement));
  }

  async getById(id: string): Promise<Authorization | null> {
    const movement = await this.movements.getById(id);
    return movement ? this.fromMovement(movement) : null;
  }

  async add(authorization: Authorization): Promise<Authorization> { return authorization; }
  async update(authorization: Authorization): Promise<Authorization> { return authorization; }

  private fromMovement(movement: Movement): Authorization {
    const first = movement.lines?.[0];
    return {
      id: movement.id,
      movementId: movement.id,
      type: movement.type,
      productId: first?.productId ?? movement.productId,
      quantity: movement.quantity,
      fromLocationId: first?.fromLocationId ?? movement.fromLocationId,
      toLocationId: first?.toLocationId ?? movement.toLocationId,
      requesterId: movement.requesterId ?? movement.registeredBy,
      registeredBy: movement.registeredBy,
      costCenterId: movement.costCenterId,
      motive: movement.motive,
      documentType: movement.documentType,
      status: movement.status === 'pendiente_autorizacion'
        ? 'pendiente'
        : movement.status === 'rechazado' ? 'rechazado' : 'aprobado',
      sensitiveLevel: movement.isSensitive ? 2 : 1,
      createdAt: movement.createdAt,
      lines: movement.lines,
    };
  }
}
