import type { AuthLoginResult, AuthRepository, MfaEnrollment } from '../../domain/repositories/AuthRepository';
import type { User } from '../../domain/entities/User';
import { ApiClient } from '../http/ApiClient';

// In-memory token storage to avoid local/sessionStorage by default
let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

export class ApiAuthRepository implements AuthRepository {
  // Use an unauthenticated client for login requests
  private authClient = new ApiClient();

  async login(username: string, password: string): Promise<AuthLoginResult> {
    const result = await this.authClient.post<any>('/api/v1/auth/login', {
      username,
      password,
    });

    if (result.mfaRequired) {
      if (!result.challengeId) {
        throw new Error('Login MFA response did not include challengeId.');
      }
      return { outcome: 'mfa_required', challengeId: result.challengeId, username };
    }

    return { outcome: 'authenticated', user: this.acceptTokens(result.tokens, username) };
  }

  enrollMfa(challengeId: string): Promise<MfaEnrollment> {
    return this.authClient.post<MfaEnrollment>('/api/v1/auth/mfa/enroll', { challengeId });
  }

  async verifyMfa(challengeId: string, otp: string, username: string): Promise<User> {
    const tokens = await this.authClient.post<any>('/api/v1/auth/mfa/verify', {
      challengeId,
      otp,
    });
    return this.acceptTokens(tokens, username);
  }

  private acceptTokens(tokens: any, username: string): User {
    if (!tokens?.accessToken || !tokens?.refreshToken) {
      throw new Error('Authentication response did not include tokens.');
    }

    memoryAccessToken = tokens.accessToken;
    memoryRefreshToken = tokens.refreshToken;

    // Decode token to extract user info (simulated User mapping from JWT)
    // Note: We don't verify signature here; that's backend's job.
    const payload = this.parseJwt(memoryAccessToken!);
    const permissions = Array.isArray(payload.permissions) ? payload.permissions : [];
    const role = Array.isArray(payload.roles) && payload.roles.length > 0
      ? payload.roles[0].toLowerCase()
      : permissions.includes('USER_MANAGE') || permissions.includes('ROLE_MANAGE')
        ? 'admin'
        : permissions.includes('MOVEMENT_AUTHORIZE')
          ? 'supervisor'
          : 'warehouse';

    // Map claims to Web User entity
    return {
      id: payload.sub || crypto.randomUUID(),
      name: payload.preferred_username || payload.username || username.split('@')[0],
      lastName: '',
      email: payload.email || (username.includes('@') ? username : ''),
      username: payload.preferred_username || payload.username || username,
      role,
      permissions,
      authTime: typeof payload.auth_time === 'number' ? payload.auth_time : undefined,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }

  async logout(): Promise<void> {
    const client = new ApiClient();
    const backendLogout = client.post<void>('/api/v1/auth/logout', {});

    // The request has already captured the current token; clear the local
    // session immediately so no subsequent request can reuse it.
    memoryAccessToken = null;
    memoryRefreshToken = null;

    try {
      await backendLogout;
    } catch (e) {
      // Ignore if token was already invalid or network error on logout
      console.warn('Backend logout failed', e);
    }
  }

  getAccessToken(): string | null {
    return memoryAccessToken;
  }

  async refreshSession(): Promise<boolean> {
    if (!memoryRefreshToken) return false;

    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = this.executeRefresh().finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  }

  private async executeRefresh(): Promise<boolean> {
    try {
      const result = await this.authClient.post<any>('/api/v1/auth/refresh', {
        refreshToken: memoryRefreshToken,
      });

      if (!result.accessToken) {
        return false;
      }

      memoryAccessToken = result.accessToken;
      if (result.refreshToken) {
        memoryRefreshToken = result.refreshToken;
      }

      return true;
    } catch (error) {
      console.warn('Refresh token failed:', error);
      memoryAccessToken = null;
      memoryRefreshToken = null;
      return false;
    }
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
  }
}
