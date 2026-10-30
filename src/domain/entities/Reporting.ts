export type ReportingMovementType =
  | 'ENTRY'
  | 'EXIT'
  | 'TRANSFER'
  | 'ADJUST_POSITIVE'
  | 'ADJUST_NEGATIVE';

export type ReportingBucket = 'DAY' | 'MONTH';

export interface ReportingPeriod {
  from: string;
  to: string;
  timeZone: 'America/Lima';
}

export interface MovementTrendBucket {
  periodStart: string;
  entries: number;
  exits: number;
  transfers: number;
  positiveAdjustments: number;
  negativeAdjustments: number;
}

export interface CriticalProduct {
  productId: string;
  sku: string;
  name: string;
  categoryCode: string | null;
  quantity: number;
  minStock: number;
  deficit: number;
}

export interface ReportingDashboard {
  period: ReportingPeriod;
  dataUpdatedAt: string | null;
  stockValuePen: number;
  lowStockProductCount: number;
  outOfStockProductCount: number;
  confirmedMovementCount: number;
  entryCount: number;
  exitCount: number;
  transferCount: number;
  positiveAdjustmentCount: number;
  negativeAdjustmentCount: number;
  movementTrend: MovementTrendBucket[];
  topCriticalProducts: CriticalProduct[];
}

export interface MovementReportItem {
  movementId: string;
  movementCode: string;
  movementType: ReportingMovementType;
  status: 'CONFIRMED';
  registeredByUserId: string;
  confirmedByUserId: string;
  authorizedByUserId: string | null;
  requestedByUserId: string | null;
  costCenterCode: string | null;
  costCenterNameSnapshot: string | null;
  supplierId: string | null;
  supplierNameSnapshot: string | null;
  referenceDocType: string | null;
  referenceDocNumber: string | null;
  reason: string | null;
  sensitive: boolean;
  totalBaseCostPen: number;
  confirmedAt: string;
}

export interface InventoryValuationItem {
  stockBalanceId: string;
  productId: string;
  sku: string;
  name: string;
  categoryCode: string | null;
  categoryName: string | null;
  productType: string;
  locationId: string;
  lotId: string | null;
  assetId: string | null;
  quantity: number;
  avgCostPen: number;
  stockValuePen: number;
  minStock: number;
}

export interface ReportingPage<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  dataUpdatedAt: string | null;
  period?: ReportingPeriod;
}
