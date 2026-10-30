import type { User } from '../entities/User';

export type AuthLoginResult =
  | { outcome: 'authenticated'; user: User }
  | { outcome: 'mfa_required'; challengeId: string; username: string };

export interface MfaEnrollment {
  secret: string;
  otpauthUri: string;
}

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthLoginResult>;
  enrollMfa(challengeId: string): Promise<MfaEnrollment>;
  verifyMfa(challengeId: string, otp: string, username: string): Promise<User>;
  logout(): Promise<void>;
  getAccessToken(): string | null;
  refreshSession(): Promise<boolean>;
}
