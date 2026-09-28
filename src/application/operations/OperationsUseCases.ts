import type { GetAlerts } from '../alerts/GetAlerts';
import type { MarkAlertRead } from '../alerts/MarkAlertRead';
import type { GetAuditLog } from '../audit/GetAuditLog';
import type { GetAuthorizations } from '../authorizations/GetAuthorizations';
import type { ResolveAuthorization } from '../authorizations/ResolveAuthorization';
import type { VerifyMfaCode } from '../authorizations/VerifyMfaCode';
import type { GetReportSeries } from '../reports/GetReportSeries';
import type { CreateUser } from '../users/CreateUser';
import type { GetUsers } from '../users/GetUsers';
import type { UpdateUser } from '../users/UpdateUser';
import type { GetStock } from '../inventory/GetStock';
import type { ConfirmMovement } from '../movements/ConfirmMovement';
import type { GetMovements } from '../movements/GetMovements';
import type { GetPhysicalCounts } from '../movements/GetPhysicalCounts';
import type { RegisterMovement } from '../movements/RegisterMovement';

/** Casos de uso de la operación del almacén (stock, movimientos, autorizaciones, alertas, auditoría) y de los usuarios, cuyos cambios también quedan en la auditoría. */
export interface OperationsUseCases {
  getStock: GetStock;
  getMovements: GetMovements;
  getAuthorizations: GetAuthorizations;
  getAlerts: GetAlerts;
  getAuditLog: GetAuditLog;
  getPhysicalCounts: GetPhysicalCounts;
  registerMovement: RegisterMovement;
  confirmMovement: ConfirmMovement;
  resolveAuthorization: ResolveAuthorization;
  verifyMfaCode: VerifyMfaCode;
  getUsers: GetUsers;
  createUser: CreateUser;
  updateUser: UpdateUser;
  getReportSeries: GetReportSeries;
  markAlertRead: MarkAlertRead;
}
