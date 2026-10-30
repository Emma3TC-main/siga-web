import type { CreateAdminRoleCommand } from '../../domain/entities/AdminRole';
import type { RoleAdminRepository } from '../../domain/repositories/RoleAdminRepository';

export class RoleAdminUseCases {
  constructor(private readonly repository: RoleAdminRepository) {}

  listRoles() {
    return this.repository.listRoles();
  }

  listPermissions() {
    return this.repository.listPermissions();
  }

  createRole(command: CreateAdminRoleCommand) {
    return this.repository.createRole(command);
  }

  replaceRolePermissions(roleId: string, permissionIds: string[]) {
    return this.repository.replaceRolePermissions(roleId, permissionIds);
  }
}
