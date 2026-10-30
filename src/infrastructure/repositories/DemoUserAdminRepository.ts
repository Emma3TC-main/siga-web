import { DEMO_USERS } from '../../data/demo/users';
import type { AdminRole } from '../../domain/entities/AdminRole';
import type {
  AdminUser,
  AdminUserPage,
  CreateAdminUserCommand,
  UpdateAdminUserCommand,
} from '../../domain/entities/AdminUser';
import type { UserAdminRepository } from '../../domain/repositories/UserAdminRepository';

const DEMO_ROLES: AdminRole[] = [
  { id: 'demo-role-admin', code: 'ADMIN', name: 'Administrador', active: true, permissionIds: [] },
  { id: 'demo-role-supervisor', code: 'SUPERVISOR', name: 'Supervisor', active: true, permissionIds: [] },
  { id: 'demo-role-warehouse', code: 'ENCARGADO', name: 'Encargado', active: true, permissionIds: [] },
];

export class DemoUserAdminRepository implements UserAdminRepository {
  private users: AdminUser[] = DEMO_USERS.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    active: user.status === 'active',
    mfaEnabled: false,
    roleIds: [DEMO_ROLES.find(role => role.code === (
      user.role === 'admin' ? 'ADMIN' : user.role === 'supervisor' ? 'SUPERVISOR' : 'ENCARGADO'
    ))!.id],
  }));

  async listUsers(page: number, size: number): Promise<AdminUserPage> {
    const sorted = [...this.users].sort((left, right) => left.username.localeCompare(right.username));
    return { content: sorted.slice(page * size, (page + 1) * size), page, size, totalElements: sorted.length };
  }

  async getUser(id: string): Promise<AdminUser> {
    const user = this.users.find(item => item.id === id);
    if (!user) throw new Error('USER_NOT_FOUND');
    return { ...user, roleIds: [...user.roleIds] };
  }

  async listRoles(): Promise<AdminRole[]> {
    return DEMO_ROLES.map(role => ({ ...role, permissionIds: [...role.permissionIds] }));
  }

  async createUser(command: CreateAdminUserCommand): Promise<AdminUser> {
    const user: AdminUser = {
      id: `demo-user-${Date.now()}`,
      username: command.username,
      email: command.email,
      active: true,
      mfaEnabled: false,
      roleIds: command.roleIds ?? [],
    };
    this.users = [...this.users, user];
    return user;
  }

  async updateUser(id: string, command: UpdateAdminUserCommand): Promise<AdminUser> {
    const current = await this.getUser(id);
    const updated = { ...current, ...command };
    this.users = this.users.map(user => user.id === id ? updated : user);
    return updated;
  }

  async replaceUserRoles(id: string, roleIds: string[]): Promise<AdminUser> {
    const current = await this.getUser(id);
    const updated = { ...current, roleIds: [...roleIds] };
    this.users = this.users.map(user => user.id === id ? updated : user);
    return updated;
  }
}
