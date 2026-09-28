import { useCallback } from 'react';
import { useOperations } from '../state/OperationsContext';

export function useAuthorizations() {
  const { authorizations, loading, error, resolveAuthorization: resolve, verifyMfaCode } = useOperations();

  const resolveAuthorization = useCallback(
    (authorizationId: string, approved: boolean, resolverId: string, reason?: string) =>
      resolve({ authorizationId, approved, resolverId, reason }),
    [resolve],
  );

  return { authorizations, loading, error, resolveAuthorization, verifyMfaCode };
}
