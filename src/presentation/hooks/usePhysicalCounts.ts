import { useOperations } from '../state/OperationsContext';

export function usePhysicalCounts() {
  const { physicalCounts, loading, error } = useOperations();
  return { physicalCounts, loading, error };
}
