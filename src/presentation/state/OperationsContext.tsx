import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { OperationsUseCases } from '../../application/operations/OperationsUseCases';
import type { ConfirmMovementInput, ConfirmMovementResult } from '../../application/movements/ConfirmMovement';
import type { RegisterMovementInput, RegisterMovementResult } from '../../application/movements/RegisterMovement';
import type { ResolveAuthorizationInput } from '../../application/authorizations/ResolveAuthorization';
import type { Alert } from '../../domain/entities/Alert';
import type { AuditEvent } from '../../domain/entities/AuditEvent';
import type { Authorization } from '../../domain/entities/Authorization';
import type { Movement } from '../../domain/entities/Movement';
import type { CreateUserInput } from '../../application/users/CreateUser';
import type { PhysicalCount } from '../../domain/entities/PhysicalCount';
import type { ReportSeries } from '../../domain/entities/ReportSeries';
import type { User, UserChanges } from '../../domain/entities/User';
import type { StockEntry } from '../../domain/entities/Stock';
import { getErrorMessage } from '../../shared/errors/getErrorMessage';

interface OperationsContextValue {
  stock: StockEntry[];
  movements: Movement[];
  authorizations: Authorization[];
  alerts: Alert[];
  auditLog: AuditEvent[];
  physicalCounts: PhysicalCount[];
  users: User[];
  reportSeries: ReportSeries | null;
  /** `true` hasta completar la carga inicial. */
  loading: boolean;
  /** Mensaje de la última carga fallida; `null` si todo cargó bien. */
  error: string | null;
  registerMovement: (input: RegisterMovementInput) => Promise<RegisterMovementResult>;
  confirmMovement: (input: ConfirmMovementInput) => Promise<ConfirmMovementResult>;
  resolveAuthorization: (input: ResolveAuthorizationInput) => Promise<void>;
  verifyMfaCode: (code: string) => Promise<boolean>;
  createUser: (input: CreateUserInput, actorId: string) => Promise<User>;
  updateUser: (id: string, changes: UserChanges, actorId: string) => Promise<User>;
  markAlertRead: (id: string) => Promise<void>;
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
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEvent[]>([]);
  const [physicalCounts, setPhysicalCounts] = useState<PhysicalCount[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reportSeries, setReportSeries] = useState<ReportSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  const refresh = useCallback(async () => {
    const [nextStock, nextMovements, nextAuthorizations, nextAlerts, nextAuditLog, nextUsers] = await Promise.all([
      useCases.getStock.execute(),
      useCases.getMovements.execute(),
      useCases.getAuthorizations.execute(),
      useCases.getAlerts.execute(),
      useCases.getAuditLog.execute(),
      useCases.getUsers.execute(),
    ]);
    setStock(nextStock);
    setMovements(nextMovements);
    setAuthorizations(nextAuthorizations);
    setAlerts(nextAlerts);
    setAuditLog(nextAuditLog);
    setUsers(nextUsers);
  }, [useCases]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([refresh(), useCases.getPhysicalCounts.execute(), useCases.getReportSeries.execute()])
      .then(([, counts, series]) => {
        if (cancelled) return;
        setPhysicalCounts(counts);
        setReportSeries(series);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [useCases, refresh]);

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

  const confirmMovement = useCallback((input: ConfirmMovementInput) => runExclusive(async () => {
    const result = await useCases.confirmMovement.execute(input);
    if (result.outcome === 'confirmed') await refresh();
    return result;
  }), [useCases, refresh, runExclusive]);

  const resolveAuthorization = useCallback((input: ResolveAuthorizationInput) => runExclusive(async () => {
    await useCases.resolveAuthorization.execute(input);
    await refresh();
  }), [useCases, refresh, runExclusive]);

  const verifyMfaCode = useCallback((code: string) => useCases.verifyMfaCode.execute(code), [useCases]);

  const createUser = useCallback((input: CreateUserInput, actorId: string) => runExclusive(async () => {
    const user = await useCases.createUser.execute(input, actorId);
    await refresh();
    return user;
  }), [useCases, refresh, runExclusive]);

  const updateUser = useCallback((id: string, changes: UserChanges, actorId: string) => runExclusive(async () => {
    const user = await useCases.updateUser.execute(id, changes, actorId);
    await refresh();
    return user;
  }), [useCases, refresh, runExclusive]);

  const markAlertRead = useCallback((id: string) => runExclusive(async () => {
    await useCases.markAlertRead.execute(id);
    await refresh();
  }), [useCases, refresh, runExclusive]);

  const value = useMemo<OperationsContextValue>(() => ({
    stock, movements, authorizations, alerts, auditLog, physicalCounts, users, reportSeries, loading, error,
    registerMovement, confirmMovement, resolveAuthorization, verifyMfaCode, createUser, updateUser, markAlertRead,
  }), [stock, movements, authorizations, alerts, auditLog, physicalCounts, users, reportSeries, loading, error,
    registerMovement, confirmMovement, resolveAuthorization, verifyMfaCode, createUser, updateUser, markAlertRead]);

  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
}

export function useOperations(): OperationsContextValue {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error('useOperations must be used within OperationsProvider');
  return ctx;
}
