import type {
  CreateAdminUserCommand,
  UpdateAdminUserCommand,
} from '../../domain/entities/AdminUser';
import type { UserAdminRepository } from '../../domain/repositories/UserAdminRepository';

export class UserAdminUseCases {
  constructor(private readonly repository: UserAdminRepository) {}

  listUsers(page = 0, size = 20) {
    return this.repository.listUsers(page, size);
  }

  getUser(id: string) {
    return this.repository.getUser(id);
  }

  listRoles() {
    return this.repository.listRoles();
  }

  createUser(command: CreateAdminUserCommand) {
    return this.repository.createUser(command);
  }

  updateUser(id: string, command: UpdateAdminUserCommand) {
    return this.repository.updateUser(id, command);
  }

  replaceUserRoles(id: string, roleIds: string[]) {
    return this.repository.replaceUserRoles(id, roleIds);
  }
}
