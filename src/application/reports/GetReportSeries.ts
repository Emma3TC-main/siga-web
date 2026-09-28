import type { ReportSeries } from '../../domain/entities/ReportSeries';
import type { ReportSeriesRepository } from '../../domain/repositories/ReportSeriesRepository';

export class GetReportSeries {
  constructor(private readonly repository: ReportSeriesRepository) {}

  execute(): Promise<ReportSeries> {
    return this.repository.get();
  }
}
