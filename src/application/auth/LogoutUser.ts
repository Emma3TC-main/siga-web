import type { AuthRepository } from '../../domain/repositories/AuthRepository';

export class LogoutUser {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepository.logout();
  }
}
