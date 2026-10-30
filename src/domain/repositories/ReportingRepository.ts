import type {
  InventoryValuationItem,
  MovementReportItem,
  ReportingBucket,
  ReportingDashboard,
  ReportingMovementType,
  ReportingPage,
} from '../entities/Reporting';

export interface ReportingPeriodQuery {
  from: string;
  to: string;
}

export interface ReportingPageQuery {
  page: number;
  size: number;
}

export interface DashboardQuery extends ReportingPeriodQuery {
  bucket: ReportingBucket;
}

export interface MovementReportQuery extends ReportingPeriodQuery, ReportingPageQuery {
  movementType?: ReportingMovementType;
  costCenterCode?: string;
}

export interface InventoryValuationQuery extends ReportingPageQuery {
  productId?: string;
  categoryCode?: string;
  locationId?: string;
}

export interface AdjustmentReportQuery extends ReportingPeriodQuery, ReportingPageQuery {
  adjustmentType?: 'ADJUST_POSITIVE' | 'ADJUST_NEGATIVE';
}

export interface ReportingRepository {
  getDashboard(query: DashboardQuery): Promise<ReportingDashboard>;
  getMovementReport(query: MovementReportQuery): Promise<ReportingPage<MovementReportItem>>;
  getInventoryValuation(query: InventoryValuationQuery): Promise<ReportingPage<InventoryValuationItem>>;
  getAdjustmentReport(query: AdjustmentReportQuery): Promise<ReportingPage<MovementReportItem>>;
}
