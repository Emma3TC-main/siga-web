import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { OperationsUseCases } from '../../application/operations/OperationsUseCases';
import type { ConfirmMovementInput, ConfirmMovementResult } from '../../application/movements/ConfirmMovement';
import type { RegisterMovementInput, RegisterMovementResult } from '../../application/movements/RegisterMovement';
import type { ResolveAuthorizationInput } from '../../application/authorizations/ResolveAuthorization';
import type { Notification } from '../../domain/entities/Notification';
import type { AuditEvent } from '../../domain/entities/AuditEvent';
import type { Authorization } from '../../domain/entities/Authorization';
import type { Movement } from '../../domain/entities/Movement';
import type { PhysicalCount } from '../../domain/entities/PhysicalCount';
import type { User } from '../../domain/entities/User';
import type { StockEntry } from '../../domain/entities/Stock';
import { getErrorMessage } from '../../shared/errors/getErrorMessage';
import { NotFoundError } from '../../domain/errors';

interface OperationsContextValue {
  stock: StockEntry[];
  movements: Movement[];
  authorizations: Authorization[];
  alerts: Notification[];
  unreadNotificationCount: number | null;
  notificationsLoading: boolean;
  notificationError: Error | null;
  auditLog: AuditEvent[];
  physicalCounts: PhysicalCount[];
  operationalUsers: User[];
  /** `true` hasta completar la carga inicial. */
  loading: boolean;
  /** Mensaje de la última carga fallida; `null` si todo cargó bien. */
  error: Error | null;
  registerMovement: (input: RegisterMovementInput) => Promise<RegisterMovementResult>;
  submitMovement: (movementId: string) => Promise<Movement>;
  confirmMovement: (input: ConfirmMovementInput) => Promise<ConfirmMovementResult>;
  resolveAuthorization: (input: ResolveAuthorizationInput) => Promise<void>;
  searchAuditLog: (filters?: import('../../domain/repositories/AuditRepository').AuditQueryFilters) => Promise<import('../../domain/repositories/AuditRepository').AuditPage>;
  markAlertRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const OperationsContext = createContext<OperationsContextValue | null>(null);

/**
 * Estado compartido de la operación del almacén. Stock, movimientos, autorizaciones, alertas y auditoría
 * cambian juntos, así que las operaciones se ejecutan una por una y luego se recarga el estado.
 */
export function OperationsProvider({ useCases, children }: { useCases: OperationsUseCases; children: ReactNode }) {
  const [stock, setStock] = useState<StockEntry[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number | null>(null);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationError, setNotificationError] = useState<Error | null>(null);
  const [auditLog] = useState<AuditEvent[]>([]);
  const [physicalCounts, setPhysicalCounts] = useState<PhysicalCount[]>([]);
  const [operationalUsers, setOperationalUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const notificationListInFlight = useRef<Promise<void> | null>(null);
  const notificationCountInFlight = useRef<Promise<void> | null>(null);

  const refresh = useCallback(async () => {
    const [nextStock, nextMovements, nextAuthorizations, nextUsers] = await Promise.all([
      useCases.getStock.execute(),
      useCases.getMovements.execute(),
      useCases.getAuthorizations.execute(),
      useCases.getOperationalUsers.execute(),
    ]);
    setStock(nextStock);
    setMovements(nextMovements);
    setAuthorizations(nextAuthorizations);
    setOperationalUsers(nextUsers);
  }, [useCases]);

  const refreshNotificationList = useCallback((): Promise<void> => {
    if (notificationListInFlight.current) return notificationListInFlight.current;
    const request = useCases.listNotifications.execute({ page: 0, size: 20, unreadOnly: false })
      .then(page => {
        setAlerts(page.content);
        setNotificationError(null);
      })
      .catch((cause: unknown) => {
        const failure = cause instanceof Error ? cause : new Error(getErrorMessage(cause));
        setNotificationError(failure);
        throw failure;
      })
      .finally(() => {
        notificationListInFlight.current = null;
        setNotificationsLoading(false);
      });
    notificationListInFlight.current = request;
    return request;
  }, [useCases]);

  const refreshUnreadNotificationCount = useCallback((): Promise<void> => {
    if (notificationCountInFlight.current) return notificationCountInFlight.current;
    const request = useCases.getUnreadNotificationCount.execute()
      .then(count => {
        setUnreadNotificationCount(count);
        setNotificationError(null);
      })
      .catch((cause: unknown) => {
        const failure = cause instanceof Error ? cause : new Error(getErrorMessage(cause));
        setNotificationError(failure);
        throw failure;
      })
      .finally(() => {
        notificationCountInFlight.current = null;
      });
    notificationCountInFlight.current = request;
    return request;
  }, [useCases]);

  const refreshNotifications = useCallback(async () => {
    await Promise.all([refreshNotificationList(), refreshUnreadNotificationCount()]);
  }, [refreshNotificationList, refreshUnreadNotificationCount]);

  useEffect(() => {
    let cancelled = false;
    refresh()
      .then(() => {
        if (cancelled) return;
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause : new Error(getErrorMessage(cause)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [useCases, refresh]);

  useEffect(() => {
    refreshNotifications().catch(() => undefined);
  }, [refreshNotifications]);

  useEffect(() => {
    let timer: number | undefined;
    let stopped = false;
    let running = false;

    const schedule = () => {
      if (stopped || document.hidden) return;
      timer = window.setTimeout(run, 30_000);
    };
    const run = async () => {
      if (stopped || document.hidden || running) return;
      running = true;
      try {
        await refreshUnreadNotificationCount();
      } catch {
        // The visible error state is retained; polling continues on the next cycle.
      } finally {
        running = false;
        schedule();
      }
    };
    const onVisibilityChange = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
      if (!document.hidden) void run();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    schedule();
    return () => {
      stopped = true;
      if (timer !== undefined) window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [refreshUnreadNotificationCount]);

  /** Encadena las operaciones para que dos acciones seguidas no se pisen al leer y escribir el stock. */
  const runExclusive = useCallback(<T,>(task: () => Promise<T>): Promise<T> => {
    const run = queue.current.then(task);
    queue.current = run.then(() => undefined, () => undefined);
    return run;
  }, []);

  const registerMovement = useCallback((input: RegisterMovementInput) => runExclusive(async () => {
    const result = await useCases.registerMovement.execute(input);
    if (result.outcome === 'registered') await refresh();
    return result;
  }), [useCases, refresh, runExclusive]);

  const submitMovement = useCallback((movementId: string) => runExclusive(async () => {
    const movement = await useCases.registerMovement.submitExisting(movementId);
    await refresh();
    return movement;
  }), [useCases, refresh, runExclusive]);

  const confirmMovement = useCallback((input: ConfirmMovementInput) => runExclusive(async () => {
    const result = await useCases.confirmMovement.execute(input);
    if (result.outcome === 'confirmed') await refresh();
    return result;
  }), [useCases, refresh, runExclusive]);

  const resolveAuthorization = useCallback((input: ResolveAuthorizationInput) => runExclusive(async () => {
    await useCases.resolveAuthorization.execute(input);
    await refresh();
  }), [useCases, refresh, runExclusive]);

  const markAlertRead = useCallback((id: string) => runExclusive(async () => {
    try {
      await useCases.markNotificationRead.execute(id);
    } catch (cause) {
      if (!(cause instanceof NotFoundError)) throw cause;
    }
    await refreshNotifications();
  }), [useCases, refreshNotifications, runExclusive]);

  const searchAuditLog = useCallback((filters?: import('../../domain/repositories/AuditRepository').AuditQueryFilters) => {
    return useCases.getAuditLog.search(filters);
  }, [useCases]);

  const value = useMemo<OperationsContextValue>(() => ({
    stock, movements, authorizations, alerts, unreadNotificationCount, notificationsLoading, notificationError,
    auditLog, physicalCounts, operationalUsers, loading, error, registerMovement, submitMovement, confirmMovement,
    resolveAuthorization, searchAuditLog, markAlertRead, refreshNotifications,
  }), [stock, movements, authorizations, alerts, unreadNotificationCount, notificationsLoading, notificationError,
    auditLog, physicalCounts, operationalUsers, loading, error, registerMovement, submitMovement, confirmMovement,
    resolveAuthorization, searchAuditLog, markAlertRead, refreshNotifications]);

  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
}

export function useOperations(): OperationsContextValue {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error('useOperations must be used within OperationsProvider');
  return ctx;
}
