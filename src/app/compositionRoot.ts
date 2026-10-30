/**
 * Único lugar que conoce las implementaciones concretas.
 * Para conectar el backend, sustituir aquí los repositorios Demo* por Api* sin tocar páginas ni casos de uso.
 */
import type { CatalogUseCases } from '../application/catalog/CatalogUseCases';
import type { OperationsUseCases } from '../application/operations/OperationsUseCases';
import { GetUnreadNotificationCount } from '../application/notifications/GetUnreadNotificationCount';
import { ListNotifications } from '../application/notifications/ListNotifications';
import { MarkNotificationRead } from '../application/notifications/MarkNotificationRead';
import { GetAuditLog } from '../application/audit/GetAuditLog';
import { GetAuthorizations } from '../application/authorizations/GetAuthorizations';
import { ResolveAuthorization } from '../application/authorizations/ResolveAuthorization';
import { GetStock } from '../application/inventory/GetStock';
import { ConfirmMovement } from '../application/movements/ConfirmMovement';
import { GetMovements } from '../application/movements/GetMovements';
import { RegisterMovement } from '../application/movements/RegisterMovement';
import { GetProducts } from '../application/products/GetProducts';
import { CreateProduct } from '../application/products/CreateProduct';
import { UpdateProduct } from '../application/products/UpdateProduct';
import { GetProduct } from '../application/products/GetProduct';
import { SetProductStatus } from '../application/products/SetProductStatus';
import { GetCategories } from '../application/categories/GetCategories';
import { CreateCategory } from '../application/categories/CreateCategory';
import { GetUnits } from '../application/units/GetUnits';
import { CreateUnit } from '../application/units/CreateUnit';
import { GetCostCenters } from '../application/administration/GetCostCenters';
import { GetResponsibles } from '../application/administration/GetResponsibles';
import { GetUsers } from '../application/users/GetUsers';
import { UserAdminUseCases } from '../application/users/UserAdminUseCases';
import { RoleAdminUseCases } from '../application/roles/RoleAdminUseCases';
import { GetLocations } from '../application/locations/GetLocations';
import { LocationAdminUseCases } from '../application/locations/LocationAdminUseCases';
import { GetSuppliers } from '../application/suppliers/GetSuppliers';
import { GetSupplier } from '../application/suppliers/GetSupplier';
import { CreateSupplier } from '../application/suppliers/CreateSupplier';
import { UpdateSupplier } from '../application/suppliers/UpdateSupplier';
import { SetSupplierStatus } from '../application/suppliers/SetSupplierStatus';

// Demo Repositories
import { DemoProductRepository } from '../infrastructure/repositories/DemoProductRepository';
import { DemoCategoryRepository } from '../infrastructure/repositories/DemoCategoryRepository';
import { DemoUnitRepository } from '../infrastructure/repositories/DemoUnitRepository';
import { DemoCostCenterRepository } from '../infrastructure/repositories/DemoCostCenterRepository';
import { DemoResponsibleRepository } from '../infrastructure/repositories/DemoResponsibleRepository';
import { DemoUserRepository } from '../infrastructure/repositories/DemoUserRepository';
import { DemoUserAdminRepository } from '../infrastructure/repositories/DemoUserAdminRepository';
import { DemoRoleAdminRepository } from '../infrastructure/repositories/DemoRoleAdminRepository';
import { DemoLocationRepository } from '../infrastructure/repositories/DemoLocationRepository';
import { DemoLocationAdminRepository } from '../infrastructure/repositories/DemoLocationAdminRepository';
import { DemoSupplierRepository } from '../infrastructure/repositories/DemoSupplierRepository';
import { DemoStockRepository } from '../infrastructure/repositories/DemoStockRepository';
import { DemoMovementRepository } from '../infrastructure/repositories/DemoMovementRepository';
import { DemoAuthorizationRepository } from '../infrastructure/repositories/DemoAuthorizationRepository';
import { ApiAuthorizationRepository } from '../infrastructure/repositories/ApiAuthorizationRepository';
import { DemoAlertRepository } from '../infrastructure/repositories/DemoAlertRepository';
import { DemoAuditRepository } from '../infrastructure/repositories/DemoAuditRepository';
import { DemoPhysicalCountRepository } from '../infrastructure/repositories/DemoPhysicalCountRepository';
import { DemoAuthRepository } from '../infrastructure/repositories/DemoAuthRepository';

