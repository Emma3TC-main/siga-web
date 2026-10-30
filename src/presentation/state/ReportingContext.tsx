import { createContext, useContext, type ReactNode } from 'react';
import type { ReportingUseCases } from '../../application/reporting/ReportingUseCases';

const ReportingContext = createContext<ReportingUseCases | null>(null);

export function ReportingProvider({ useCases, children }: { useCases: ReportingUseCases; children: ReactNode }) {
  return <ReportingContext.Provider value={useCases}>{children}</ReportingContext.Provider>;
}

export function useReporting(): ReportingUseCases {
  const context = useContext(ReportingContext);
  if (!context) throw new Error('useReporting must be used within ReportingProvider');
  return context;
}
