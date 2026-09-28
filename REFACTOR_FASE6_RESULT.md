# SIGA Web — Refactor Clean Architecture · Fase 6 (Auth, RBAC, AppContext, routing, estado compartido)

## Alcance
Última fase del plan. Cierra la arquitectura objetivo: mueve `pages/` y `components/` a `presentation/`, extrae el RBAC (`ROLE_PERMISSIONS`/`canAccess`) del reducer a una regla de dominio, reduce `AppContext` a lo mínimo y confirma qué queda pendiente de forma consciente (`offlineDrafts`, `evidences`, `systemConfig`).

## Movimiento de archivos (sin cambios de lógica)
- `src/pages/**` → `src/presentation/pages/**`
- `src/components/**` → `src/presentation/components/**`
- `src/store/AppContext.tsx` → `src/presentation/state/AppContext.tsx` (junto a `CatalogContext` y `OperationsContext`, ya creados en fases anteriores)
- `src/navigation/routeRegistry.ts` → `src/presentation/navigation/routeRegistry.ts`

`App.tsx` y `main.tsx` quedan en `src/` (entradas de la aplicación), consistente con la convención de Vite; no se movieron a `app/` para no generar más churn del pedido.

Corregir los ~170 imports relativos afectados por el movimiento fue automático (script de reescritura), pero en la primera pasada quedaron mal 25 archivos que ya importaban hooks/estado con una ruta que incluía el segmento `presentation/` de forma explícita (porque en fases previas `presentation/hooks` y `presentation/state` ya existían junto a `pages/` en la raíz de `src/`); al mover `pages/`/`components/` adentro de `presentation/`, esas rutas quedaron duplicadas (`presentation/pages/foo/Bar.tsx` importando `'../../presentation/hooks/x'` en vez de `'../../hooks/x'`). Se corrigió con un segundo pase y se verificó con `tsc` que no quedara ninguna.

## RBAC
- `ROLE_PERMISSIONS` (la matriz rol → módulo → acciones) se movió de `types/index.ts` a `domain/rules/permissionRules.ts`, con dos funciones puras: `hasPermission(role, module, action='view')` y `hasAnyPermission(role, module)` (para el Sidebar, que solo necesita saber si el rol tiene *alguna* acción sobre el módulo, no una acción concreta).
- `AppContext.canAccess` ahora delega en `hasPermission`, en vez de indexar `ROLE_PERMISSIONS` a mano.
- Seis lugares que reimplementaban el mismo chequeo a mano (`Sidebar`, `Products`, `Suppliers`, `Authorizations`, `Users`, y el propio `AppContext`) ahora llaman a la misma función. `Profile.tsx` y `RolesPermissions.tsx`, que necesitan la matriz completa (no un booleano), siguen leyendo `ROLE_PERMISSIONS` pero desde `domain/rules/permissionRules`, no desde `types`.
- No se creó una interfaz `PermissionChecker`/clase de servicio: los datos de permisos son estáticos (no hay "demo vs. API" que alternar, a diferencia de productos o proveedores), así que una función pura es la abstracción correcta sin sobre-ingeniería (§22 del prompt). Cuando exista backend, este es el único punto a mover: validar `hasPermission` también del lado del servidor.

## AppContext
Quedó en 128 líneas (originalmente ~415). Solo gestiona: sesión (`login`/`logout`), navegación, `sidebarCollapsed`/`mobileView`/`networkOnline`, avisos (`showToast`) y `canAccess`. Todo lo demás (catálogo, operación del almacén, usuarios) vive en `CatalogProvider`/`OperationsProvider` desde las fases 1-5; `AppContext` solo los compone en `state` para los consumidores que aún leen `useApp().state` (patrón puente, ya usado en fases anteriores).

## Decisión consciente: `offlineDrafts`, `evidences`, `systemConfig`
Ninguna página ni componente lee estos tres campos de `AppState` (verificado por búsqueda exhaustiva). No se eliminaron: quitarlos sería una decisión de producto (¿se van a implementar?), no de arquitectura, y el prompt pide no eliminar funcionalidad ni inventar cambios no pedidos. Quedan documentados aquí como "código muerto conocido" para que decidas si se implementan o se retiran en una fase futura.

## Verificación (sin `pnpm build`, no disponible en el entorno)
- `tsc --strict` de domain/application/infrastructure/app: OK.
- Equivalencia de `hasPermission`/`hasAnyPermission` contra `ROLE_PERMISSIONS` original: 5 roles × 18 módulos × 7 acciones, todas idénticas.
- Typecheck de las 169 páginas/hooks/componentes tras el movimiento: sin errores reales. (El arnés de pruebas por sí solo genera ruido esperado: `recharts` no está instalado en este entorno, y el stub mínimo de React no cubre `Component`/`ErrorInfo`/`ComponentType`; ambos son limitaciones del arnés, ya presentes en la baseline antes de cualquier cambio mío, no del código.)
- Bundle real con esbuild de todo el grafo de imports: resuelve.
- Capas: el dominio no importa nada externo; la aplicación no importa presentación/infraestructura/React (fuera de los providers `catalog`/`operations`, que es su rol); nadie fuera de `infrastructure/` y del puente de `AppContext` (para `evidences`) importa `data/demo`.
- Chromium, baseline vs. refactor: escenario completo de la Fase 1 (Products/Categories/Units/Suppliers) byte a byte idéntico; Fase 2 en 4 roles idéntica; flujo de Movements con autorización sensible y MFA (Fase 3) idéntico; Trazabilidad/Auditoría (Fase 4) idéntico; Machinery/Reports/Analytics/Alerts/Users (Fase 5) idéntico; recorrido de todo el menú para admin (19 páginas), supervisor (18) y almacén (13) sin errores de runtime; página de Roles y Permisos con su matriz completa renderizada (3360 caracteres) verificada idéntica, ejercitando directamente el nuevo `domain/rules/permissionRules.ts`.

## Estado final de la arquitectura
```
src/
├── app/            (compositionRoot.ts — único lugar que instancia repositorios concretos)
├── domain/         (entities, repositories, rules, errors, services)
├── application/    (casos de uso, uno por operación)
├── infrastructure/ (repositorios Demo*, listos para sustituir por Api* sin tocar páginas)
├── presentation/
│   ├── pages/       (antes src/pages/)
│   ├── components/  (antes src/components/)
│   ├── navigation/  (antes src/navigation/)
│   ├── hooks/       (creados en fases 1-5)
│   └── state/       (AppContext, CatalogContext, OperationsContext)
├── shared/          (getErrorMessage)
├── data/demo/       (solo lo importa infrastructure/, y AppContext para evidences)
└── types/           (re-exporta entidades de domain/ para las migraciones progresivas; puede seguir reduciéndose si se desea)
```
Con esto se cierran las 6 fases del plan de refactorización. `DemoProductRepository`, `DemoSupplierRepository`, etc. pueden sustituirse por `ApiProductRepository`, etc. en `app/compositionRoot.ts` sin tocar ninguna página.
