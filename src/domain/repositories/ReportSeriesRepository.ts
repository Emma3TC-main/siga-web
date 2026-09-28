import type { ReportSeries } from '../entities/ReportSeries';

export interface ReportSeriesRepository {
  get(): Promise<ReportSeries>;
}
