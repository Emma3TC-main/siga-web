import type {
  AdminPermission,
  AdminRole,
  CreateAdminRoleCommand,
} from '../entities/AdminRole';

export interface RoleAdminRepository {
  listRoles(): Promise<AdminRole[]>;
  listPermissions(): Promise<AdminPermission[]>;
  createRole(command: CreateAdminRoleCommand): Promise<AdminRole>;
  replaceRolePermissions(roleId: string, permissionIds: string[]): Promise<AdminRole>;
}
