import type { GetUnreadNotificationCount } from '../notifications/GetUnreadNotificationCount';
import type { ListNotifications } from '../notifications/ListNotifications';
import type { MarkNotificationRead } from '../notifications/MarkNotificationRead';
import type { GetAuditLog } from '../audit/GetAuditLog';
import type { GetAuthorizations } from '../authorizations/GetAuthorizations';
import type { ResolveAuthorization } from '../authorizations/ResolveAuthorization';
import type { GetUsers } from '../users/GetUsers';
import type { GetStock } from '../inventory/GetStock';
import type { ConfirmMovement } from '../movements/ConfirmMovement';
import type { GetMovements } from '../movements/GetMovements';
import type { RegisterMovement } from '../movements/RegisterMovement';

/** Casos de uso operativos. `getOperationalUsers` conserva solo etiquetas/personas para vistas operativas. */
export interface OperationsUseCases {
  getStock: GetStock;
  getMovements: GetMovements;
  getAuthorizations: GetAuthorizations;
  listNotifications: ListNotifications;
  getUnreadNotificationCount: GetUnreadNotificationCount;
  getAuditLog: GetAuditLog;
  registerMovement: RegisterMovement;
  confirmMovement: ConfirmMovement;
  resolveAuthorization: ResolveAuthorization;
  getOperationalUsers: GetUsers;
  markNotificationRead: MarkNotificationRead;
}
