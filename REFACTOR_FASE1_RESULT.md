# SIGA Web — Refactor Clean Architecture · Fase 1 (Products, Categories, Units, Suppliers)

## Alcance
Solo lógica interna. No cambia JSX, clases, rutas, textos ni datos demo (verificado: los `DEMO_*` extraídos son idénticos por JSON).

## Capas nuevas
- `domain/entities`: `Product`, `Category`, `UnitOfMeasure`, `Supplier` (+ `NewX`, `SupplierDraft`).
- `domain/repositories`: `ProductRepository`, `CategoryRepository`, `UnitRepository`, `SupplierRepository`.
- `domain/rules`: `supplierRules` (validación RUC/correo/duplicados, código sugerido), `catalogRules`.
- `domain/errors`: `DomainError`, `ValidationError` (con `fields`), `NotFoundError`.
- `application/*`: `GetProducts`, `CreateProduct`, `UpdateProduct`, `GetCategories`, `CreateCategory`, `GetUnits`, `CreateUnit`, `GetSuppliers`, `CreateSupplier`, `UpdateSupplier`, `SetSupplierStatus`.
- `infrastructure/repositories`: `Demo{Product,Category,Unit,Supplier}Repository` (única capa que importa `data/demo/*` de catálogo; asigna ids y `createdAt`, y simula la latencia del prototipo).
- `app/compositionRoot.ts`: único punto que instancia repositorios concretos. Para pasar a API: reemplazar `Demo*` por `Api*` aquí.
- `presentation/state/CatalogContext.tsx` (estado compartido + carga inicial con `loading`/`error`) y hooks `useProducts`, `useCategories`, `useUnits`, `useSuppliers`.

## Dependencias eliminadas
`Products/Categories/Units/Suppliers → AppContext (datos y mutaciones)`, `→ data/demo`, `→ types/index.ts (entidades)`.

## Puente transitorio (se retira en Fase 6)
`AppProvider` compone `state.products/categories/units/suppliers` desde `CatalogProvider`, de modo que Inventory, Dashboards, Movements, etc. siguen leyendo `useApp().state` sin cambios hasta su fase. `types/index.ts` re-exporta las entidades del dominio por la misma razón.

## Diferencias observables (todas menores)
- Alta/edición de proveedor: la simulación de espera pasó a la infraestructura; el cambio de estado activo/inactivo espera 450 ms en vez de 400 ms.
- Categorías y Unidades ahora guardan de forma asíncrona (sin espera artificial).

## Pendiente de esta fase
- Mover físicamente `pages/` y `components/` a `presentation/` (se hará como movimiento puro de archivos en Fase 6 para no mezclar diff lógico con diff de rutas).
- `ProductRepository.delete` / `DeleteProduct`: no existen en la app actual; no se añadieron para no crear código muerto.
