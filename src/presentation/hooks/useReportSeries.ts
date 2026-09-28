import { useOperations } from '../state/OperationsContext';

export function useReportSeries() {
  const { reportSeries, loading, error } = useOperations();
  return { reportSeries, loading, error };
}
