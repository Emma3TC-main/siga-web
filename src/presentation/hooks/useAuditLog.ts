import { useState, useEffect, useCallback } from 'react';
import { useOperations } from '../state/OperationsContext';
import type { AuditPage, AuditQueryFilters } from '../../domain/repositories/AuditRepository';
import type { AuditEvent } from '../../domain/entities/AuditEvent';

export function useAuditLog(initialFilters?: AuditQueryFilters) {
  const { searchAuditLog } = useOperations();
  const [pageData, setPageData] = useState<AuditPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [filters, setFilters] = useState<AuditQueryFilters>(initialFilters ?? { page: 0, size: 20 });
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    searchAuditLog(filters)
      .then(data => {
        if (active) setPageData(data);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters, refreshVersion, searchAuditLog]);

  const auditLog: AuditEvent[] = pageData?.content ?? [];
  const refetch = useCallback(() => setRefreshVersion(version => version + 1), []);

  return {
    auditLog,
    pageData,
    loading,
    error,
    filters,
    setFilters,
    refetch,
  };
}
