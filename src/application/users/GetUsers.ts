import type { User } from '../../domain/entities/User';
import type { UserRepository } from '../../domain/repositories/UserRepository';

export class GetUsers {
  constructor(private readonly repository: UserRepository) {}

  execute(): Promise<User[]> {
    return this.repository.getAll();
  }
}
