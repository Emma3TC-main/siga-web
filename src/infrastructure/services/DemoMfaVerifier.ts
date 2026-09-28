import type { MfaVerifier } from '../../domain/services/MfaVerifier';

/** Código de demostración que acepta la pantalla de confirmación con MFA. */
const DEMO_TOTP_CODE = '123456';

export class DemoMfaVerifier implements MfaVerifier {
  async verify(code: string): Promise<boolean> {
    return code === DEMO_TOTP_CODE;
  }
}
