import type { ReportSeries } from '../../domain/entities/ReportSeries';
import type { ReportSeriesRepository } from '../../domain/repositories/ReportSeriesRepository';
import { DEMO_REPORT_SERIES } from '../../data/demo/reportSeries';

export class DemoReportSeriesRepository implements ReportSeriesRepository {
  async get(): Promise<ReportSeries> {
    return DEMO_REPORT_SERIES;
  }
}