// Api Repositories
import { ApiProductRepository } from '../infrastructure/repositories/ApiProductRepository';
import { ApiCategoryRepository } from '../infrastructure/repositories/ApiCategoryRepository';
import { ApiUnitRepository } from '../infrastructure/repositories/ApiUnitRepository';
import { ApiSupplierRepository } from '../infrastructure/repositories/ApiSupplierRepository';
import { ApiAuthRepository } from '../infrastructure/repositories/ApiAuthRepository';
import { ApiLocationRepository } from '../infrastructure/repositories/ApiLocationRepository';
import { ApiLocationAdminRepository } from '../infrastructure/repositories/ApiLocationAdminRepository';
import { ApiLotRepository } from '../infrastructure/repositories/ApiLotRepository';
import { ApiAssetRepository } from '../infrastructure/repositories/ApiAssetRepository';
import { ApiAuditRepository } from '../infrastructure/repositories/ApiAuditRepository';
import { ApiNotificationRepository } from '../infrastructure/repositories/ApiNotificationRepository';
import { DemoLotRepository } from '../infrastructure/repositories/DemoLotRepository';
import { DemoAssetRepository } from '../infrastructure/repositories/DemoAssetRepository';
import { AssetAdminUseCases, LotAdminUseCases } from '../application/traceability/TraceabilityAdminUseCases';
import { ApiEvidenceRepository } from '../infrastructure/repositories/ApiEvidenceRepository';
import { EvidenceUseCases } from '../application/evidence/EvidenceUseCases';
import { PhysicalCountUseCases } from '../application/physical-counts/PhysicalCountUseCases';
import { ApiPhysicalCountRepository } from '../infrastructure/repositories/ApiPhysicalCountRepository';
import { ApiUserAdminRepository } from '../infrastructure/repositories/ApiUserAdminRepository';
import { ApiRoleAdminRepository } from '../infrastructure/repositories/ApiRoleAdminRepository';

const MODE: 'DEMO' | 'REMOTE' = 'REMOTE'; // Cambiar a REMOTE para probar backend

const authRepository = MODE === 'REMOTE' ? new ApiAuthRepository() : new DemoAuthRepository();
import { ApiClient } from '../infrastructure/http/ApiClient';
ApiClient.tokenProvider = () => authRepository.getAccessToken();
ApiClient.refreshHandler = () => authRepository.refreshSession();

const productRepository = MODE === 'REMOTE' ? new ApiProductRepository() : new DemoProductRepository();
const categoryRepository = MODE === 'REMOTE' ? new ApiCategoryRepository() : new DemoCategoryRepository();
const unitRepository = MODE === 'REMOTE' ? new ApiUnitRepository() : new DemoUnitRepository();
const supplierRepository = MODE === 'REMOTE' ? new ApiSupplierRepository() : new DemoSupplierRepository();
const locationRepository = MODE === 'REMOTE' ? new ApiLocationRepository() : new DemoLocationRepository();
const locationAdminRepository = MODE === 'REMOTE'
  ? new ApiLocationAdminRepository()
  : new DemoLocationAdminRepository();
export const locationAdminUseCases = new LocationAdminUseCases(locationAdminRepository);
const costCenterRepository = new DemoCostCenterRepository();
const responsibleRepository = new DemoResponsibleRepository();

export const lotRepository = MODE === 'REMOTE' ? new ApiLotRepository() : new DemoLotRepository();
export const assetRepository = MODE === 'REMOTE' ? new ApiAssetRepository() : new DemoAssetRepository();
export const lotAdminUseCases = new LotAdminUseCases(lotRepository);
export const assetAdminUseCases = new AssetAdminUseCases(assetRepository);
const evidenceRepository = new ApiEvidenceRepository();
export const evidenceUseCases = new EvidenceUseCases(evidenceRepository);

export const catalogUseCases: CatalogUseCases = {
  getProducts: new GetProducts(productRepository),
  getProduct: new GetProduct(productRepository),
  createProduct: new CreateProduct(productRepository),
  updateProduct: new UpdateProduct(productRepository),
  setProductStatus: new SetProductStatus(productRepository),
  getCategories: new GetCategories(categoryRepository),
  createCategory: new CreateCategory(categoryRepository),
  getUnits: new GetUnits(unitRepository),
  createUnit: new CreateUnit(unitRepository),
  getLocations: new GetLocations(locationRepository),
  getCostCenters: new GetCostCenters(costCenterRepository),
  getResponsibles: new GetResponsibles(responsibleRepository),
  getSuppliers: new GetSuppliers(supplierRepository),
  getSupplier: new GetSupplier(supplierRepository),
  createSupplier: new CreateSupplier(supplierRepository),
  updateSupplier: new UpdateSupplier(supplierRepository),
  setSupplierStatus: new SetSupplierStatus(supplierRepository),
};

