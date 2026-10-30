import type {
  AdminPermission,
  AdminRole,
  CreateAdminRoleCommand,
} from '../../domain/entities/AdminRole';
import type { RoleAdminRepository } from '../../domain/repositories/RoleAdminRepository';

const DEMO_PERMISSIONS: AdminPermission[] = [
  { id: 'demo-permission-users', code: 'USER_MANAGE', description: 'Gestionar usuarios' },
  { id: 'demo-permission-roles', code: 'ROLE_MANAGE', description: 'Gestionar roles' },
];

const INITIAL_DEMO_ROLES: AdminRole[] = [
  {
    id: 'demo-role-admin',
    code: 'ADMIN',
    name: 'Administrador',
    active: true,
    permissionIds: DEMO_PERMISSIONS.map(permission => permission.id),
  },
];

export class DemoRoleAdminRepository implements RoleAdminRepository {
  private roles = INITIAL_DEMO_ROLES.map(role => ({ ...role, permissionIds: [...role.permissionIds] }));

  async listRoles(): Promise<AdminRole[]> {
    return this.roles.map(role => ({ ...role, permissionIds: [...role.permissionIds] }));
  }

  async listPermissions(): Promise<AdminPermission[]> {
    return DEMO_PERMISSIONS.map(permission => ({ ...permission }));
  }

  async createRole(command: CreateAdminRoleCommand): Promise<AdminRole> {
    const created: AdminRole = {
      id: `demo-role-${Date.now()}`,
      code: command.code,
      name: command.name,
      active: true,
      permissionIds: [...(command.permissionIds ?? [])],
    };
    this.roles = [...this.roles, created];
    return { ...created, permissionIds: [...created.permissionIds] };
  }

  async replaceRolePermissions(roleId: string, permissionIds: string[]): Promise<AdminRole> {
    const current = this.roles.find(role => role.id === roleId);
    if (!current) throw new Error('ROLE_NOT_FOUND');
    const updated = { ...current, permissionIds: [...permissionIds] };
    this.roles = this.roles.map(role => role.id === roleId ? updated : role);
    return { ...updated, permissionIds: [...updated.permissionIds] };
  }
}
