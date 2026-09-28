import type { MfaVerifier } from '../../domain/services/MfaVerifier';

export class VerifyMfaCode {
  constructor(private readonly verifier: MfaVerifier) {}

  execute(code: string): Promise<boolean> {
    return this.verifier.verify(code);
  }
}
