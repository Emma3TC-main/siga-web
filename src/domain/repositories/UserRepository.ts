import type { NewUser, User } from '../entities/User';

export interface UserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  create(user: NewUser): Promise<User>;
  update(user: User): Promise<User>;
}
