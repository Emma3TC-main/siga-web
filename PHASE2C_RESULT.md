# SIGA Web — Phase 2C Result

## Resultado formal

`G4 = PASS`

- Baseline funcional: `SIGA-2A-dee89f97-8032f5c2`.
- Base técnica de origen: `SIGA_WEB_PHASE2B.zip`.
- Fingerprint de origen declarado: `SIGA-2B-432a9499-94600d6a`.
- SHA-256 del ZIP de origen: `69ecf79ee914aac3c0230a36039578a9339b51c8f728bf18da82b8daceec121d`.
- Fingerprint final: `SIGA-2C-b950c4cf-7f15effc`.
- Node de validación: `v22.23.2`.
- Playwright: `1.55.0`; Chromium Headless Shell `140.0.7339.16` (build 1187).

El fingerprint final combina el prefijo del hash agregado de los archivos del proyecto, excluyendo `node_modules`, `dist` y este documento de resultado (`b950c4cf…`), con el hash del registry (`7f15effc…`).

## Registry resultante

Se añadió `src/navigation/routeRegistry.ts`, con 34 registros descriptivos y lookup exacto. Cada entrada contiene, según aplica: path, aliases, componente actual, módulo/acción requerida, guard o ausencia, `renderable`, `reachable`, productores, roles, viewport, título, breadcrumbs, fallback y estado.

El registry no introduce URL/history, redirects, rutas, permisos ni reachability. Los aliases sólo documentan evidencia. El fallback desconocido conserva el Dashboard genérico y el valor de `activeRoute`.

## Orden de consumidores

| Incremento | Consumidor | Resultado |
|---|---|---|
| C0 | Registry pasivo | PASS |
| C1 | `App.tsx` | PASS |
| C2 | títulos/rutas de `Header` | PASS |
| C3 | `Sidebar` | PASS |
| C4 | dashboards por rol | PASS |
| C5 | consumidores de `actionRoute` en Header/Dashboard | PASS |
| C6 | breadcrumbs de páginas | PASS |
| C7 | productores de navegación de Inventory | PASS |

Los breadcrumbs de los dashboards quedaron locales porque la baseline usa `Inicio` para `RoleDashboard`/`WarehouseDashboard` y `Dashboard` para `SupervisorDashboard`. Unificarlos habría cambiado presentación observada.

## Archivos añadidos

- `src/navigation/routeRegistry.ts`
- `PHASE2C_RESULT.md`

## Archivos modificados

- `src/App.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/pages/admin/Parameters.tsx`
- `src/pages/admin/RolesPermissions.tsx`
- `src/pages/admin/Users.tsx`
- `src/pages/alerts/Alerts.tsx`
- `src/pages/analytics/Analytics.tsx`
- `src/pages/audit/Audit.tsx`
- `src/pages/authorizations/Authorizations.tsx`
- `src/pages/catalog/Categories.tsx`
- `src/pages/catalog/Products.tsx`
- `src/pages/catalog/Suppliers.tsx`
- `src/pages/catalog/Units.tsx`
- `src/pages/continuity/Continuity.tsx`
- `src/pages/dashboard/Dashboard.tsx`
- `src/pages/dashboard/RoleDashboard.tsx`
- `src/pages/dashboard/SupervisorDashboard.tsx`
- `src/pages/dashboard/WarehouseDashboard.tsx`
- `src/pages/integrations/Integrations.tsx`
- `src/pages/inventory/Inventory.tsx`
- `src/pages/locations/Locations.tsx`
- `src/pages/machinery/Machinery.tsx`
- `src/pages/movements/Entries.tsx`
- `src/pages/movements/MultiDetailMovement.tsx`
- `src/pages/movements/PhysicalCount.tsx`
- `src/pages/profile/Profile.tsx`
- `src/pages/reports/Reports.tsx`
- `src/pages/traceability/Traceability.tsx`

No se modificaron `MobileNav`, `AppContext`, datos demo, tipos, RBAC, configuración Vite, package ni lockfile.

## Regresión

Cada incremento ejecutó la suite live de 26 escenarios: 23 `PASS`, 3 `BASELINE/FIX-LATER`, 0 fallos. Las clasificaciones e IDs son idénticos entre C0 y C7. Se verificaron login/logout, cinco roles, dashboard por rol, ruta permitida, 403, fallback, aliases, desconectadas, responsive `< md`/`md+`, movimientos, MFA, feedback, modales y ErrorBoundary.

Build final y preview real pasaron bajo Node 22. El preview comprobó HTTP 200, login/dashboard, navegación a Inventory y viewport móvil.

## Anomalías preservadas

- Usuario inactivo no alcanzable desde las credenciales demo.
- Integrations y Continuity continúan renderizables y desconectadas.
- Ruta desconocida continúa en Dashboard genérico sin normalizar `activeRoute`.
- `/movimientos/conteo` y `/movimientos/conteos` conservan su asimetría.
- `/historial` y `/trazabilidad` conservan strings y títulos observados; no son redirects.
- Alerts/Profile siguen sin guard explícito.
- Continúa la ausencia de URL/history/deep-link.

## Diferencias respecto a 2B

Sólo se centralizó metadata/navegación ya existente. No se amplió reachability, no se restringió acceso, no se alteró RBAC, estado, modelos, datos, Movement, Stock, Authorization o Mobile.

El rebuild de la fuente 2B y los builds 2C incluyen la utilidad CSS `.inline` detectada por Tailwind en `PHASE2B_RESULT.md`; el `dist` almacenado dentro del ZIP 2B fue generado antes de añadir ese documento. Esta diferencia reproducible pertenece al estado fuente/build de 2B, no al registry ni a una conducta UI de 2C.

## Rollback

Cada consumidor se revierte restaurando únicamente sus archivos desde `SIGA_WEB_PHASE2B.zip`, en orden inverso C7→C1. Tras revertir todos los consumidores, se elimina `src/navigation/routeRegistry.ts` para volver a C0/2B. No se requiere revertir package, lockfile, Vite, datos ni estado.

## Confirmación de alcance

No se instaló ni configuró React Router, no se eliminó `activeRoute`, no se inició 2D, no se dividió `AppContext`, no se reorganizaron features, no se modificó Mobile y no se implementó backend/API.
