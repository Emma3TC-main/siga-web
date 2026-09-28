# SIGA Web — Refactor Clean Architecture · Fase 5 (Machinery, Reports, Analytics, Administration, Alerts)

## Alcance
Machinery, Reports, Analytics, Alerts, Users, RolesPermissions, Parameters, y el resto de páginas y componentes que aún leían `state.*` directamente: Dashboard, WarehouseDashboard, RoleDashboard, Sidebar, MobileNav, Header y Login. Continuity, Integrations y Profile no tocaban datos migrados (solo `currentUser`/navegación, que siguen en `AppContext`), así que no requirieron cambios.

## Capas nuevas
- `domain/entities`: `User` (+ `NewUser`, `UserChanges`), `CostCenter`, `Responsible`, `ReportSeries` (series históricas de reportes e indicadores, antes hardcodeadas en las páginas).
- `domain/repositories`: `UserRepository`, `CostCenterRepository`, `ResponsibleRepository`, `ReportSeriesRepository`.
- `domain/rules`: `userRules` (filtro, nombre de usuario por defecto, validación), `machineryRules` (filtro/conteo por estado, disponibilidad), `alertRules` (separar leídas/no leídas), `reportRules` (inventario valorizado, reposición, consumo por centro de costo — extraída literalmente de `Reports.tsx`), `analyticsRules` (todos los KPIs de `Analytics.tsx`, extraídos literalmente).
- `application`: `GetUsers`, `CreateUser`, `UpdateUser` (validan y dejan auditoría), `GetCostCenters`, `GetResponsibles`, `GetReportSeries`.
- `infrastructure/repositories`: `DemoUserRepository`, `DemoCostCenterRepository`, `DemoResponsibleRepository`, `DemoReportSeriesRepository`.
- Hooks: `useUsers`, `useCostCenters`, `useResponsibles`, `useReportSeries`.
- `CatalogProvider` ahora también sirve `costCenters` y `responsibles`; `OperationsProvider` también sirve `users` y `reportSeries`.

## AppContext
Ya no gestiona usuarios (`ADD_USER`/`UPDATE_USER` y sus acciones desaparecieron). Solo queda: sesión, navegación y avisos. `data/demo.ts` ya solo tiene `DEMO_EVIDENCES` (offline drafts y evidencias no se usan en ninguna página; no se creó código para ellas).

## Código muerto eliminado
`RecordAuditEvent` (caso de uso de la Fase 3 que nada llegó a usar; `addUser`/`updateUser` registraban auditoría directamente). Duplicados de cálculo de disponibilidad de maquinaria y conteo por estado que existían tanto en `Dashboard.tsx` como en `Analytics.tsx` y `Machinery.tsx`, ahora unificados en `machineryRules`.

## Verificación (sin `pnpm build`, no disponible en el entorno)
- `tsc --strict` de domain/application/infrastructure/app: OK. Typecheck de las 162 páginas/hooks/providers con stubs: sin errores reales (solo limitaciones del arnés de pruebas: `recharts` no instalado y tipos de React incompletos en el stub).
- Equivalencia contra la lógica original sobre los datos demo: reporte de inventario (4 filtros de categoría), reposición, valorización total y por tipo, consumo por centro de costo, los 12 KPIs de Analytics, filtro/conteo de maquinaria por los 5 estados, disponibilidad, filtro de usuarios (12 combinaciones), nombre de usuario por defecto, separación de alertas leídas/no leídas: todo idéntico.
- Chromium, baseline vs. refactor: Machinery (lista, 3 filtros de estado), Alerts (lista, marcar todas como leídas), Reports (inventario, filtro de categoría), Analytics (KPIs), Users (lista, búsqueda), RolesPermissions, Parameters — 14 pasos, 0 diferencias, 0 errores de runtime.
- Regresión completa: escenarios de las Fases 1, 2, 3 y 4 siguen idénticos (verificados de nuevo tras esta fase, en 4 roles). Recorrido de todas las páginas del menú para admin (19), supervisor (18) y almacén (13): sin errores de runtime.
- Continuity, Integrations y Profile: no se tocaron (solo leen `currentUser`, que sigue en `AppContext`); verificado que siguen renderizando igual.

## Pendiente para la Fase 6
`AppContext` queda con: sesión, navegación, avisos y `canAccess` (RBAC). Falta mover físicamente `pages/` y `components/` a `presentation/` (movimiento de archivos, sin lógica), y decidir qué hacer con `offlineDrafts`/`evidences`, que ningún componente usa hoy.
