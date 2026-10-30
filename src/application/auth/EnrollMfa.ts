import type { AuthRepository, MfaEnrollment } from '../../domain/repositories/AuthRepository';

export class EnrollMfa {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(challengeId: string): Promise<MfaEnrollment> {
    return this.authRepository.enrollMfa(challengeId);
  }
}
