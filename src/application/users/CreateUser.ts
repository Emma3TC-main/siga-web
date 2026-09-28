import type { NewUser, User } from '../../domain/entities/User';
import type { AuditRepository } from '../../domain/repositories/AuditRepository';
import type { UserRepository } from '../../domain/repositories/UserRepository';
import { ValidationError } from '../../domain/errors';
import { defaultUsername, validateUserIdentity } from '../../domain/rules/userRules';

export type CreateUserInput = Pick<NewUser, 'name' | 'lastName' | 'email' | 'username' | 'role' | 'scope'>;

export class CreateUser {
  constructor(
    private readonly users: UserRepository,
    private readonly audit: AuditRepository,
  ) {}

  async execute(input: CreateUserInput, actorId: string): Promise<User> {
    const errors = validateUserIdentity(input);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de usuario inválidos.', errors);

    const user = await this.users.create({
      ...input,
      username: defaultUsername(input.username, input.email),
      status: 'active',
    });
    await this.audit.add({
      userId: actorId,
      action: 'CREATE',
      module: 'Administración',
      object: `Usuario ${user.username}`,
      result: 'success',
      description: `Nuevo usuario creado: ${user.name} ${user.lastName} (${user.role})`,
    });
    return user;
  }
}