import { ApiStockRepository } from '../infrastructure/repositories/ApiStockRepository';

// Inventory/Movements ya pueden usar REMOTE porque Auth está conectado.
const INVENTORY_MODE: string = MODE;

const stockRepository = INVENTORY_MODE === 'REMOTE' ? new ApiStockRepository() : new DemoStockRepository();
import { ApiMovementRepository } from '../infrastructure/repositories/ApiMovementRepository';
const movementRepository = INVENTORY_MODE === 'REMOTE' ? new ApiMovementRepository(unitRepository) : new DemoMovementRepository();
const authorizationRepository = INVENTORY_MODE === 'REMOTE'
  ? new ApiAuthorizationRepository(movementRepository)
  : new DemoAuthorizationRepository();
const demoAlertRepository = MODE === 'REMOTE' ? null : new DemoAlertRepository();
const notificationRepository = MODE === 'REMOTE'
  ? new ApiNotificationRepository()
  : demoAlertRepository!;
const auditRepository = MODE === 'REMOTE' ? new ApiAuditRepository() : new DemoAuditRepository();
const physicalCountRepository = MODE === 'REMOTE'
  ? new ApiPhysicalCountRepository()
  : new DemoPhysicalCountRepository();
export const physicalCountUseCases = new PhysicalCountUseCases(physicalCountRepository);
// The operational directory remains isolated from Identity administration.
// It supplies display labels to legacy operational screens only.
const operationalUserDirectory = new DemoUserRepository();
const userAdminRepository = MODE === 'REMOTE'
  ? new ApiUserAdminRepository()
  : new DemoUserAdminRepository();
export const userAdminUseCases = new UserAdminUseCases(userAdminRepository);
const roleAdminRepository = MODE === 'REMOTE'
  ? new ApiRoleAdminRepository()
  : new DemoRoleAdminRepository();
export const roleAdminUseCases = new RoleAdminUseCases(roleAdminRepository);

export const operationsUseCases: OperationsUseCases = {
  getStock: new GetStock(stockRepository),
  getMovements: new GetMovements(movementRepository),
  getAuthorizations: new GetAuthorizations(authorizationRepository),
  listNotifications: new ListNotifications(notificationRepository),
  getUnreadNotificationCount: new GetUnreadNotificationCount(notificationRepository),
  getAuditLog: new GetAuditLog(auditRepository),
  registerMovement: new RegisterMovement(movementRepository, stockRepository, authorizationRepository, demoAlertRepository, auditRepository, productRepository),
  confirmMovement: new ConfirmMovement(movementRepository, stockRepository, auditRepository),
  resolveAuthorization: new ResolveAuthorization(authorizationRepository, movementRepository, auditRepository),
  getOperationalUsers: new GetUsers(operationalUserDirectory),
  markNotificationRead: new MarkNotificationRead(notificationRepository),
};

import { LoginUser } from '../application/auth/LoginUser';
import { LogoutUser } from '../application/auth/LogoutUser';
import { EnrollMfa } from '../application/auth/EnrollMfa';
import { VerifyLoginMfa } from '../application/auth/VerifyLoginMfa';

export const authUseCases = {
  login: new LoginUser(authRepository),
  enrollMfa: new EnrollMfa(authRepository),
  verifyMfa: new VerifyLoginMfa(authRepository),
  logout: new LogoutUser(authRepository),
};

import {
  GetAdjustmentReport,
  GetInventoryValuation,
  GetMovementReport,
  GetReportingDashboard,
  type ReportingUseCases,
} from '../application/reporting/ReportingUseCases';
import { ApiReportingRepository } from '../infrastructure/repositories/ApiReportingRepository';
import { DemoReportingRepository } from '../infrastructure/repositories/DemoReportingRepository';

const reportingRepository = MODE === 'REMOTE'
  ? new ApiReportingRepository()
  : new DemoReportingRepository();

export const reportingUseCases: ReportingUseCases = {
  getDashboard: new GetReportingDashboard(reportingRepository),
  getMovementReport: new GetMovementReport(reportingRepository),
  getInventoryValuation: new GetInventoryValuation(reportingRepository),
  getAdjustmentReport: new GetAdjustmentReport(reportingRepository),
};
