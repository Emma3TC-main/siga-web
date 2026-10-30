import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authUseCases } from '../../app/compositionRoot';
import type { User } from '../../domain/entities/User';
import type { MfaEnrollment } from '../../domain/repositories/AuthRepository';
import { ApiClient, ApiError } from '../../infrastructure/http/ApiClient';

export type AuthPhase = 'LOGIN' | 'MFA_CHALLENGE' | 'MFA_ENROLLMENT' | 'AUTHENTICATED';

interface AuthState {
  phase: AuthPhase;
  user: User | null;
  challengeId: string | null;
  username: string | null;
  enrollment: MfaEnrollment | null;
}

interface AuthContextValue extends AuthState {
  loginWithPassword: (username: string, password: string) => Promise<void>;
  enrollMfa: () => Promise<void>;
  verifyMfa: (otp: string) => Promise<void>;
  resetLogin: () => void;
  logout: () => void;
}

const initialState: AuthState = {
  phase: 'LOGIN',
  user: null,
  challengeId: null,
  username: null,
  enrollment: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const resetLogin = useCallback(() => setState(initialState), []);

  useEffect(() => {
    const onAuthLost = () => setState(initialState);
    ApiClient.onAuthLost = onAuthLost;
    return () => {
      if (ApiClient.onAuthLost === onAuthLost) ApiClient.onAuthLost = null;
    };
  }, []);

  const loginWithPassword = useCallback(async (username: string, password: string) => {
    const result = await authUseCases.login.execute(username, password);
    if (result.outcome === 'mfa_required') {
      setState({
        phase: 'MFA_CHALLENGE',
        user: null,
        challengeId: result.challengeId,
        username: result.username,
        enrollment: null,
      });
      return;
    }
    setState({ ...initialState, phase: 'AUTHENTICATED', user: result.user });
  }, []);

  const enrollMfa = useCallback(async () => {
    if (!state.challengeId) throw new Error('No active MFA challenge.');
    try {
      const enrollment = await authUseCases.enrollMfa.execute(state.challengeId);
      setState(current => ({ ...current, phase: 'MFA_ENROLLMENT', enrollment }));
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 429)) {
        setState(initialState);
      }
      throw error;
    }
  }, [state.challengeId]);

  const verifyMfa = useCallback(async (otp: string) => {
    if (!state.challengeId || !state.username) throw new Error('No active MFA challenge.');
    try {
      const user = await authUseCases.verifyMfa.execute(state.challengeId, otp, state.username);
      setState({ ...initialState, phase: 'AUTHENTICATED', user });
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 429)) {
        setState(initialState);
      }
      throw error;
    }
  }, [state.challengeId, state.username]);

  const logout = useCallback(() => {
    setState(initialState);
    authUseCases.logout.execute().catch(error => console.warn('Backend logout failed', error));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    loginWithPassword,
    enrollMfa,
    verifyMfa,
    resetLogin,
    logout,
  }), [state, loginWithPassword, enrollMfa, verifyMfa, resetLogin, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
