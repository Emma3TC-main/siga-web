import type { Authorization } from '../../domain/entities/Authorization';
import type { Movement } from '../../domain/entities/Movement';
import type { AuthorizationRepository } from '../../domain/repositories/AuthorizationRepository';
import type { MovementRepository } from '../../domain/repositories/MovementRepository';
import type { MovementHistoryQuery } from '../../domain/repositories/MovementRepository';

const AUTHORIZATION_PAGE_SIZE = 100;
const AUTHORIZATION_QUERIES: ReadonlyArray<Pick<MovementHistoryQuery, 'status' | 'sensitive'>> = [
  { status: 'PENDING_AUTHORIZATION' },
  { status: 'AUTHORIZED' },
  { status: 'REJECTED' },
  // CUS-27 cubre movimientos sensibles: un confirmado sensible necesariamente pasó por autorización.
  { status: 'CONFIRMED', sensitive: true },
];

export class ApiAuthorizationRepository implements AuthorizationRepository {
  constructor(private readonly movements: MovementRepository) {}

  async getAll(): Promise<Authorization[]> {
    const pages = await Promise.all(AUTHORIZATION_QUERIES.map(query => this.collectAllPages(query)));
    const unique = new Map<string, Movement>();
    for (const movement of pages.flat()) unique.set(movement.id, movement);
    return [...unique.values()]
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id))
      .map(movement => this.fromMovement(movement));
  }

  async getById(id: string): Promise<Authorization | null> {
    const movement = await this.movements.getById(id);
    return movement ? this.fromMovement(movement) : null;
  }

  async add(authorization: Authorization): Promise<Authorization> { return authorization; }
  async update(authorization: Authorization): Promise<Authorization> { return authorization; }

  private async collectAllPages(query: Pick<MovementHistoryQuery, 'status' | 'sensitive'>): Promise<Movement[]> {
    const movements: Movement[] = [];
    let page = 0;
    let totalElements = Number.POSITIVE_INFINITY;
    while (movements.length < totalElements) {
      const result = await this.movements.search({ ...query, page, size: AUTHORIZATION_PAGE_SIZE });
      movements.push(...result.content);
      totalElements = result.totalElements;
      if (result.content.length === 0) break;
      page += 1;
    }
    return movements;
  }

  private fromMovement(movement: Movement): Authorization {
    const first = movement.lines?.[0];
    const hasDetail = movement.lines !== undefined;
    return {
      id: movement.id,
      movementId: movement.id,
      movementCode: movement.movementCode ?? movement.documentNumber,
      movementStatus: movement.status,
      type: movement.type,
      productId: hasDetail ? (first?.productId ?? movement.productId) : undefined,
      quantity: hasDetail ? movement.quantity : undefined,
      fromLocationId: hasDetail ? (first?.fromLocationId ?? movement.fromLocationId) : undefined,
      toLocationId: hasDetail ? (first?.toLocationId ?? movement.toLocationId) : undefined,
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
      submittedAt: movement.submittedAt,
      confirmedAt: movement.confirmedAt,
      lines: movement.lines,
    };
  }
}
