# SIGA Web — Refactor Clean Architecture · Fase 2 (Inventory, Locations)

## Cambios
- **Locations** (`Location`): entidad en `domain/entities`, `LocationRepository` (solo `getAll`; la app no crea ni edita ubicaciones), `GetLocations`, `DemoLocationRepository`, `data/demo/locations.ts`, hook `useLocations`. El estado vive en `CatalogProvider` (ahora "datos maestros") y `AppProvider` sigue componiendo `state.locations` para los consumidores sin migrar.
- **Inventory**: la lógica salió de las páginas a `domain/rules/inventoryRules.ts` (`getInventoryStatus`, `daysUntilExpiry`, `EXPIRY_WARNING_DAYS`, `sumQuantity`, `nearestExpiryEntry`, `buildInventoryRows`, `filterInventoryRows`, `getLocationDescendantIds`). Hook `useInventory` (filas, stock de un producto, movimientos de un producto).
- `StockEntry` movida a `domain/entities/Stock.ts` (re-exportada desde `types/index.ts`).
- Umbral de 60 días duplicado en Inventory (estado y tabla de lotes) unificado en `EXPIRY_WARNING_DAYS`.
- Imports sin uso eliminados en `Inventory.tsx` y `Locations.tsx`.

## Decisión: stock y movimientos siguen en AppContext hasta la Fase 3
El stock lo modifica el reducer al confirmar movimientos (`applyConfirmedMovement`). Crear ahora un `StockRepository` duplicaría la fuente de verdad o obligaría a migrar Movements a la vez. `useInventory` lee `stock`/`movements` de `useApp()` como dependencia temporal documentada; `StockRepository` y `MovementRepository` se crean juntos en la Fase 3.

## Verificación (sin `pnpm build`, no disponible en el entorno)
- `tsc --strict` de domain/application/infrastructure/app: OK. Typecheck con stubs de páginas, hooks y AppContext: sin errores reales.
- Equivalencia con la lógica original sobre los datos demo: 55 filas de inventario, 7 combinaciones de filtros y descendientes de las 18 ubicaciones: idénticos.
- Chromium, baseline vs. refactor, 4 roles (admin, almacén, supervisor, usuario), 20 snapshots de texto por rol (Inventario: búsqueda, filtros, paginación, detalle y pestañas; Ubicaciones: árbol y detalle): 0 diferencias, 0 errores de runtime. Escenario de la Fase 1: idéntico.
