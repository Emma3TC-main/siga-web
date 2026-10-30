import type { AuthLoginResult, AuthRepository } from '../../domain/repositories/AuthRepository';

export class LoginUser {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(username: string, password: string): Promise<AuthLoginResult> {
    return this.authRepository.login(username, password);
  }
}
