# SIGA WEB — BACKEND INTEGRATION HANDOFF

Este documento refleja el estado final de integración tras las sesiones AGY y sirve como punto de partida para la próxima iteración.

## Current Architecture

La integración mantiene una arquitectura limpia en capas:
`Presentation` → `Application` → `Domain Port` → `Infrastructure Adapter`

La selección de entornos (`DEMO` o `REMOTE`) se realiza de manera explícita y unificada en:
`src/app/compositionRoot.ts`

**No existe fallback silencioso de REMOTE a DEMO**. Si un adaptador remoto falla, lanza un error tipado capturado por la capa de presentación.

---

## Remote Integrations

Las siguientes entidades están conectadas productivamente a backend:

### Catalog
- **Products**: READ / WRITE remoto implementado.
- **Categories**: READ REMOTE. CREATE REMOTE implementado.
- **Units**: READ REMOTE. CREATE REMOTE implementado.
- **Suppliers**: READ REMOTE.

### Identity
- **Auth Foundation**: Completamente en REMOTE (`ApiAuthRepository`).
- **Endpoints**: Login y Logout remotos.
- **Bearer Propagation**: Implementado globalmente en `ApiClient`.
- **Refresh**: Flujo remoto.

### Inventory
- **Stock**: READ REMOTE activo.
- **Movements**:
  - `LIST`: REMOTE (workaround `page=0&size=100`).
  - `DETAIL`: REMOTE.
  - `CREATE`: REMOTE para los cinco tipos visibles cuando el producto no requiere lote ni activo. Las ubicaciones y unidades son canónicas. Integrado de forma canónica Lots y Assets, permitiendo productos trazables.
  - `SUBMIT`: REMOTE (Estado final y sensibilidad definidos exclusivamente por backend).
  - `AUTHORIZE`: BLOCKED_BY_MFA antes de cualquier mutación local o request remoto.
  - `REJECT`: BLOCKED_BY_MFA antes de cualquier mutación local o request remoto; CUS-27 y el controller vigente exigen step-up reciente para ambas decisiones.
  - `CANCEL`: REMOTE.
  - `CONFIRM`: REMOTE (Con `Idempotency-Key` estable).

---

## Demo / Blocked Integrations

- **Locations**: `BACKEND_LOCATION_MASTER_DATA_GAP`: RESOLVED. Endpoint `/api/v1/locations` implementado y conectado a `ApiLocationRepository` en REMOTE.
- **CostCenters**: `BACKEND_IMPLEMENTATION_GAP`; REMOTE omite el dato opcional para no persistir códigos DEMO.
- **Responsibles**: `BACKEND_IMPLEMENTATION_GAP`, no bloqueante en el contrato vigente porque `requestedByUserId` es opcional; Web lo omite cuando no existe una fuente canónica.
- **Alerts**: Fuera del scope (DEMO).
- **Audit**: Fuera del scope (DEMO).
- **Reporting**: Fuera del scope (DEMO).

---

## Technical Debt / Deferred Decisions

### TD-01 — Inventory pagination
La Web espera arrays completos, mientras que el backend usa paginación (`InventoryPage`).
**Mitigación actual**: El adaptador remoto intercepta con `?page=0&size=100` tanto en Stock como en Movements (`WEB_MOVEMENT_PAGINATION_DEBT`).

### TD-02 — Category/Unit create response
**Clasificación**: `BACKEND_WRITE_RESPONSE_GAP`.

### TD-03 — MFA
**Clasificación**: `AUTH_MFA_PENDING`, bloqueando la autorización y rechazo (`AUTHORIZE_REMOTE_BLOCKED_BY_MFA`).

### RESOLVED_BACKEND_GAP — Movement API
Backend expuso la API completa de Movements (GET, POST), y la Web ya no simula operaciones localmente en REMOTE.

### TD-05 — Canonical Master Data Gaps
**Clasificación**: `BACKEND_IMPLEMENTATION_GAP`.
ENTRY, EXIT, TRANSFER, ADJUST_POSITIVE y ADJUST_NEGATIVE requieren al menos una ubicación canónica y un código de unidad real.
Los UUID de unidad se resuelven por coincidencia exacta mediante `ApiUnitRepository`; solo el `Unit.code` canónico se envía como `unitCode`. Una unidad inexistente o sin código bloquea la operación antes del `POST`, sin fallback a símbolo, UUID o dato DEMO. Los IDs de Locations `loc*` de DEMO tampoco se convierten ni se sustituyen por UUID inventados.

**Canonical Master Data Matrix:**

| Master Data | Web current source | Current ID shape | Backend source | Backend ID shape | API exists | Needed by |
|---|---|---|---|---|---|---|
| Locations | ApiLocationRepository | UUID | Inventory `/api/v1/locations` | UUID | YES | All movements |
| Units | ApiUnitRepository | UUID plus canonical `code` | Catalog `/units` | UUID plus string `code` | YES | All movements |
| Responsibles| DemoResponsibleRepository (solo UI heredada) | resp-1, resp-2 | No canonical runtime endpoint identified | UUID | NO | Optional; REMOTE omite `requestedByUserId` |
| Lots | ApiLotRepository | UUID | Inventory `/api/v1/lots` | UUID | YES | Traceable products |
| Assets | ApiAssetRepository | UUID | Inventory `/api/v1/assets` | UUID | YES | Serialized products |

**Movement Create Matrix:**

| Movement Type | Location | Other blockers | Status |
|---|---|---|---|
| ENTRY | RESOLVED | NONE | READY |
| EXIT | RESOLVED | NONE | READY |
| TRANSFER | RESOLVED | NONE | READY |
| ADJUST_POSITIVE | RESOLVED | NONE | READY |
| ADJUST_NEGATIVE | RESOLVED | NONE | READY |

### NON_BLOCKING_STRUCTURED_404_DEBT
Algunos 404 se convierten en NotFoundError perdiendo Problem Details estructurados para commands.

---

## Último Estado de Validación

- **TypeScript**: PASS (`pnpm tsc --noEmit` completado sin errores).
- **Build**: PASS.
- **E2E**: NOT EXECUTED.
- **Backend Integration**: NOT EXECUTED_BY_AGY_SCOPE.

---

## Repository Safety

Durante todos los slices AGY, se respetó estrictamente la barrera técnica:
`siga-web modified: YES`
Ningún otro repositorio de la suite SIGA sufrió modificaciones.
