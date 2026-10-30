import type { AuthLoginResult, AuthRepository, MfaEnrollment } from '../../domain/repositories/AuthRepository';
import type { User } from '../../domain/entities/User';
import { simulateLatency } from './simulateLatency';
import { DEMO_USERS } from '../../data/demo/users';

const DEMO_ACCOUNTS = [
  { email: 'admin@siga.demo', password: 'admin123', label: 'Administrador', role: 'admin' },
  { email: 'supervisor@siga.demo', password: 'sup123', label: 'Supervisor de Almacén', role: 'supervisor' },
  { email: 'almacen@siga.demo', password: 'alm123', label: 'Encargado de Almacén', role: 'warehouse' },
];

export class DemoAuthRepository implements AuthRepository {
  private fakeToken: string | null = null;

  async login(email: string, password: string): Promise<AuthLoginResult> {
    await simulateLatency(800);
    const account = DEMO_ACCOUNTS.find(item => item.email === email && item.password === password);
    const user = account ? DEMO_USERS.find(item => item.email === account.email) : undefined;

    if (!user) {
      throw new Error('401 UNAUTHORIZED · Credenciales incorrectas');
    }
    if (user.status === 'inactive') {
      throw new Error('403 FORBIDDEN · Usuario desactivado');
    }

    this.fakeToken = 'demo-token';
    return { outcome: 'authenticated', user };
  }

  async enrollMfa(_challengeId: string): Promise<MfaEnrollment> {
    throw new Error('MFA enrollment is not available in demo mode.');
  }

  async verifyMfa(_challengeId: string, _otp: string, _username: string): Promise<User> {
    throw new Error('MFA verification is not available in demo mode.');
  }

  async logout(): Promise<void> {
    await simulateLatency(300);
    this.fakeToken = null;
  }

  getAccessToken(): string | null {
    return this.fakeToken;
  }

  async refreshSession(): Promise<boolean> {
    return false; // Not applicable for demo
  }
}
