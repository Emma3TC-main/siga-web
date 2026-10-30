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
import { DEMO_REPORT_SERIES } from '../../data/demo/reportSeries';

const page = <T>(content: T[], pageNumber: number, size: number): ReportingPage<T> => ({
  content: content.slice(pageNumber * size, (pageNumber + 1) * size),
  page: pageNumber,
  size,
  totalElements: content.length,
  totalPages: content.length === 0 ? 0 : Math.ceil(content.length / size),
  dataUpdatedAt: null,
});

export class DemoReportingRepository implements ReportingRepository {
  async getDashboard(query: DashboardQuery): Promise<ReportingDashboard> {
    return {
      period: { from: query.from, to: query.to, timeZone: 'America/Lima' },
      dataUpdatedAt: null,
      stockValuePen: 0,
      lowStockProductCount: 0,
      outOfStockProductCount: 0,
      confirmedMovementCount: 0,
      entryCount: 0,
      exitCount: 0,
      transferCount: 0,
      positiveAdjustmentCount: 0,
      negativeAdjustmentCount: 0,
      movementTrend: DEMO_REPORT_SERIES.monthlyTrend.map((item, index) => ({
        periodStart: `2025-${String(index + 1).padStart(2, '0')}-01T05:00:00Z`,
        entries: item.entradas,
        exits: item.salidas,
        transfers: 0,
        positiveAdjustments: 0,
        negativeAdjustments: 0,
      })),
      topCriticalProducts: [],
    };
  }

  async getMovementReport(query: MovementReportQuery): Promise<ReportingPage<MovementReportItem>> {
    return { ...page([], query.page, query.size), period: { from: query.from, to: query.to, timeZone: 'America/Lima' } };
  }

  async getInventoryValuation(query: InventoryValuationQuery): Promise<ReportingPage<InventoryValuationItem>> {
    return page([], query.page, query.size);
  }

  async getAdjustmentReport(query: AdjustmentReportQuery): Promise<ReportingPage<MovementReportItem>> {
    return { ...page([], query.page, query.size), period: { from: query.from, to: query.to, timeZone: 'America/Lima' } };
  }
}
