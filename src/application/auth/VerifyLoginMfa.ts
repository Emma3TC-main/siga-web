import type { User } from '../../domain/entities/User';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';

export class VerifyLoginMfa {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(challengeId: string, otp: string, username: string): Promise<User> {
    return this.authRepository.verifyMfa(challengeId, otp, username);
  }
}
