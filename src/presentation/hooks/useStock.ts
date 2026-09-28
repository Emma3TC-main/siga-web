import { useOperations } from '../state/OperationsContext';

export function useStock() {
  const { stock, loading, error } = useOperations();
  return { stock, loading, error };
}
