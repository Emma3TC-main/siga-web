import type { Product, ProductType, ProductStatus, MachineryStatus, DispatchStrategy } from '../domain/entities/Product';
import type { Category } from '../domain/entities/Category';
import type { UnitOfMeasure } from '../domain/entities/UnitOfMeasure';
import type { Supplier, SupplierSnapshot } from '../domain/entities/Supplier';
import type { Location } from '../domain/entities/Location';
import type { StockEntry } from '../domain/entities/Stock';
import type { Movement, MovementLine, MovementType, MovementStatus } from '../domain/entities/Movement';
import type { Authorization } from '../domain/entities/Authorization';
import type { Alert } from '../domain/entities/Alert';
import type { AuditEvent } from '../domain/entities/AuditEvent';
import type { PhysicalCount, PhysicalCountItem } from '../domain/entities/PhysicalCount';
import type { User, UserRole } from '../domain/entities/User';
import type { CostCenter } from '../domain/entities/CostCenter';
import type { Responsible } from '../domain/entities/Responsible';

// Transitional re-exports: the catalog entities now live in `domain/entities`.
// Modules not yet migrated keep importing them from here until their phase.
export type { Product, ProductType, ProductStatus, MachineryStatus, DispatchStrategy, Category, UnitOfMeasure, Supplier, SupplierSnapshot, Location, StockEntry,
  Movement, MovementLine, MovementType, MovementStatus, Authorization, Alert, AuditEvent, PhysicalCount, PhysicalCountItem, User, UserRole, CostCenter, Responsible };

export interface Evidence {
  id: string;
  name: string;
  type: 'pdf' | 'jpg' | 'jpeg' | 'png';
  size: number;
  url?: string;
  uploadedBy: string;
  uploadedAt: string;
  movementId?: string;
  productId?: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  suppliers: Supplier[];
  products: Product[];
  categories: Category[];
  units: UnitOfMeasure[];
  locations: Location[];
  stock: StockEntry[];
  movements: Movement[];
  authorizations: Authorization[];
  costCenters: CostCenter[];
  responsibles: Responsible[];
  alerts: Alert[];
  auditLog: AuditEvent[];
  evidences: Evidence[];
  physicalCounts: PhysicalCount[];
  /** Borradores guardados localmente en modo sin conexión. */
  offlineDrafts: Movement[];
  systemConfig: SystemConfig;
  toasts: Toast[];
  activeRoute: string;
  sidebarCollapsed: boolean;
  mobileView: boolean;
  networkOnline: boolean;
}

export interface SystemConfig {
  costMethod: 'weighted_avg';
  allowNegativeStock: false;
  storageProvider: 'minio' | 'gcs';
  storageBucket: string;
  totpDemoCode: string;
  defaultDispatchStrategy: DispatchStrategy;
  requireEvidenceForNegativeAdjustment: true;
}

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  costMethod: 'weighted_avg',
  allowNegativeStock: false,
  storageProvider: 'minio',
  storageBucket: 'siga-evidencias',
  totpDemoCode: '123456',
  defaultDispatchStrategy: 'FIFO',
  requireEvidenceForNegativeAdjustment: true,
};

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export type Permission = {
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'authorize')[];
};

