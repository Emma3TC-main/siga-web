# SIGA Web — Refactor Clean Architecture · Fase 3 (Movements)

## Alcance
Entradas, salidas, transferencias, ajustes y conteos físicos. Como el reducer cambiaba stock, movimientos, autorizaciones, alertas y auditoría en una sola transición, esta fase mueve también los repositorios y casos de uso de esas cinco áreas (las páginas de Authorizations/Traceability/Audit se migran a hooks en la Fase 4).

## Capas nuevas
- `domain/entities`: `Movement`, `Authorization`, `Alert`, `AuditEvent` (+ `NewAuditEvent`), `PhysicalCount`.
- `domain/repositories`: `StockRepository`, `MovementRepository`, `AuthorizationRepository`, `AlertRepository`, `AuditRepository`, `PhysicalCountRepository`.
- `domain/rules/movementRules.ts`: `applyConfirmedMovement` (extraída literalmente; nunca deja stock negativo, devuelve conflicto 409), `getMovementLines`, `nextMovementId`, `buildAuthorizationFor`, `buildPendingAuthorizationAlert`, `buildOutOfStockAlert`.
- `application`: `RegisterMovement`, `ConfirmMovement`, `ResolveAuthorization`, `RecordAuditEvent`, `MarkAlertRead`, `GetStock`, `GetMovements`, `GetAuthorizations`, `GetAlerts`, `GetAuditLog`, `GetPhysicalCounts`.
- `infrastructure/repositories`: 6 repositorios `Demo*`. `DemoAuditRepository` asigna id, fecha, hora e IP (responsabilidad de un backend).
- `data/demo`: `stock`, `movements`, `authorizations`, `alerts`, `audit`, `physicalCounts`. `demo.ts` conserva usuarios, centros de costo, responsables y evidencias.
- `presentation/state/OperationsContext.tsx`: estado compartido de la operación; ejecuta las operaciones una por una y recarga.
- Hooks: `useMovements`, `useAuthorizations`, `useStock`, `usePhysicalCounts`.
- `app/compositionRoot.ts`: ahora también exporta `operationsUseCases`.

## AppContext
Pasó de ~415 a ~150 líneas: sesión, usuarios, navegación y avisos. Compone `state` desde `CatalogProvider` y `OperationsProvider` para los consumidores aún sin migrar (Header, Sidebar, dashboards, Machinery).

## Páginas migradas
Entries, MultiDetailMovement (Salidas, Transferencias, Ajustes), Authorizations, PhysicalCount, SupervisorDashboard, Suppliers, Inventory (vía `useInventory`).

## Diferencias observables
1. Los avisos de operaciones (offline, conflicto 409, confirmación MFA) siguen sin descartarse solos, como en el original (`showToast(..., autoDismiss=false)`). Es un descuido preexistente; corregirlo es cambiar la constante `KEEP_VISIBLE` en `useMovements`.
2. La IP en los eventos de auditoría de movimientos era aleatoria (192.168.1.10–29); ahora es fija (192.168.1.10).
3. La página de Entradas sigue mostrando éxito aunque el registro falle por offline/conflicto (comportamiento original conservado).

## Código muerto eliminado
`getProductStock`, `getProductStockByLocation`, acción `ADD_AUDIT`, y variables/imports sin uso en Inventory, Locations, PhysicalCount y MultiDetail.

## Verificación (sin `pnpm build`, no disponible en el entorno)
- `tsc --strict` de domain/application/infrastructure/app y typecheck con stubs de páginas, hooks y providers: sin errores.
- Reducer original vs. casos de uso, 21 pasos (entrada, salida, transferencia, ajustes, borrador, sensible, aprobar, rechazar, 409, alerta sin_stock sin duplicar, offline, MFA): equivalentes en stock, movimientos, autorizaciones, alertas, auditoría y avisos.
- Chromium, baseline vs. refactor: flujo entrada → autorización sensible → aprobación → MFA (409 real) → auditoría idéntico; escenarios de Fases 1 y 2 en 4 roles idénticos; recorrido del menú (19 páginas admin, 13 almacén) sin errores de runtime.
- Sin verificar: `vite build` con Tailwind real, responsive, roles móviles.

## Pendiente para el backend
`RegisterMovement` y `ConfirmMovement` deberían ser transacciones del servidor al pasar a API; los repositorios actuales están pensados para la demo (se revisa en la Fase 6).
