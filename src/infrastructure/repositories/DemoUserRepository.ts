import type { NewUser, User } from '../../domain/entities/User';
import type { UserRepository } from '../../domain/repositories/UserRepository';
import { DEMO_USERS } from '../../data/demo/users';

export class DemoUserRepository implements UserRepository {
  private users: User[] = [...DEMO_USERS];

  async getAll(): Promise<User[]> {
    return [...this.users];
  }

  async getById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) ?? null;
  }

  async create(input: NewUser): Promise<User> {
    const user: User = { ...input, id: `u${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    this.users = [...this.users, user];
    return user;
  }

  async update(user: User): Promise<User> {
    this.users = this.users.map(item => (item.id === user.id ? user : item));
    return user;
  }
}
