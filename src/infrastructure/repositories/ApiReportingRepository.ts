import type {
  InventoryValuationItem,
  MovementReportItem,
  ReportingDashboard,
  ReportingPage,
} from '../../domain/entities/Reporting';
import type {
  AdjustmentReportQuery,
  DashboardQuery,
  InventoryValuationQuery,
  MovementReportQuery,
  ReportingRepository,
} from '../../domain/repositories/ReportingRepository';
import { ApiClient } from '../http/ApiClient';

function queryString(values: object): string {
  const query = new URLSearchParams();
  Object.entries(values as Record<string, string | number | undefined>).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value));
  });
  return query.toString();
}

export class ApiReportingRepository implements ReportingRepository {
  constructor(private readonly client = new ApiClient()) {}

  getDashboard(query: DashboardQuery): Promise<ReportingDashboard> {
    return this.client.get(`/api/v1/dashboard?${queryString(query)}`);
  }

  getMovementReport(query: MovementReportQuery): Promise<ReportingPage<MovementReportItem>> {
    return this.client.get(`/api/v1/reports/movements?${queryString(query)}`);
  }

  getInventoryValuation(query: InventoryValuationQuery): Promise<ReportingPage<InventoryValuationItem>> {
    return this.client.get(`/api/v1/reports/inventory-valuation?${queryString(query)}`);
  }

  getAdjustmentReport(query: AdjustmentReportQuery): Promise<ReportingPage<MovementReportItem>> {
    return this.client.get(`/api/v1/reports/adjustments?${queryString(query)}`);
  }
}
