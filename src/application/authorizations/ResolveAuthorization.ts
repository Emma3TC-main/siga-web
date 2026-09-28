import type { AuditRepository } from '../../domain/repositories/AuditRepository';
import type { AuthorizationRepository } from '../../domain/repositories/AuthorizationRepository';
import type { MovementRepository } from '../../domain/repositories/MovementRepository';

export interface ResolveAuthorizationInput {
  authorizationId: string;
  approved: boolean;
  resolverId: string;
  /** Motivo del rechazo. */
  reason?: string;
}

/**
 * Aprueba o rechaza una autorización y actualiza el estado de su movimiento.
 * Aprobar no toca el stock: el movimiento queda "autorizado" hasta su confirmación con MFA.
 */
export class ResolveAuthorization {
  constructor(
    private readonly authorizations: AuthorizationRepository,
    private readonly movements: MovementRepository,
    private readonly audit: AuditRepository,
    private readonly clock: () => Date = () => new Date(),
  ) {}

  async execute({ authorizationId, approved, resolverId, reason }: ResolveAuthorizationInput): Promise<void> {
    const authorization = await this.authorizations.getById(authorizationId);
    if (authorization) {
      await this.authorizations.update({
        ...authorization,
        status: approved ? 'aprobado' : 'rechazado',
        resolvedAt: this.clock().toISOString(),
        resolvedBy: resolverId,
        rejectionReason: reason,
      });
      const movement = await this.movements.getById(authorization.movementId);
      if (movement) {
        await this.movements.update(approved
          ? { ...movement, status: 'autorizado', authorizedBy: resolverId }
          : { ...movement, status: 'rechazado', rejectedBy: resolverId, rejectionReason: reason });
      }
    }

    await this.audit.add({
      userId: resolverId,
      action: approved ? 'AUTHORIZE' : 'REJECT',
      module: 'Autorizaciones',
      object: `AUTH ${authorizationId}`,
      result: approved ? 'success' : 'warning',
      description: approved ? `Aprobación de autorización ${authorizationId}` : `Rechazo de autorización ${authorizationId}: ${reason}`,
    });
  }
}
