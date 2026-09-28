/**
 * Único lugar que conoce las implementaciones concretas.
 * Para conectar el backend, sustituir aquí los repositorios Demo* por Api* sin tocar páginas ni casos de uso.
 */
import type { CatalogUseCases } from '../application/catalog/CatalogUseCases';
import type { OperationsUseCases } from '../application/operations/OperationsUseCases';
import { GetAlerts } from '../application/alerts/GetAlerts';
import { MarkAlertRead } from '../application/alerts/MarkAlertRead';
import { GetAuditLog } from '../application/audit/GetAuditLog';
import { GetAuthorizations } from '../application/authorizations/GetAuthorizations';
import { ResolveAuthorization } from '../application/authorizations/ResolveAuthorization';
import { VerifyMfaCode } from '../application/authorizations/VerifyMfaCode';
import { GetStock } from '../application/inventory/GetStock';
import { ConfirmMovement } from '../application/movements/ConfirmMovement';
import { GetMovements } from '../application/movements/GetMovements';
import { GetPhysicalCounts } from '../application/movements/GetPhysicalCounts';
import { RegisterMovement } from '../application/movements/RegisterMovement';
import { GetProducts } from '../application/products/GetProducts';
import { CreateProduct } from '../application/products/CreateProduct';
import { UpdateProduct } from '../application/products/UpdateProduct';
import { GetCategories } from '../application/categories/GetCategories';
import { CreateCategory } from '../application/categories/CreateCategory';
import { GetUnits } from '../application/units/GetUnits';
import { CreateUnit } from '../application/units/CreateUnit';
import { GetCostCenters } from '../application/administration/GetCostCenters';
import { GetResponsibles } from '../application/administration/GetResponsibles';
import { GetReportSeries } from '../application/reports/GetReportSeries';
import { CreateUser } from '../application/users/CreateUser';
import { GetUsers } from '../application/users/GetUsers';
import { UpdateUser } from '../application/users/UpdateUser';
import { GetLocations } from '../application/locations/GetLocations';
import { GetSuppliers } from '../application/suppliers/GetSuppliers';
import { CreateSupplier } from '../application/suppliers/CreateSupplier';
import { UpdateSupplier } from '../application/suppliers/UpdateSupplier';
import { SetSupplierStatus } from '../application/suppliers/SetSupplierStatus';
import { DemoProductRepository } from '../infrastructure/repositories/DemoProductRepository';
import { DemoCategoryRepository } from '../infrastructure/repositories/DemoCategoryRepository';
import { DemoUnitRepository } from '../infrastructure/repositories/DemoUnitRepository';
import { DemoCostCenterRepository } from '../infrastructure/repositories/DemoCostCenterRepository';
import { DemoResponsibleRepository } from '../infrastructure/repositories/DemoResponsibleRepository';
import { DemoReportSeriesRepository } from '../infrastructure/repositories/DemoReportSeriesRepository';
import { DemoUserRepository } from '../infrastructure/repositories/DemoUserRepository';
import { DemoLocationRepository } from '../infrastructure/repositories/DemoLocationRepository';
import { DemoSupplierRepository } from '../infrastructure/repositories/DemoSupplierRepository';
import { DemoStockRepository } from '../infrastructure/repositories/DemoStockRepository';
import { DemoMovementRepository } from '../infrastructure/repositories/DemoMovementRepository';
import { DemoAuthorizationRepository } from '../infrastructure/repositories/DemoAuthorizationRepository';
import { DemoAlertRepository } from '../infrastructure/repositories/DemoAlertRepository';
import { DemoAuditRepository } from '../infrastructure/repositories/DemoAuditRepository';
import { DemoMfaVerifier } from '../infrastructure/services/DemoMfaVerifier';
import { DemoPhysicalCountRepository } from '../infrastructure/repositories/DemoPhysicalCountRepository';

const productRepository = new DemoProductRepository();
const categoryRepository = new DemoCategoryRepository();
const unitRepository = new DemoUnitRepository();
const supplierRepository = new DemoSupplierRepository();
const locationRepository = new DemoLocationRepository();
const costCenterRepository = new DemoCostCenterRepository();
const responsibleRepository = new DemoResponsibleRepository();

export const catalogUseCases: CatalogUseCases = {
  getProducts: new GetProducts(productRepository),
  createProduct: new CreateProduct(productRepository),
  updateProduct: new UpdateProduct(productRepository),
  getCategories: new GetCategories(categoryRepository),
  createCategory: new CreateCategory(categoryRepository),
  getUnits: new GetUnits(unitRepository),
  createUnit: new CreateUnit(unitRepository),
  getLocations: new GetLocations(locationRepository),
  getCostCenters: new GetCostCenters(costCenterRepository),
  getResponsibles: new GetResponsibles(responsibleRepository),
  getSuppliers: new GetSuppliers(supplierRepository),
  createSupplier: new CreateSupplier(supplierRepository),
  updateSupplier: new UpdateSupplier(supplierRepository),
  setSupplierStatus: new SetSupplierStatus(supplierRepository),
};

const stockRepository = new DemoStockRepository();
const movementRepository = new DemoMovementRepository();
const authorizationRepository = new DemoAuthorizationRepository();
const alertRepository = new DemoAlertRepository();
const auditRepository = new DemoAuditRepository();
const physicalCountRepository = new DemoPhysicalCountRepository();
const userRepository = new DemoUserRepository();
const reportSeriesRepository = new DemoReportSeriesRepository();

export const operationsUseCases: OperationsUseCases = {
  getStock: new GetStock(stockRepository),
  getMovements: new GetMovements(movementRepository),
  getAuthorizations: new GetAuthorizations(authorizationRepository),
  getAlerts: new GetAlerts(alertRepository),
  getAuditLog: new GetAuditLog(auditRepository),
  getPhysicalCounts: new GetPhysicalCounts(physicalCountRepository),
  registerMovement: new RegisterMovement(movementRepository, stockRepository, authorizationRepository, alertRepository, auditRepository, productRepository),
  confirmMovement: new ConfirmMovement(movementRepository, stockRepository, auditRepository),
  resolveAuthorization: new ResolveAuthorization(authorizationRepository, movementRepository, auditRepository),
  verifyMfaCode: new VerifyMfaCode(new DemoMfaVerifier()),
  getUsers: new GetUsers(userRepository),
  createUser: new CreateUser(userRepository, auditRepository),
  updateUser: new UpdateUser(userRepository, auditRepository),
  getReportSeries: new GetReportSeries(reportSeriesRepository),
  markAlertRead: new MarkAlertRead(alertRepository),
};
