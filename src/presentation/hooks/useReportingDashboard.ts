import { useEffect, useState } from 'react';
import type { ReportingDashboard } from '../../domain/entities/Reporting';
import { useReporting } from '../state/ReportingContext';
import { dashboardPeriod, type DashboardRange } from '../pages/reports/reportingDates';

export function useReportingDashboard(range: DashboardRange) {
  const useCases = useReporting();
  const [data, setData] = useState<ReportingDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    useCases.getDashboard.execute(dashboardPeriod(range))
      .then(result => { if (!cancelled) setData(result); })
      .catch(cause => { if (!cancelled) setError(cause); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [range, useCases]);

  return { data, loading, error };
}
