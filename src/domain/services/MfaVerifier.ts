/** Verificación del segundo factor (TOTP). En producción la valida el servidor. */
export interface MfaVerifier {
  verify(code: string): Promise<boolean>;
}
