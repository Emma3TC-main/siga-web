import type { User, UserChanges } from '../../domain/entities/User';
import type { AuditRepository } from '../../domain/repositories/AuditRepository';
import type { UserRepository } from '../../domain/repositories/UserRepository';
import { NotFoundError, ValidationError } from '../../domain/errors';
import { validateUserIdentity } from '../../domain/rules/userRules';

/** Edita un usuario o cambia su estado (activar/desactivar) y lo deja en la auditoría. */
export class UpdateUser {
  constructor(
    private readonly users: UserRepository,
    private readonly audit: AuditRepository,
  ) {}

  async execute(id: string, changes: UserChanges, actorId: string): Promise<User> {
    const existing = await this.users.getById(id);
    if (!existing) throw new NotFoundError('Usuario', id);

    const merged: User = { ...existing, ...changes };
    const errors = validateUserIdentity(merged);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de usuario inválidos.', errors);

    const user = await this.users.update(merged);
    await this.audit.add({
      userId: actorId,
      action: 'EDIT',
      module: 'Administración',
      object: `Usuario ${user.username}`,
      result: 'success',
      description: `Usuario modificado: ${user.name} ${user.lastName} - Estado: ${user.status}`,
    });
    return user;
  }
}
