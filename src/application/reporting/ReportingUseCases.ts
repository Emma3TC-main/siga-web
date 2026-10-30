import type {
  AdjustmentReportQuery,
  DashboardQuery,
  InventoryValuationQuery,
  MovementReportQuery,
  ReportingRepository,
} from '../../domain/repositories/ReportingRepository';

export class GetReportingDashboard {
  constructor(private readonly repository: ReportingRepository) {}
  execute(query: DashboardQuery) { return this.repository.getDashboard(query); }
}

export class GetMovementReport {
  constructor(private readonly repository: ReportingRepository) {}
  execute(query: MovementReportQuery) { return this.repository.getMovementReport(query); }
}

export class GetInventoryValuation {
  constructor(private readonly repository: ReportingRepository) {}
  execute(query: InventoryValuationQuery) { return this.repository.getInventoryValuation(query); }
}

export class GetAdjustmentReport {
  constructor(private readonly repository: ReportingRepository) {}
  execute(query: AdjustmentReportQuery) { return this.repository.getAdjustmentReport(query); }
}

export interface ReportingUseCases {
  getDashboard: GetReportingDashboard;
  getMovementReport: GetMovementReport;
  getInventoryValuation: GetInventoryValuation;
  getAdjustmentReport: GetAdjustmentReport;
}
