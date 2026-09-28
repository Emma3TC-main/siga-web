import { useOperations } from '../state/OperationsContext';

export function useAuditLog() {
  const { auditLog, loading, error } = useOperations();
  return { auditLog, loading, error };
}
