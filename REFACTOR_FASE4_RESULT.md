# SIGA Web — Refactor Clean Architecture · Fase 4 (Authorizations, Traceability, Audit)

## Alcance
Los repositorios y casos de uso de autorizaciones y auditoría ya existían desde la Fase 3 (se crearon junto con Movements porque el reducer los cambiaba en la misma transición). Esta fase migra las páginas restantes a hooks y extrae al dominio la lógica que quedaba en ellas.

## Capas nuevas
- `domain/rules/auditRules.ts`: `getAuditModules`, `filterAuditEvents` (búsqueda + filtro por módulo/resultado, extraída literalmente de `Audit.tsx`).
- `domain/rules/authorizationRules.ts`: `filterAuthorizationsByStatus`, `countAuthorizationsByStatus` (antes duplicada como 3 `.filter().length` en `Authorizations.tsx` y en `SupervisorDashboard.tsx`).
- `domain/rules/traceabilityRules.ts`: `searchProducts` (mínimo 2 caracteres), `getProductTimeline` (movimientos de un producto, más reciente primero).
- `domain/services/MfaVerifier.ts` + `infrastructure/services/DemoMfaVerifier.ts`: el código de demostración `123456`, que estaba como literal en `Authorizations.tsx`, pasó a un servicio de infraestructura. Caso de uso `VerifyMfaCode`, expuesto en `OperationsUseCases` y en el hook `useAuthorizations`.
- Hook `useAuditLog`.

## Páginas migradas
- `Audit.tsx`: lee `useAuditLog()` en vez de `state.auditLog`; filtrado y lista de módulos ahora vienen de `auditRules`.
- `Traceability.tsx`: lee `useProducts`, `useMovements`, `useLocations`, `useUnits`, `useStock` en vez de `state.*`; búsqueda y línea de tiempo vienen de `traceabilityRules`; el stock de un producto reutiliza `stockEntriesOfProduct` (de `inventoryRules`, Fase 2).
- `Authorizations.tsx`: usa `filterAuthorizationsByStatus`/`countAuthorizationsByStatus`; la verificación del código TOTP pasa por `verifyMfaCode()` en vez de comparar con el literal `'123456'`.
- `SupervisorDashboard.tsx`: mismo cambio de conteo/filtro por estado, y ahora lee `authorizations` del hook en vez de `state.authorizations`.

## Puente que sigue vigente
`Sidebar.tsx`, `MobileNav.tsx` y `Dashboard.tsx` siguen leyendo `state.authorizations` / `state.auditLog` a través de `AppContext` (se migran en la Fase 6, junto con el resto de componentes de layout).

## Verificación (sin `pnpm build`, no disponible en el entorno)
- `tsc --strict` de las nuevas reglas de dominio: sin errores.
- Equivalencia contra la lógica original sobre los datos demo: filtros de auditoría (168 combinaciones de búsqueda × módulo × resultado), conteo y filtro de autorizaciones por estado, búsqueda de productos (6 consultas) y línea de tiempo (los 65 productos): idénticos. El verificador MFA acepta `123456` y rechaza cualquier otro valor, igual que el original.
- Typecheck de páginas con stubs: sin errores reales (solo módulos ausentes en el entorno de prueba, como `recharts`, y avisos de variables sin uso preexistentes en páginas no tocadas por esta fase).
- Chromium, baseline vs. refactor: Trazabilidad (búsqueda, selección de 2 productos distintos) y Auditoría (búsqueda, 3 filtros por módulo, 3 por resultado, detalle de un evento) — 13 pasos, 0 diferencias, 0 errores de runtime. Confirmación MFA con código incorrecto: mismo mensaje de error que la baseline. Escenarios completos de las Fases 1, 2 y 3 (incluido el flujo entrada → autorización sensible → aprobación → MFA con conflicto 409 real): siguen idénticos.
