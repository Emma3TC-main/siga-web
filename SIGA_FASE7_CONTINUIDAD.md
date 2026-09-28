# SIGA Web — Fase 7: Punto de continuidad

> **Nota de organización**: este documento se llamó `CONTINUIDAD_FASE7.md` hasta la Fase 8, donde el propio encargo de Fase 8 pidió renombrarlo a `SIGA_FASE7_CONTINUIDAD.md` (para que ambas fases usen el mismo patrón de nombre: `SIGA_FASE<N>_CONTINUIDAD.md`). Es el mismo archivo, con todo su historial intacto; no se creó ningún duplicado. El documento de continuidad de la fase en curso es `SIGA_FASE8_CONTINUIDAD.md`.

## Estado actual

- **Fase 7**: en curso.
- **Bloque 1 (Autorizaciones)**: ✅ completo (sesiones anteriores).
- **Bloque 2 (Componentización)**: ✅ **COMPLETO**. Las 9 páginas grandes candidatas están divididas (ver resumen más abajo).
- **Bloque 3 (Modales)**: ✅ **COMPLETO**. Los 8 modales de detalle reales del sistema fueron adaptados a la "nueva filosofía": `AuthorizationDetailModal.tsx` (ya lo tenía, origen del patrón), `PhysicalCountDetailModal.tsx`, `SupplierDetailModal.tsx`, `catalog/products/ProductDetailModal.tsx`, `movements/entries/EntryDetailModal.tsx`, `movements/multi-detail/MovementDetailModal.tsx`, el modal inline de `machinery/Machinery.tsx`, el modal de perfil inline de `admin/Users.tsx`, y `inventory/ProductDetailModal.tsx` (el de 4 tabs). Queda abierta solo la decisión de alcance sobre el panel inline (no modal) de `locations/Locations.tsx` — ver nota en "Modales — estado de Bloque 3".
- **Bloque 4 (Refinamiento visual integral)**: ✅ **COMPLETADO**. Los 5 grupos (Grupo 1: layout global; Grupo 2: Dashboard + Catálogo; Grupo 3: Inventario, Movimientos, Ubicaciones, Maquinaria; Grupo 4: Autorizaciones, Alertas, Usuarios, Roles y permisos, Parámetros; Grupo 5: Reportes, Trazabilidad, Analytics, Continuidad, Perfil, Integraciones) fueron revisados y ajustados. Verificación final de conjunto ejecutada esta sesión (ver "Verificación final del Bloque 4" más abajo): sintaxis limpia en los 243 archivos fuente del proyecto y grafo de imports completo del bundle sin errores. **No se pudo ejecutar `pnpm build` real** (sigue sin haber red en ningún entorno de Fase 7) — queda como única verificación pendiente si en el futuro hay red disponible.
- **Fase 7**: con el Bloque 4 completado, los 4 bloques previstos (Autorizaciones, Componentización, Modales, Refinamiento visual) quedan cerrados a nivel de trabajo de esta serie de sesiones. Queda pendiente, si se dispone de red en algún momento, correr `pnpm install --frozen-lockfile && pnpm build` como cierre formal — ver "Pendiente real (no resuelto por falta de entorno)" al final de este documento.
- **Decisión de arquitectura de esta sesión**: se extrajeron los helpers `DetailHeader`, `DetailSection` y `DetailField` a `presentation/components/ui/index.tsx` (sección nueva "DETAIL VIEW"), en vez de seguir duplicando localmente el patrón `Field`/`Section` que `AuthorizationDetailModal.tsx` ya usaba. Se justifica porque el mismo patrón se repetirá en los ~13 modales de Bloque 3 — es exactamente el caso de "patrón repetido" que justifica extraer un componente, según las restricciones del proyecto. `AuthorizationDetailModal.tsx` **no se tocó**: mantiene su propio `Field`/`Section` local (visualmente idéntico), ya estaba verificado de una sesión anterior y no había necesidad de re-tocarlo. Si se quiere unificarlo también a los helpers compartidos, es un cambio puramente cosmético/interno que puede hacerse en cualquier momento futuro sin riesgo.

## Trabajo realizado esta sesión

### 1. Componentes compartidos nuevos en `presentation/components/ui/index.tsx`
Sección `// ─── DETAIL VIEW (Fase 7, Bloque 3 — "nueva filosofía" de modales de detalle) ──`, insertada justo después de `Modal`:
- `DetailHeader({ eyebrow, title, badges })`: bloque de encabezado `bg-[#093C5D]/3 rounded-lg` con id/código en mono pequeño (`eyebrow`), título en negrita, y badges de estado a la derecha.
- `DetailSection({ title, children })`: título uppercase pequeño gris (`text-xs font-semibold text-gray-400 uppercase tracking-wide`) + contenido.
- `DetailField({ label, value, className })`: tarjeta `bg-gray-50 rounded-lg p-3` con label pequeño gris arriba y valor en negrita `text-[#093C5D]` abajo. Acepta `className` para spans de grid (`col-span-2`, etc.).

Estos tres son el patrón visual que ya existía (idéntico) en `AuthorizationDetailModal.tsx`, ahora reutilizable.

### 2. `PhysicalCountDetailModal.tsx` — adaptado
- Se agregó encabezado (`DetailHeader`) con: `eyebrow` = id del conteo, `title` = nombre del conteo, badges = IRA (`success`/`warning` según ≥95%) + estado (`Borrador`/`En progreso`/`Completado`).
- Sección "Información general" (nueva): ubicación, supervisor (antes no se mostraban en el modal, solo en la card de historial — ahora también en el detalle), fecha de creación, fecha de finalización.
- Sección "Resultados": el grid de 3 KPIs que ya existía (ítems contados / exactos / con diferencia), sin cambios de lógica.
- Sección "Ítems del conteo (n)": la tabla de ítems que ya existía, sin cambios de lógica ni de columnas.
- **Cambio de props**: el modal ahora recibe también `locations: Location[]` y `users: User[]` (antes solo `products`, `units`). Se actualizó la única llamada, en `movements/PhysicalCount.tsx`, para pasarlos (ambos ya estaban disponibles en el compositor vía `useLocations()`/`useUsers()`, no se agregó ningún hook nuevo).
- Ningún campo de datos ni cálculo (`calcIra`, `aggregateCountStats`) se modificó.

### 3. `SupplierDetailModal.tsx` — adaptado
- Encabezado (`DetailHeader`) con: `eyebrow` = código de proveedor, `title` = razón social (igual que el título del `Modal`, sin cambiarlo), badge de estado (Activo/Inactivo) movido del grid al encabezado.
- Sección "Información general": Razón social, Nombre comercial, RUC, Registrado, Dirección — todos los campos que ya estaban en el grid original, solo reorganizados en `DetailField`.
- Sección "Contacto" (nueva, separa del resto): Contacto, Teléfono, Correo.
- Sección "Recepciones registradas (n)" (antes sin envolver en el patrón de sección): sin cambios de lógica, mismo filtro `movements.filter(...)`.
- Fila de acciones (Editar / Activar-Desactivar / Cerrar) intacta, misma lógica, mismos `onClick`.
- **Sin cambios de props**: mismo `SupplierDetailModalProps`, por lo que `catalog/Suppliers.tsx` no necesitó ningún cambio.
- Todos los campos del modal original están presentes (se verificó explícitamente para no perder "Nombre comercial", que casi se omite al reorganizar — quedó documentado como recordatorio para las próximas adaptaciones: al mover campos a `DetailField`, revisar campo por campo contra el original antes de dar por cerrada la adaptación).

### Verificación (mismo método de 4 pasos que Bloque 2)
Entorno sin red/`node_modules` (mismo `403 Forbidden` de sesiones previas; no se reintentó `npm install`).

1. **Sintaxis real** de los 4 archivos tocados (`ui/index.tsx`, `PhysicalCountDetailModal.tsx`, `PhysicalCount.tsx`, `SupplierDetailModal.tsx`) con `esbuild.transformSync` — sin errores.
2. **Validación de cada `import type` nuevo** (`Location`, `User` en `PhysicalCountDetailModal.tsx`) contra el export real de `domain/entities/Location.ts` y `domain/entities/User.ts` — correctos, sin bugs esta vez.
3. **Grafo de imports completo** con `esbuild.build({ bundle: true, entryPoints: ['src/main.tsx'] })`, alias `@`, CSS stubeado, externalizando `react`/`react-dom`/`react-router-dom`/`recharts` — resuelve sin errores (605 KB de bundle, sin fallos de resolución).
4. **Sin imports muertos**: se contó cada nombre importado en los 2 modales tocados — todos aparecen ≥2 veces (import + al menos un uso).
5. No aplica (no se creó ningún hook).
6. **Revisión manual campo por campo** contra la versión anterior de cada modal:
   - `PhysicalCountDetailModal.tsx`: se confirmó que el condicional `!!detail` sigue igual, que las 3 KPIs muestran los mismos valores/colores que antes, y que la tabla de ítems (teórico/contado/diferencia/resultado, con los mismos umbrales de color y badges Exacto/Sobrante/Faltante) no cambió.
   - `SupplierDetailModal.tsx`: se listaron los 10 campos del grid original (Código, RUC, Razón social, Nombre comercial, Contacto, Teléfono, Correo, Dirección, Registrado, Estado) y se confirmó que los 10 siguen presentes (Código y Estado ahora en el encabezado, los otros 8 en dos secciones). Se confirmó que `receipts` usa el mismo filtro y que los 3 botones de acción tienen las mismas condiciones (`canEdit`) y handlers.

**No se pudo verificar**: `tsc --strict` completo, por falta de red (igual que en todas las sesiones de Fase 7). Si hay red disponible en una futura sesión: `pnpm install --frozen-lockfile && pnpm build`.

## Sesión: continuación de Bloque 3 (3 modales adicionales)

Entorno sin red/`node_modules` otra vez (mismo `403 Forbidden` al intentar `npm install esbuild`). Se usó el `esbuild` empaquetado dentro de `tsx` (ya presente globalmente en el entorno de la sesión) para la verificación, en vez de instalarlo.

### 4. `catalog/products/ProductDetailModal.tsx` — adaptado
- Encabezado (`DetailHeader`) con: `eyebrow` = SKU, `title` = nombre del producto, badge de estado (Activo/Inactivo) movido del grid al encabezado.
- Sección "Información general": SKU, Tipo, Categoría, Unidad, Costo promedio, Estado (Estado se repite también aquí, igual que en el grid original — no se quitó ningún dato, solo se agregó el badge en el encabezado como redundancia visual, consistente con lo hecho en `SupplierDetailModal.tsx` con el nombre).
- Sección "Stock" (nueva, separa del resto): Stock total, Stock mínimo, Punto de reorden — antes mezclados en el mismo grid de 9 campos.
- Badges de flags (Movimiento sensible/Requiere lote/Requiere serie/Requiere vencimiento/Requiere colada): sin cambios, mismas condiciones y mismos `variant` (`warning` para sensible, `info` para el resto).
- Descripción: ahora envuelta en `DetailSection title="Descripción"` en vez de un `div` suelto; mismo texto, mismo `product.description &&`.
- **Sin cambios de props** (`ProductDetailModalProps` idéntico) → `catalog/Products.tsx` no necesitó ningún cambio.

### 5. `movements/entries/EntryDetailModal.tsx` — adaptado
- Encabezado (`DetailHeader`) con: `eyebrow` = `movement.id`, `title` = `${documentType} ${documentNumber}`, badges = `MovementStatusBadge` + `Badge` de versión (antes texto suelto `Versión N`, ahora un `Badge variant="muted"` con el mismo texto).
- Bloque "Proveedor externo": se mantuvo el diseño con ícono (no es el patrón repetido de `DetailField`, es un bloque de un solo uso — no se tocó su estructura interna), pero se envolvió en `DetailSection title="Proveedor externo"` y se quitó el `<div>` de título duplicado que ya tenía la misma clase (`text-xs font-semibold text-gray-400 uppercase tracking-wide`) para no repetirlo dos veces. Mismos datos (`name`/`code`/`ruc`, misma resolución `snapshot ?? live ?? '—'`).
- Tabla de líneas: sin cambios de columnas ni de lógica (`movementLines(movement)`), envuelta en `DetailSection title="Líneas del movimiento (n)"` (antes sin título).
- Tracker de progreso (`PROGRESS_STATUSES`): sin cambios de lógica (`progressIndex`), envuelto en `DetailSection title="Progreso"` (antes sin título).
- **Sin cambios de props** (`EntryDetailModalProps` idéntico, mismos hooks `useProducts`/`useLocations`/`useUnits`/`useSuppliers`).

### 6. `movements/multi-detail/MovementDetailModal.tsx` — adaptado
- Encabezado (`DetailHeader`) con: `eyebrow` = `movement.id`, `title` = `${documentType} ${documentNumber}` (antes el `documentType`/`documentNumber` solo aparecía dentro del banner de auditoría, no en el header — ahora también en el título, sin quitarlo del banner), badges = `MovementStatusBadge` + `Badge` de ítems (ya existía) + `Badge` de versión (antes texto suelto, ahora `Badge variant="muted"`, igual que en `EntryDetailModal.tsx`).
- Tabla de líneas: sin cambios de columnas ni de lógica, envuelta en `DetailSection title="Líneas del movimiento (n)"` (antes sin título).
- Banner de auditoría (`bg-blue-50 border-blue-200`): **no se tocó** — es una nota de un solo uso con estilo de alerta, no el patrón repetido de campos; envolverlo en `DetailSection` le habría quitado su identidad visual de "nota". Mismo texto, misma lógica (`state.users.find(...)`).
- **Sin cambios de props** (`MovementDetailModalProps` idéntico, mismos hooks).

### Verificación (mismo método, adaptado a la disponibilidad del entorno)
1. **Sintaxis real** de los 3 archivos con `esbuild.transformSync` (usando el `esbuild` de `tsx`, global en el entorno) — sin errores.
2. No aplica (no se agregó ningún `import type` nuevo en esta tanda — todas las entidades usadas ya se importaban antes).
3. **Grafo de imports completo** con `esbuild.build({ bundle: true, entryPoints: ['src/main.tsx'] })`, mismo alias `@`, CSS stubeado, mismos externals — resuelve sin errores (679 KB de bundle, sin fallos de resolución).
4. **Sin imports muertos**: se contó cada nombre importado de `presentation/components/ui` en los 3 modales tocados — todos aparecen ≥2 veces.
5. No aplica (no se creó ningún hook nuevo).
6. **Revisión manual campo por campo** contra la versión anterior de cada modal:
   - `ProductDetailModal.tsx`: se listaron los 9 campos del grid original (SKU, Tipo, Categoría, Unidad, Costo promedio, Stock total, Stock mínimo, Punto de reorden, Estado) + 5 flags + descripción — los 15 siguen presentes (verificado con `grep -c`), solo reorganizados en dos secciones ("Información general" y "Stock").
   - `EntryDetailModal.tsx`: se confirmó que `movement.status`, `movement.version`, `movement.documentType/documentNumber`, el bloque de proveedor externo (`isExternalReceipt`/`supplierId`/`supplierSnapshot`), la tabla completa (6 columnas) y el tracker de 4 estados con sus mismas fechas (`createdAt`/`confirmedAt`) siguen presentes sin cambios de lógica.
   - `MovementDetailModal.tsx`: se confirmó que el badge de ítems, la tabla completa (6 columnas, incluye origen y destino a diferencia de `EntryDetailModal`), y el banner de auditoría con `registeredBy` y `correlationId` siguen presentes sin cambios de lógica.

**No se pudo verificar**: `tsc --strict` completo (mismo motivo de red que en todas las sesiones de Fase 7). El `esbuild` de `tsx` no chequea tipos, solo sintaxis y resolución de módulos.

## Sesión: revisión de Categories/Units/Locations/Machinery/Alerts + admin/Users

Se investigó el pendiente que había quedado abierto ("revisar si existen como modal de detalle separado o están dentro de páginas no componentizadas"). Hallazgos:

- **`catalog/Categories.tsx`** y **`catalog/Units.tsx`**: no tienen vista de detalle. Solo tienen un `Modal` de creación (formulario). Fuera de alcance de Bloque 3 (igual que otros formularios ya listados).
- **`locations/Locations.tsx`**: tiene un panel de detalle (al seleccionar una ubicación se muestra info + stock), pero **no es un `Modal`** — es un panel inline en la misma página (columna derecha). Como Bloque 3 es específicamente sobre *modales* de detalle, se dejó sin tocar; convertirlo o no al patrón `DetailHeader`/`DetailSection`/`DetailField` sería ampliar el alcance del bloque a paneles inline, lo cual no estaba decidido. **No tocado — pendiente de decisión explícita si se quiere ampliar el alcance.**
- **`alerts/Alerts.tsx`**: no tiene ningún `Modal` ni vista de detalle (solo listado). Nada que adaptar.
- **`machinery/Machinery.tsx`**: **sí tenía un modal de detalle real**, inline dentro de la página (no en un archivo `*DetailModal.tsx` separado, por eso no apareció en la búsqueda inicial por nombre de archivo). Adaptado esta sesión (ver abajo).
- **`admin/Users.tsx`**: el modal de "Perfil" que ya existía (mencionado como pendiente de revisión de consistencia en la nota de Bloque 2) también es un modal de detalle real. Adaptado esta sesión (ver abajo).

### 7. `machinery/Machinery.tsx` — modal de detalle inline adaptado
- Encabezado (`DetailHeader`) con: `eyebrow` = `assetCode`, `title` = nombre del activo, badge = `MachineryStatusBadge` (antes el badge estaba suelto al lado del grid, ahora en el encabezado).
- Sección "Información general": los 9 campos originales (VIN/PIN completo, Código de activo, Horómetro, Marca, Modelo, Ubicación, Valor del activo, SKU, Mov. sensible) migrados a `DetailField`, preservando el `font-mono` en VIN/PIN y SKU (se pasó como `value` con un `<span className="font-mono">` interno para no perder ese detalle visual).
- Sección "Historial de movimientos (n)": la tabla de movimientos (7 columnas), sin cambios de lógica ni de columnas, ahora con título y contador (antes solo un `<h4>` suelto sin contador).
- **Sin cambios de props ni de estado**: sigue siendo el mismo `Modal` inline en `Machinery.tsx`, no se extrajo a un archivo separado (no había necesidad — el resto de la página no se tocó, y extraerlo sería sobrecomponentizar sin necesidad).

### 8. `admin/Users.tsx` — modal de "Perfil" inline adaptado
- El bloque de encabezado con avatar (círculo con iniciales + nombre + correo + badge de rol) **no se tocó**: no encaja en la forma `eyebrow`/`title`/`badges` de `DetailHeader` sin perder el avatar, que es parte de la identidad visual de este modal en particular (es el único con avatar). Cambiar esto habría requerido modificar `DetailHeader` para un caso de un solo uso, lo cual va contra la restricción de no sobrecomponentizar.
- Sección "Información de la cuenta" (nueva, con título): los 6 campos originales (ID de usuario, Username, Alcance, Estado, Creado, Último acceso) migrados a `DetailField`, sin cambios de datos.
- Sección "Permisos del rol": mismo contenido (chips de `módulo: acciones` por rol), ahora con `DetailSection` en vez de un label gris suelto — se quitó el label duplicado (`text-xs text-gray-400 mb-2`) porque `DetailSection` ya provee ese estilo de título.
- **Sin cambios de props ni de lógica**: mismo `ROLE_PERMISSIONS`, mismo `ROLE_LABELS`/`ROLE_COLORS`, mismo modal de creación/edición (no tocado).

### Verificación (sesión de Categories/Units/Locations/Machinery/Alerts/Users)
Mismo entorno sin red (`npm install` sigue en `403`); se usó otra vez el `esbuild` empaquetado con `tsx`.

1. **Sintaxis real** de `Machinery.tsx` y `admin/Users.tsx` con `esbuild.transformSync` — sin errores.
2. No aplica (no se agregó ningún `import type` nuevo).
3. **Grafo de imports completo** (`esbuild.build`, mismo alias `@`, mismos externals) — resuelve sin errores (678 KB de bundle).
4. **Sin imports muertos**: `DetailHeader`/`DetailSection`/`DetailField` cada uno aparece ≥2 veces en `Machinery.tsx` (2/5/10); en `admin/Users.tsx` no se importó `DetailHeader` (no se usó, correctamente omitido), y `DetailSection`/`DetailField` aparecen 5 y 7 veces.
5. No aplica.
6. **Revisión manual campo por campo**: los 9 campos de `Machinery.tsx` (VIN/PIN, código, horómetro, marca, modelo, ubicación, valor, SKU, mov. sensible) y los 6 + la sección de permisos de `admin/Users.tsx` (ID, username, alcance, estado, creado, último acceso, permisos del rol) se confirmaron presentes con `grep -c` sobre las etiquetas exactas.

**No se pudo verificar**: `tsc --strict` completo (mismo motivo de red).

## Sesión: cierre de Bloque 3 — `inventory/ProductDetailModal.tsx` (4 tabs)

Entorno sin red, mismo `esbuild` de `tsx` para verificación.

### 9. `inventory/ProductDetailModal.tsx` — adaptado
- Encabezado (`DetailHeader`) con: `eyebrow` = SKU, `title` = nombre, badge de estado (Activo/Inactivo) en el encabezado (además de repetirse en la sección, igual criterio que en los demás modales de producto).
- El bloque de 9 campos (antes un único `div` con grid de 3 columnas, sin secciones) se separó en dos `DetailSection`:
  - "Información general": SKU, Categoría, Estado (con el mismo `Badge` que ya tenía, no se cambió a texto plano), Requiere lote, Requiere serie.
  - "Stock y valorización": Stock total (se preservó el tamaño de fuente más grande con un `<span className="text-lg">` anidado dentro del `value` de `DetailField`, para no perder el énfasis visual que tenía como número principal), Stock mínimo, Costo promedio, Valorización.
- **Las 4 pestañas (`ProductSummaryTab`, `ProductLocationsTab`, `ProductBatchesTab`, `ProductKardexTab`) no se tocaron como componentes** — se revisó cada una primero:
  - `ProductLocationsTab.tsx` y `ProductBatchesTab.tsx` y `ProductKardexTab.tsx`: son solo tablas, sin ningún patrón de campos repetido → nada que adaptar, no se tocaron.
  - `ProductSummaryTab.tsx`: tenía dos bloques de "Descripción" / "Información técnica" con el mismo patrón `bg-gray-50 rounded-lg` + label/valor que `DetailField` — se migraron a `DetailField`. La fila de 4 indicadores compactos (Estrategia despacho, Req. vencimiento, Req. colada, Mov. sensible) usa un estilo visual distinto y más compacto (`bg-[#093C5D]/3`, `text-[10px]`, centrado) que no encaja en el molde de `DetailField` sin perder esa identidad — se dejó igual, sin envolver ni forzar el patrón (caso de un solo uso, por restricción de no sobrecomponentizar).
- La navegación por pestañas (`Tabs`, `detailTab`/`onDetailTabChange`) y los 3 botones de acción (Registrar entrada/salida, Transferir) no se tocaron: misma lógica, mismos `onClick`.
- **Sin cambios de props** (`ProductDetailModalProps` idéntico) → `inventory/Inventory.tsx` no necesitó ningún cambio.

### Verificación
1. **Sintaxis real** de `ProductDetailModal.tsx` y `ProductSummaryTab.tsx` con `esbuild.transformSync` — sin errores.
2. No aplica (no se agregó ningún `import type` nuevo).
3. **Grafo de imports completo** (`esbuild.build`, mismo alias `@`, mismos externals) — resuelve sin errores (676 KB de bundle).
4. **Sin imports muertos**: `DetailHeader`/`DetailSection`/`DetailField` aparecen 2/5/10 veces en `ProductDetailModal.tsx`; `DetailField` aparece 3 veces en `ProductSummaryTab.tsx` (import + 2 usos).
5. No aplica.
6. **Revisión manual campo por campo**: los 9 campos del encabezado (SKU, Categoría, Estado, Stock total, Stock mínimo, Costo promedio, Valorización, Requiere lote, Requiere serie) y los 6 campos de `ProductSummaryTab` (Descripción, Información técnica, Estrategia despacho, Req. vencimiento, Req. colada, Mov. sensible) confirmados presentes con `grep -c`. Se confirmó que las 4 pestañas siguen recibiendo exactamente las mismas props (`detail`, `detailStock`, `locations`, `detailMovements`, `users`) sin cambios.

**No se pudo verificar**: `tsc --strict` completo (mismo motivo de red que en todas las sesiones de Fase 7).

**Bloque 3 queda completo** con esta adaptación, salvo por la decisión de alcance pendiente sobre el panel inline de `Locations.tsx` (no es un modal, ver tabla de abajo).

## Modales — estado de Bloque 3

| Modal | Estado |
|---|---|
| `authorizations/AuthorizationDetailModal.tsx` | ✅ Ya tenía el patrón (Bloque 1, origen del patrón) |
| `movements/physical-count/PhysicalCountDetailModal.tsx` | ✅ Adaptado esta sesión |
| `catalog/suppliers/SupplierDetailModal.tsx` | ✅ Adaptado esta sesión |
| `catalog/products/ProductDetailModal.tsx` | ✅ Adaptado esta sesión |
| `inventory/ProductDetailModal.tsx` (el de 4 tabs) | ✅ Adaptado esta sesión (encabezado y pestaña "Resumen"; las otras 3 pestañas son solo tablas y no necesitaban cambios) |
| `movements/entries/EntryDetailModal.tsx` | ✅ Adaptado esta sesión |
| `movements/multi-detail/MovementDetailModal.tsx` | ✅ Adaptado esta sesión |
| `machinery/Machinery.tsx` (modal inline) | ✅ Adaptado esta sesión |
| `admin/Users.tsx` (modal de perfil, inline) | ✅ Adaptado esta sesión (avatar del encabezado no se tocó, ver nota) |
| Categories, Units | Sin vista de detalle — solo modal de formulario (fuera de alcance) |
| Alerts | Sin `Modal` ni vista de detalle — nada que adaptar |
| Locations (panel de detalle inline, no modal) | Fuera de alcance de Bloque 3 (no es un `Modal`) — pendiente de decisión explícita si se quiere ampliar el alcance a paneles inline |
| Modales que NO son de detalle (formularios, confirmaciones, wizards: `SupplierFormModal`, `SupplierStatusModal`, `ProductFormModal`, `EntryFormModal`, `EntrySuccessModal`, `SupplierPickerModal`, `MovementFormModal`, `MovementSuccessModal`, `NewPhysicalCountModal`, `MfaConfirmModal`, `RejectAuthorizationModal`) | Fuera de alcance de Bloque 3 — el bloque es específicamente sobre modales de **detalle/consulta**, no formularios ni confirmaciones. No tocar salvo que se decida ampliar el alcance explícitamente. |

## Archivos modificados

### Sesión anterior (inicio de Bloque 3)
- `src/presentation/components/ui/index.tsx` (agregado: `DetailHeader`, `DetailSection`, `DetailField`)
- `src/presentation/pages/movements/physical-count/components/PhysicalCountDetailModal.tsx` (reescrito)
- `src/presentation/pages/movements/PhysicalCount.tsx` (una línea: pasar `locations`/`users` al modal)
- `src/presentation/pages/catalog/suppliers/components/SupplierDetailModal.tsx` (reescrito)

### Sesión -1 (continuación de Bloque 3)
- `src/presentation/pages/catalog/products/components/ProductDetailModal.tsx` (reescrito; sin cambios de props ni de llamadas)
- `src/presentation/pages/movements/entries/components/EntryDetailModal.tsx` (reescrito; sin cambios de props ni de llamadas)
- `src/presentation/pages/movements/multi-detail/components/MovementDetailModal.tsx` (reescrito; sin cambios de props ni de llamadas)

### Esta sesión (cierre de Bloque 3)
- `src/presentation/pages/inventory/components/ProductDetailModal.tsx` (encabezado y bloque de campos reescrito; import de `DetailHeader`/`DetailSection`/`DetailField` agregado; tabs y botones sin cambios; sin cambios de props ni de llamada)
- `src/presentation/pages/inventory/components/ProductSummaryTab.tsx` (los 2 campos label/valor migrados a `DetailField`; la fila de 4 indicadores compactos sin cambios)

## Próxima acción

Bloque 3 está completo. Queda solo una decisión de alcance pendiente, no técnica:
1. Si se quiere extender el patrón `DetailHeader`/`DetailSection`/`DetailField` al panel de detalle inline de `locations/Locations.tsx`, que no es un `Modal` — tal como está definido, Bloque 3 no lo cubre. Requiere decisión explícita antes de tocarlo.

Con Bloque 3 cerrado, la siguiente sesión debería definir el alcance del próximo bloque de Fase 7 (o si Fase 7 se da por cerrada, según el objetivo original del proyecto).

Antes de adaptar cada modal:
1. Leer el modal original completo y listar TODOS sus campos/secciones actuales (para no perder ninguno al reorganizar — en esta sesión casi se pierde "Nombre comercial" de Suppliers).
2. Revisar si el modal recibe todos los datos que necesita (ej. `locations`/`users` en PhysicalCount no estaban antes) — si falta algo, se agrega como prop nueva y se actualiza la única llamada en el compositor de la página.
3. Aplicar `DetailHeader` + `DetailSection` + `DetailField` importados de `presentation/components/ui`.
4. Verificar con el método de 4-6 pasos y documentar en este mismo archivo (no crear un documento nuevo).

## Restricciones (recordatorio para la siguiente sesión)

- Un solo documento de continuidad para la Fase 7: `SIGA_FASE7_CONTINUIDAD.md` (renombrado desde `CONTINUIDAD_FASE7.md` por pedido explícito del encargo de Fase 8). La Fase 8 tiene su propio documento, `SIGA_FASE8_CONTINUIDAD.md`.
- No rehacer el proyecto ni revertir fases anteriores (Fases 1-6 ya cerraron la arquitectura Clean Architecture; respetarla).
- No cambiar lógica de negocio ni flujos existentes.
- No inventar datos ni campos que no existan en las entidades del dominio.
- No sobrecomponentizar: `DetailHeader`/`DetailSection`/`DetailField` ya cubren el patrón repetido de modales; no crear componentes adicionales para casos de un solo uso.
- No eliminar funcionalidades ni campos no solicitados (ver nota sobre "Nombre comercial" arriba).
- Mantener la identidad visual existente de SIGA (paleta `#093C5D`/`#3B7597`/`#6FD1D7`/`#5DF8D8`).
- Verificar (con `pnpm build` si hay entorno disponible, o con esbuild si no) después de cada archivo o grupo pequeño de archivos, no solo al final del bloque.

---

## Bloque 4: Refinamiento visual integral

### Alcance del bloque (recordatorio)
Mejorar consistencia, jerarquía y percepción "ERP/WMS profesional" de toda la app **sin tocar lógica, rutas, RBAC ni datos**. Prioridad por grupos (definida en el prompt de origen del bloque):
1. Layout global: Header, Sidebar, MobileNav, componentes UI globales (`presentation/components/ui/index.tsx`, `index.css`).
2. Dashboard, Productos, Categorías, Unidades, Proveedores.
3. Inventario, Movimientos, Ubicaciones, Maquinaria.
4. Autorizaciones, Alertas, Usuarios, Roles y permisos.
5. Reportes, Trazabilidad, Analytics, Continuidad, Perfil, resto de módulos.

**No rehacer todo de una vez.** El bloque se trabaja grupo por grupo, verificando entre cada uno — igual que Bloques 2 y 3.

### Análisis inicial (esta sesión)
Antes de tocar código se revisó el estado real del lenguaje visual existente:
- `presentation/components/layout/{Layout,Header,Sidebar,MobileNav}.tsx`
- `presentation/components/ui/index.tsx` (Button, Badge, Input/Select/Textarea, Modal, DetailHeader/Section/Field, ConfirmDialog, Toast, Skeleton, KpiCard, PageHeader, EmptyState, badges de estado, iconos, Drawer, Tabs, StepWizard)
- `src/index.css` (tokens de color/radio/sombra, `.siga-table`, `.siga-input`, `.siga-select`, `.sidebar-item`, `.page-header`, `.siga-card`)

**Conclusión del análisis**: la base visual ya es sólida y madura (viene de 6 fases de refactor + Bloques 1-3 de Fase 7). Layout, Header, Sidebar, MobileNav y los componentes UI globales ya usan la paleta correcta, radios/sombras consistentes y un patrón `PageHeader → filtros → contenido` repetido en 24 de las ~28 páginas candidatas (las 4 restantes son wrappers sin contenido propio como `Exits.tsx`/`Adjustments.tsx`, o un dashboard con encabezado propio, casos legítimos, no inconsistencias). Se hizo un barrido con `grep` buscando patrones divergentes:
- Tablas fuera de `.siga-table`: solo 2 casos (`admin/RolesPermissions.tsx`, `NewPhysicalCountModal.tsx`), ambos matrices/tablas especiales con estilo propio deliberado (ej. la matriz de permisos con doble encabezado rol/acción) — **no se tocaron**, forzar `.siga-table` ahí rompería un diseño intencional, no es una inconsistencia real.
- `siga-card` se usa 58 veces de forma consistente; solo 1 archivo (`movements/entries/components/EntrySummaryStep.tsx`) usa un patrón de tarjeta ad-hoc equivalente — queda pendiente para el Grupo 3 (Movimientos), no se tocó esta sesión para no mezclar grupos.

### Grupo 1 — Layout global: cambios aplicados esta sesión
Solo 2 ajustes puntuales y seguros en `Header.tsx` (Sidebar, MobileNav, Layout e `ui/index.tsx` ya estaban consistentes, no requerían cambios):
1. **Título de página visible en todos los breakpoints**: antes `hidden sm:block` ocultaba el título en móvil, dejando al usuario sin referencia de "¿qué estoy viendo?" en pantallas pequeñas (contradice la jerarquía visual pedida en el punto 4 del bloque). Ahora se muestra siempre, truncado (`truncate max-w-[40vw] sm:max-w-none`) para no chocar con el buscador.
2. **Radio de esquina del dropdown de búsqueda**: usaba `rounded-lg`/`shadow-lg` mientras que los otros dos paneles flotantes del header (alertas, menú de usuario) usan `rounded-xl`/`shadow-xl`. Unificado a `rounded-xl`/`shadow-xl` para que los 3 paneles flotantes del header se vean como una misma familia (punto 17: consistencia entre módulos/elementos equivalentes).

Archivo modificado: `src/presentation/components/layout/Header.tsx` (2 cambios de clases CSS únicamente, sin tocar lógica de búsqueda, alertas ni menú de usuario).

### Verificación
Entorno sin red/`node_modules` (mismo `403 Forbidden` de todas las sesiones de Fase 7). Se usó el `esbuild` empaquetado dentro de `tsx`:
1. **Sintaxis** de `Header.tsx` con `esbuild.transformSync` — sin errores.
2. **Grafo de imports completo** (`esbuild.build`, entrypoint `src/main.tsx`, alias `@`, CSS stubeado, externalizando `react`/`react-dom`/`react-router-dom`/`recharts`) — resuelve sin errores (692 KB de bundle).
3. Revisión manual: los cambios son solo clases Tailwind (visibilidad/radio/sombra), ningún handler, prop ni estado se tocó.

**No se pudo verificar**: `tsc --strict` ni render real (mismo motivo de red que en todas las sesiones anteriores). Si hay red disponible en una futura sesión: `pnpm install --frozen-lockfile && pnpm build`.

Grupo 1 queda cerrado con estos ajustes mínimos (el resto del layout global ya cumplía el estándar del bloque).

### Grupo 2 — Dashboard + Catálogo (Productos, Categorías, Unidades, Proveedores): análisis y cambios aplicados esta sesión

**Análisis**: se descubrió que "Dashboard" en realidad son 3 implementaciones distintas según rol (`dashboard/Dashboard.tsx` para admin, `SupervisorDashboard.tsx`, `WarehouseDashboard.tsx`, ruteadas por `componentsByRole` en `routeRegistry.ts`) — las 3 se revisaron. Categories.tsx y Units.tsx ya estaban ejemplarmente consistentes (PageHeader, `.siga-card`/`.siga-table`, Badge, EmptyState) — no se tocaron. Products.tsx/Suppliers.tsx y sus componentes (`ProductFiltersBar`/`SupplierFiltersBar`, `ProductsTable`/`SuppliersTable`) ya comparten el mismo patrón de filtros (`px-6 py-3 border-b border-gray-200 bg-white`) — no se tocaron ahí. Se encontraron 3 inconsistencias reales:

1. **Título del dashboard de admin más grande que el resto**: `DashboardHeader.tsx` (usado solo por el dashboard de admin) usaba `text-2xl` para el saludo, mientras que `SupervisorDashboard.tsx` y `WarehouseDashboard.tsx` usan `PageHeader` cuyo `<h1>` es `text-xl` — 3 variantes de la misma pantalla (Dashboard) con jerarquía de título distinta sin razón (punto 17: mismo módulo, mismo patrón). Unificado a `text-xl` (se mantiene `font-display`, no se tocó el saludo dinámico ni el selector de período).
2. **Badge de estado de movimiento hecho a mano en `SupervisorDashboard.tsx`**: la lista "Movimientos sensibles recientes" pintaba el estado con un `<span>` propio que solo distinguía `confirmado`/`rechazado`/otro (todo lo demás caía en ámbar) y mostraba el valor crudo del enum (ej. `pendiente_autorizacion` en vez de "Pendiente autorización"), en vez de usar el componente compartido `MovementStatusBadge` que ya existe en `ui/index.tsx` y ya se usa en el resto de la app para este mismo dato (punto 11: mismo estado debe verse igual en todos los módulos). Reemplazado por `<MovementStatusBadge status={m.status} />`; no se tocó el resto de la fila ni la lógica de filtrado de `recentMovements`.
   - Se revisó el caso equivalente en `WarehouseDashboard.tsx` (pill de *tipo* de movimiento, no de estado) y se decidió **no tocarlo**: no hay un componente compartido de "tipo de movimiento" y forzarlo dentro de la paleta fija de `Badge` (7 variantes) perdería la distinción visual entre sus 5 tipos — no es la misma inconsistencia que el caso 2.
3. **`ProductsTable.tsx` sin vista mobile**, a diferencia de `SuppliersTable.tsx` (mismo grupo/carpeta) que ya tiene una lista de tarjetas `md:hidden` además de la tabla `hidden md:block`. En pantallas angostas la tabla de productos (9 columnas) solo tenía scroll horizontal de una `<table>` sin envoltorio responsive, mientras que el módulo hermano (Proveedores) ya resuelve esto con tarjetas — inconsistencia directa de responsive entre dos módulos del mismo grupo (puntos 7, 17 y 19). Se replicó el mismo patrón: tabla envuelta en `hidden md:block` sin cambios, y se agregó una lista de tarjetas `md:hidden` con SKU, nombre, categoría, badge de tipo, flag de "Mov. sensible", stock y valorización — mismos datos ya calculados en el componente (`getStock`, `categories.find`), ningún dato nuevo ni prop nueva; al tocar una tarjeta se llama `onView` igual que en `SuppliersTable`. Sin cambios de props (`ProductsTableProps` idéntico) → `Products.tsx` no necesitó ningún cambio.

Archivos modificados:
- `src/presentation/pages/dashboard/components/DashboardHeader.tsx` (1 clase)
- `src/presentation/pages/dashboard/SupervisorDashboard.tsx` (import + reemplazo de un `<span>` por `<MovementStatusBadge>`)
- `src/presentation/pages/catalog/products/components/ProductsTable.tsx` (tabla envuelta en `hidden md:block` + bloque nuevo `md:hidden` con tarjetas)

### Verificación (Grupo 1 + Grupo 2)
Entorno sin red/`node_modules` (mismo `403 Forbidden` de todas las sesiones de Fase 7). Se usó el `esbuild` empaquetado dentro de `tsx`:
1. **Sintaxis** de los 4 archivos tocados (`Header.tsx`, `DashboardHeader.tsx`, `SupervisorDashboard.tsx`, `ProductsTable.tsx`) con `esbuild.transformSync` — sin errores.
2. **Grafo de imports completo** (`esbuild.build`, entrypoint `src/main.tsx`, alias `@`, CSS stubeado, externalizando `react`/`react-dom`/`react-router-dom`/`recharts`) — resuelve sin errores (694 KB de bundle).
3. Revisión manual: en `ProductsTable.tsx` se confirmó que la tabla desktop no cambió (solo el `<div className="hidden md:block">` que la envuelve) y que la tarjeta mobile no introduce ninguna prop nueva ni cambia `canEdit`/`onEdit` (siguen usados solo en desktop, igual que en `SuppliersTable`).

**No se pudo verificar**: `tsc --strict` ni render real (mismo motivo de red de siempre). Si hay red disponible en una futura sesión: `pnpm install --frozen-lockfile && pnpm build`.

### Grupo 3 — Inventario, Movimientos, Ubicaciones, Maquinaria: análisis y cambios aplicados esta sesión

**Análisis**: barrido con `grep` sobre los 4 módulos buscando divergencias de los patrones ya establecidos en Grupos 1-2 (tabla con vista mobile, `.siga-card`, `border-gray-200` en filtros, `MovementStatusBadge` para estados de movimiento, layouts responsive sin overflow). Se encontraron 6 inconsistencias/gaps reales; el resto de los archivos de estos 4 módulos (Categories/Units-equivalentes ya cerrados, `PhysicalCountKpis.tsx`, `IraGauge.tsx`, `CountHistoryCard.tsx`, `NewPhysicalCountModal.tsx` — su tabla-matriz especial ya evaluada y excluida en Grupo 1 —, `MovementLineItemCard.tsx`/`EntryLineItemCard.tsx`/`EntryHeaderStep.tsx`/`SupplierPickerModal.tsx` con sus `rounded-xl border` de tarjetas *seleccionables* con estado, que no son el mismo patrón que un `.siga-card` de contenido) ya estaban consistentes y no se tocaron.

1. **`InventoryTable.tsx` sin vista mobile**: la tabla principal de Inventario (12 columnas: SKU, Producto, Categoría, Tipo, Stock, Unidad, Mínimo, Estado, Lote/Venc., Costo, Valorización, Acciones) solo tenía `overflow-auto` de scroll horizontal, sin el patrón de tarjetas `md:hidden` que ya tienen `ProductsTable.tsx`/`SuppliersTable.tsx` (Grupo 2) y `EntriesList.tsx`/`MovementsList.tsx`. Se agregó vista de tarjetas mobile con SKU, nombre, categoría, badges de tipo/estado, stock/mínimo/valorización y los mismos 4 botones de acción rápida (ver/entrada/salida/transferencia) que la fila de escritorio. **Bug detectado y corregido durante la escritura**: la primera versión anidaba los 4 `<button>` de acción dentro de un `<button>` contenedor (HTML inválido, causa warnings de hidratación en React) — se cambió el contenedor a un `<div role="button" tabIndex={0}>` con el mismo `onClick`, manteniendo `stopPropagation()` en el grupo de acciones. Sin cambios de props (`InventoryTableProps` idéntico) → `Inventory.tsx` no necesitó ningún cambio.
2. **`InventoryFiltersBar.tsx`**: el contenedor usaba `border-b border-gray-100`, mientras que `ProductFiltersBar.tsx`/`SupplierFiltersBar.tsx` (mismo patrón, mismo tipo de barra) usan `border-b border-gray-200`. Unificado a `border-gray-200`.
3. **`Locations.tsx` — layout de dos columnas sin responsive**: el panel de árbol de ubicaciones usaba `w-96` (384px) fijo junto al panel de detalle (`flex-1`), sin ningún breakpoint — en viewports de 375-390px esto generaba overflow horizontal real (violación directa del punto 19 del bloque: "No permitir overflow horizontal accidental"). Cambiado a `flex flex-col md:flex-row`: en mobile el árbol pasa a ancho completo con `max-h-64` y scroll propio arriba, el panel de detalle queda debajo; en `md:` en adelante se mantiene exactamente el layout original (`md:w-96`, lado a lado). También se redujo el padding del panel de detalle a `p-4 md:p-6` (antes `p-6` fijo) para no desperdiciar espacio en pantallas angostas. Ningún dato, cálculo ni handler tocado.
4. **`Machinery.tsx` — badge de estado de movimiento hecho a mano**: la tabla "Historial de movimientos" dentro del modal de detalle pintaba el estado con `<Badge variant={mv.status === 'confirmado' ? 'success' : 'warning'}>{mv.status}</Badge>` (texto crudo del enum, solo 2 variantes posibles), en vez del componente compartido `MovementStatusBadge` que ya cubre los 5 estados reales con sus labels correctos — exactamente la misma inconsistencia ya corregida en `SupervisorDashboard.tsx` en el Grupo 2 (punto 11: mismo estado debe verse igual en toda la app). Reemplazado por `<MovementStatusBadge status={mv.status} />`; se agregó el import correspondiente. El `<Badge variant="primary">` de la columna "Tipo" (dato distinto, sin componente compartido equivalente) no se tocó.
5. **`EntrySummaryStep.tsx` — pendiente ya documentado**: la tarjeta de línea en la vista mobile usaba `rounded-xl border border-gray-200 bg-white` ad-hoc en vez de `.siga-card`. Unificado a `siga-card p-3`, sin cambios de contenido.
6. **`MovementSummaryStep.tsx` sin vista mobile**: es el paso de resumen equivalente a `EntrySummaryStep.tsx` pero para el wizard de movimientos multi-detalle (salidas/transferencias/ajustes) — tenía la tabla de líneas envuelta solo en `siga-card overflow-auto` con `min-w-[720px]`, sin el bloque de tarjetas `md:hidden` que su gemelo de Entradas ya tiene. Se replicó el mismo patrón (tarjeta con producto, cantidad, valor, origen → destino), envolviendo la tabla original en `hidden md:block` sin cambiarla. Sin cambios de props ni de lógica (`currentAverageCost`, `effectiveType`, etc. intactos).

Archivos modificados:
- `src/presentation/pages/inventory/components/InventoryTable.tsx` (tabla envuelta en `hidden md:block` + bloque `md:hidden` con tarjetas y acciones)
- `src/presentation/pages/inventory/components/InventoryFiltersBar.tsx` (1 clase: `border-gray-100` → `border-gray-200`)
- `src/presentation/pages/locations/Locations.tsx` (layout de 2 columnas → responsive `flex-col md:flex-row` + padding del panel de detalle)
- `src/presentation/pages/machinery/Machinery.tsx` (import de `MovementStatusBadge` + reemplazo de un `<Badge>` manual en la tabla de historial)
- `src/presentation/pages/movements/entries/components/EntrySummaryStep.tsx` (1 clase de tarjeta → `siga-card`)
- `src/presentation/pages/movements/multi-detail/components/MovementSummaryStep.tsx` (tabla envuelta en `hidden md:block` + bloque nuevo `md:hidden` con tarjetas)

### Verificación (Grupo 3)
Mismo entorno sin red/`node_modules` de todas las sesiones de Fase 7 (`npm install` sigue en `403 Forbidden`, `pnpm` ni siquiera está instalado en este entorno). Sin `esbuild` disponible tampoco esta vez (ni suelto ni empaquetado en `tsx`), se usó el compilador de TypeScript global (`typescript` vía `ts.transpileModule`) como verificación de sintaxis equivalente:
1. **Sintaxis real** de los 6 archivos tocados con `ts.transpileModule` (JSX react-jsx, ES2020) — sin diagnósticos, los 6 OK.
2. **Balance de etiquetas**: conteo de `<div`/`</div>` en los archivos con estructura JSX más profunda (`InventoryTable.tsx`, `MovementSummaryStep.tsx`) — coinciden exactamente.
3. **Sin imports muertos**: `MovementStatusBadge` aparece 2 veces en `Machinery.tsx` (import + uso); `Badge` se sigue usando (columna "Tipo"), import no se quitó.
4. **Revisión manual campo por campo**: se confirmó que las 12 columnas de `InventoryTable.tsx` y sus 4 acciones están presentes tanto en la fila desktop como en la tarjeta mobile; que `MovementSummaryStepProps`/`InventoryTableProps` no cambiaron; que el árbol de `Locations.tsx` sigue usando los mismos `onSelect`/`onToggle`/`expandedIds` sin alterar su lógica de expansión.
5. **No se pudo verificar**: `tsc --strict` completo, `pnpm build` ni render real — se intentó explícitamente esta sesión (`pnpm` no está instalado en el entorno; `npm install` devolvió el mismo `403 Forbidden` de siempre). Si hay red disponible en una futura sesión: `pnpm install --frozen-lockfile && pnpm build`.

Grupo 3 queda cerrado con estos 6 ajustes.

### Grupo 4 — Autorizaciones, Alertas, Usuarios, Roles y permisos, Parámetros: análisis y cambios aplicados esta sesión

**Análisis**: se revisaron los 5 archivos del grupo (`authorizations/Authorizations.tsx` + `AuthorizationCard.tsx`/`AuthorizationDetailModal.tsx`/`MfaConfirmModal.tsx`/`RejectAuthorizationModal.tsx`, `alerts/Alerts.tsx`, `admin/Users.tsx`, `admin/RolesPermissions.tsx`, `admin/Parameters.tsx`) contra los patrones ya establecidos en Grupos 1-3. `Authorizations.tsx`/`AuthorizationCard.tsx` ya usan `PageHeader`, `Tabs`, `EmptyState`, `.siga-card` de forma consistente — no se tocaron. `MfaConfirmModal.tsx`/`RejectAuthorizationModal.tsx` ya son confirmaciones simples, tal como pide el punto 13 del bloque — no se tocaron. `AuthorizationDetailModal.tsx` sigue con su `Field`/`Section` local (decisión ya documentada en Bloque 3, visualmente idéntico a `DetailHeader`/`DetailSection`/`DetailField` — no había necesidad de re-tocarlo). `RolesPermissions.tsx` (matriz de permisos) ya fue evaluada en Grupo 1: su tabla fuera de `.siga-table` es intencional (matriz con doble encabezado rol/acción) — se confirmó que sigue siendo el caso correcto, no se tocó. Se encontraron 3 inconsistencias reales:

1. **`alerts/Alerts.tsx` — badge de severidad y tipos sin traducir**: el badge de `alert.severity` mostraba el valor crudo del enum (`critical`/`warning`/`info`) en vez de una etiqueta en español, y `TYPE_LABELS`/`TYPE_COLORS` solo cubrían 5 de los 8 valores reales de `Alert.type` (faltaban `vencido`, `movimiento_sensible`, `ajuste`), cayendo al fallback `?? alert.type` con el enum crudo — misma inconsistencia de "badge sin traducir" ya corregida en `SupervisorDashboard.tsx` y `Machinery.tsx` (Grupo 2 y 3), aplicada aquí sobre el mismo patrón de badges (punto 11 del bloque). Se agregó `SEVERITY_LABELS` (Crítica/Advertencia/Informativa) y se completaron las 3 entradas faltantes de `TYPE_LABELS`/`TYPE_COLORS`, siguiendo la convención de color ya usada en el resto de la app (`vencido` → `error`, igual que `InventoryStatusBadge` en `ui/index.tsx`; `movimiento_sensible` → `warning`, igual que el flag "Mov. sensible" en Productos/Maquinaria; `ajuste` → `primary`, sin convención previa, color neutro). Ningún dato ni lógica de alertas tocado (`splitAlertsByRead`, filtrado, `markAlertRead` intactos).
2. **`admin/Users.tsx` — dos gaps de consistencia con Grupos 2-3**:
   - Único módulo de toda la app cuyo campo de búsqueda no tenía el ícono de lupa (`SearchIcon`) que sí tienen `ProductFiltersBar`/`SupplierFiltersBar`/`InventoryFiltersBar` — verificado con `grep -rln "Buscar" | xargs grep -L "SearchIcon"`, solo este archivo aparecía. Se agregó `SearchIcon` + `pl-8` (antes `pl-4`), igual patrón que los demás filtros.
   - La tabla de usuarios (7 columnas) no tenía vista de tarjetas `md:hidden`, a diferencia de `ProductsTable.tsx`/`SuppliersTable.tsx`/`InventoryTable.tsx` ya corregidas en Grupos 2 y 3. Se agregó el mismo patrón: tabla envuelta en `hidden md:block` sin cambios, y bloque `md:hidden` con tarjetas (avatar+nombre+email, badge de rol, alcance, toggle de estado, acciones ver/editar). Mismo problema de anidamiento de `<button>` ya resuelto en `InventoryTable.tsx` (Grupo 3): el toggle de estado y las acciones usan `stopPropagation()` sobre un contenedor `<div role="button" tabIndex={0}>`, no un `<button>` anidando otros botones. Sin cambios de props (`Users.tsx` es autocontenido, no recibe props) ni de `toggleStatus`/`openEdit`/`setDetailId`.
3. **`admin/Parameters.tsx` — layout de fila con posible overflow en mobile + imports muertos**: cada fila de parámetro usaba `flex items-start gap-6` con el input a `w-64` fijo y el badge de código (`item.key`) en una columna fija a la derecha (`pt-6`) — sin ningún breakpoint. En viewports de 375-390px esto podía angostar o desbordar la fila (punto 19: "no permitir overflow horizontal accidental"), mismo tipo de problema ya corregido en `Locations.tsx` (Grupo 3). Se cambió a `flex-col sm:flex-row`: en mobile el badge de código pasa a estar junto al label (arriba, `sm:hidden`) y el input pasa a `w-full`; en `sm:` en adelante se mantiene el layout original exacto (`sm:w-64`, badge de código a la derecha en `pt-6`). Además, el archivo importaba `Input`, `Select` y `Badge` de `ui/index.tsx` sin usarlos nunca (la página ya usa `<input>`/`<select>` nativos con clases `siga-input`/`siga-select`, con una estructura label→hint→input que no coincide con el orden interno de los componentes compartidos `Input`/`Select`, por eso no se forzó su uso) — se quitaron los 3 imports muertos. Ningún dato, `params`, `handleSave` ni la lista `PARAMS` se tocó.

Archivos modificados:
- `src/presentation/pages/alerts/Alerts.tsx` (agregado `SEVERITY_LABELS`; completadas 3 entradas de `TYPE_LABELS`/`TYPE_COLORS`; 1 línea de render del badge de severidad)
- `src/presentation/pages/admin/Users.tsx` (import de `SearchIcon`; ícono en el buscador; tabla envuelta en `hidden md:block` + bloque nuevo `md:hidden` con tarjetas)
- `src/presentation/pages/admin/Parameters.tsx` (quitados 3 imports muertos; fila de parámetro con layout responsive `flex-col sm:flex-row`)

### Verificación (Grupo 4)
Entorno sin red (`403 Forbidden` de siempre, confirmado de nuevo con `curl` a `registry.npmjs.org`). Esta vez sí había `esbuild` disponible (empaquetado dentro de `tsx`, en `.npm-global/lib/node_modules/tsx/node_modules/esbuild`), además del `typescript` global:
1. **Sintaxis real** de los 3 archivos tocados con `ts.transpileModule` (JSX react-jsx, ES2020) — 0 diagnósticos en los 3.
2. **Balance de etiquetas**: conteo de `<div`/`</div>` en `Users.tsx` (el de estructura JSX más profunda) — 34/34, coinciden.
3. **Grafo de imports completo** con `esbuild.build({ bundle: true, entryPoints: ['src/main.tsx'] })`, alias `@`, CSS stubeado, externalizando `react`/`react-dom`/`react-router-dom`/`recharts` — resuelve sin errores (704 KB de bundle).
4. **Sin imports muertos**: `SearchIcon`/`EyeIcon`/`EditIcon` aparecen 2/3/3 veces en `Users.tsx` (import + usos); `SEVERITY_LABELS`/`TYPE_LABELS`/`TYPE_COLORS` aparecen 2/3/3 veces en `Alerts.tsx`; `Parameters.tsx` solo importa `useState`, `useApp`, `getBreadcrumbs`, `Button`, `PageHeader` — todos usados.
5. **Revisión manual campo por campo**: se confirmó que `u.name`/`u.lastName`/`u.email`/`u.username`/`u.scope`/`u.status` y los handlers `openEdit`/`toggleStatus`/`setDetailId` siguen presentes y con las mismas condiciones (`canManage`) en `Users.tsx`; que `item.key` se sigue mostrando en `Parameters.tsx` (ahora en 2 posiciones responsive en vez de 1 fija); que los 5 tipos de alerta originales (`sin_stock`/`bajo_minimo`/`proximo_vencer`/`autorizacion_pendiente`/`maquinaria`) siguen en `TYPE_LABELS` de `Alerts.tsx` sin cambios de texto.

**No se pudo verificar**: `tsc --strict` completo ni `pnpm build`/render real — `pnpm` no está instalado en este entorno y `npm install` sigue devolviendo `403 Forbidden` (mismo motivo de red de todas las sesiones de Fase 7). Si hay red disponible en una futura sesión: `pnpm install --frozen-lockfile && pnpm build`.

Grupo 4 queda cerrado con estos 3 ajustes.

### Grupo 5 — Reportes, Trazabilidad, Analytics, Continuidad, Perfil, Integraciones: análisis y cambios aplicados esta sesión

**Análisis**: se revisaron los 12 archivos restantes del bloque (`reports/Reports.tsx` + sus 8 componentes en `reports/components/`, `traceability/Traceability.tsx`, `analytics/Analytics.tsx`, `continuity/Continuity.tsx`, `profile/Profile.tsx`, `integrations/Integrations.tsx`, y de pasada `auth/Login.tsx` y `admin/RolesPermissions.tsx` para confirmar que no necesitaban revisión) contra los patrones ya establecidos en Grupos 1-4 (grids de KPIs responsive `grid-cols-2 lg:grid-cols-4`, filas que puedan desbordar en mobile, `.siga-table`/`.siga-card`, badges compartidos). La mayoría de los archivos ya estaban consistentes y no se tocaron: `Analytics.tsx` (ya usa `grid-cols-2 lg:grid-cols-4` y `grid-cols-1 lg:grid-cols-3` en sus 3 filas, `siga-card` en todos los paneles); `Continuity.tsx` (ya responsive: `grid-cols-1 sm:grid-cols-3`, `flex-col sm:flex-row`, banner informativo azul consistente con el ya evaluado en `MovementDetailModal` en Grupo 3); `Integrations.tsx` (ya usa `grid-cols-1 lg:grid-cols-2`); `Profile.tsx` (el degradado del avatar `from-[#093C5D] to-[#3B7597]` es el mismo patrón ya usado 3 veces en `admin/Users.tsx`, no una decoración nueva — no se tocó); `Login.tsx` (pantalla de login, ya responsive con `hidden lg:flex`/`lg:hidden`, con su propio tratamiento visual de splash intencional, fuera del alcance de "módulos" del punto 18); `RolesPermissions.tsx` (matriz ya evaluada como intencional en Grupos 1 y 4, reconfirmado, no se tocó); `ReportsCatalog.tsx`, `MovementFlowReportView.tsx`, `InventoryReportView.tsx`, `PlaceholderReportView.tsx` (sin cambios: tablas de reporte de solo lectura con `overflow-auto` ya heredado del contenedor padre de `Reports.tsx`, mismo patrón ya usado sin vista mobile de tarjetas en `audit/Audit.tsx` — no se inventó una vista de tarjetas nueva para no sobre-diseñar donde ya existe un precedente consistente). Se encontraron 4 inconsistencias reales, todas del mismo tipo (grids/filas con anchos fijos sin breakpoint, punto 19: "no permitir overflow horizontal accidental"), usando como referencia el propio patrón ya establecido en la app (`grid-cols-2 lg:grid-cols-4` para grupos de 4 KPIs, `flex-col sm:flex-row` para filas que puedan desbordar):

1. **`reports/components/CostCenterReportView.tsx`**: las 3 tarjetas resumen de centro de costo usaban `grid-cols-3` fijo, sin breakpoint — en viewports de 375-390px esto angosta cada tarjeta a ~110px con montos en soles que pueden ser largos. Cambiado a `grid-cols-1 sm:grid-cols-3` (una columna en mobile, 3 desde `sm:`). Ningún dato ni cálculo tocado.
2. **`reports/components/ValuationReportView.tsx`**: las 4 tarjetas (3 tipos + total) usaban `grid-cols-4` fijo, mismo problema, y sin seguir la convención ya usada en el resto de la app para grupos de 4 KPIs (`KpiSummaryGrid.tsx`, `PhysicalCountKpis.tsx`: `grid-cols-2 lg:grid-cols-4`). Unificado a esa misma convención. Ningún dato tocado.
3. **`traceability/Traceability.tsx`**: el grid de "stock por ubicación" (línea 90) usaba `grid-cols-4` fijo, mientras que el grid de detalle de movimiento un poco más abajo en el mismo archivo (línea 135) ya usa `grid-cols-2 md:grid-cols-4` — inconsistencia directa dentro del mismo archivo. Unificado el primero a `grid-cols-2 md:grid-cols-4`. No se tocaron los marcadores de línea de tiempo con colores/flechas por tipo de movimiento (`typeColors`/`typeLabels`): es el mismo caso ya evaluado y descartado en Grupo 2 para `WarehouseDashboard.tsx` — no existe un componente compartido de "tipo de movimiento" (distinto de `MovementStatusBadge`, que aquí sí se usa correctamente para el estado) y forzarlo perdería la distinción visual entre sus 5 tipos.
4. **`reports/components/ReportDetailHeader.tsx`**: la fila del encabezado de detalle (botón "← Volver" + título del reporte + botón "Exportar CSV") usaba `flex items-center justify-between` sin `flex-wrap` ni truncamiento — algunos nombres de reporte son largos (ej. "Trazabilidad de Lotes y Vencimientos", 34 caracteres) y en viewports de 375-390px la fila completa (botón + título + botón) podía desbordar horizontalmente, mismo tipo de problema ya corregido en `Locations.tsx` y `Parameters.tsx` (Grupos 3-4). Cambiado a `flex-col sm:flex-row sm:items-center sm:justify-between gap-3`, con el título en `truncate` dentro de un contenedor `min-w-0` y el botón de exportar con `flex-shrink-0`; en `sm:` en adelante el layout queda visualmente igual al original (todo en una fila). Sin cambios de props (`ReportDetailHeaderProps` idéntico) ni de la lógica de `onBack`/exportación (el botón sigue sin `onClick`, igual que antes — no se implementó ninguna función de exportación nueva).

Archivos modificados:
- `src/presentation/pages/reports/components/CostCenterReportView.tsx` (1 clase de grid)
- `src/presentation/pages/reports/components/ValuationReportView.tsx` (1 clase de grid)
- `src/presentation/pages/traceability/Traceability.tsx` (1 clase de grid)
- `src/presentation/pages/reports/components/ReportDetailHeader.tsx` (layout de la fila de encabezado → responsive `flex-col sm:flex-row` + `truncate`/`min-w-0`/`flex-shrink-0`)

### Verificación (Grupo 5)
Mismo entorno sin red de todas las sesiones de Fase 7 (`curl` a `registry.npmjs.org` → `403 Forbidden`; sin `node_modules`; sin `pnpm` instalado). Esta vez no había `esbuild` disponible (ni suelto ni empaquetado en `tsx`), se usó el compilador `typescript` global (ya presente en el entorno, vía `ts.transpileModule` con JSX `react-jsx`/ES2020, igual que en la verificación de Grupo 3):
1. **Sintaxis real** de los 4 archivos tocados — 0 diagnósticos en los 4.
2. **Balance de etiquetas**: conteo de `<div`/`</div>` en los 4 archivos — coinciden en 3; en `Traceability.tsx` la diferencia (54 vs 53) se verificó que corresponde a un único `<div ... />` autocerrado preexistente en la línea 111 (no relacionado con el cambio), no a una etiqueta sin cerrar.
3. **Diff línea por línea contra el archivo original** (`diff` contra el ZIP subido) para los 4 archivos: se confirmó que el único cambio en cada uno son las clases CSS descritas arriba — ninguna prop, dato, handler ni import fue tocado.
4. **No se pudo verificar**: grafo de imports completo con `esbuild.build` (no disponible esta sesión, a diferencia de Grupos 1/2/4), `tsc --strict` completo, `pnpm build` ni render real — mismo motivo de red de todas las sesiones de Fase 7. Si hay red disponible en una futura sesión: `pnpm install --frozen-lockfile && pnpm build`.

Grupo 5 queda cerrado con estos 4 ajustes. **Con esto, los 5 grupos previstos para el Bloque 4 quedan revisados y cerrados.**

### Verificación final del Bloque 4 (conjunto de los 5 grupos)

Ejecutada al inicio de esta sesión, sobre el estado completo del proyecto (no solo Grupo 5), tal como pedía la "Próxima acción" dejada por la sesión anterior. Mismo entorno sin red de todas las sesiones de Fase 7 (`curl` a `registry.npmjs.org` → `403 Forbidden`; sin `node_modules`; sin `pnpm` instalado). Esta vez sí había `esbuild` disponible (empaquetado en `tsx`), además del `typescript` global:

1. **Sintaxis real de los 243 archivos fuente del proyecto** (`.ts`/`.tsx` bajo `src/`) con `ts.transpileModule` (JSX `react-jsx`, ES2020) — **0 diagnósticos en los 243**. El único archivo que no pudo transpilarse fue `src/vite-env.d.ts`, un `.d.ts` de una sola línea (`/// <reference types="vite/client" />`) sin código emitible — comportamiento esperado de `transpileModule` sobre archivos de solo declaración, no un error real ni relacionado con ningún cambio de Fase 7.
2. **Grafo de imports completo de toda la aplicación** con `esbuild.build({ bundle: true, entryPoints: ['src/main.tsx'] })`, alias `@` → `src`, CSS stubeado, externalizando `react`/`react-dom`/`react-dom/client`/`react-router-dom`/`recharts` — **build OK, 599.7 KB, 0 warnings**. Esto confirma que ningún import roto o módulo faltante quedó introducido por el conjunto de cambios de los 5 grupos del bloque.
3. **Barrido de las decisiones explícitamente descartadas en sesiones anteriores**, para confirmar que ninguna quedó revertida por accidente: la matriz de `admin/RolesPermissions.tsx` sigue con su `<table className="w-full text-xs">` propio, fuera de `.siga-table` (intencional, Grupo 1); `AuthorizationDetailModal.tsx` sigue con sus funciones locales `Field`/`Section` (Bloque 3); `MfaConfirmModal.tsx`/`RejectAuthorizationModal.tsx` siguen como `Modal size="sm"` (confirmaciones simples, Grupo 4). Los 4 ajustes de Grupo 5 (grids responsive de `CostCenterReportView`/`ValuationReportView`/`Traceability`, y el layout responsive de `ReportDetailHeader`) se confirmaron presentes.
4. **No se pudo verificar**: `tsc --strict` completo del proyecto (el `tsconfig.json` requiere resolver `@vitejs/plugin-react`, `@tailwindcss/vite`, `@types/react`, etc., que no están instalados sin red), `pnpm build` real, ni render/comprobación visual en navegador — mismo motivo de red de **todas** las sesiones de Fase 7, sin excepción. Este es el único punto que queda genuinamente pendiente y que requiere un entorno con acceso a npm/pnpm para cerrarse.

**Conclusión de la verificación**: no se encontró ningún error de sintaxis, import roto, ni regresión de las decisiones ya tomadas, en el conjunto completo del proyecto tras los 5 grupos del Bloque 4. Con esta base, el Bloque 4 se marca como **completado** (ver estado general arriba), quedando como única tarea abierta la compilación real (`pnpm build`) si en el futuro hay red disponible.

### Pendiente real (no resuelto por falta de entorno)
- Ejecutar `pnpm install --frozen-lockfile && pnpm build` en un entorno con red y registrar aquí el resultado real (esto reemplazaría los "No se pudo verificar" de sesiones anteriores por una confirmación definitiva).
- Hacer una revisión visual real en navegador (desktop 1440×900/1280×800, tablet 1024×768, mobile 390×844/375×812) tal como pide el punto 20 del encargo original — ninguna sesión de Fase 7 pudo hacer esto por falta de entorno gráfico/red.

### Próxima acción exacta
No hay grupos ni ajustes visuales pendientes del Bloque 4. La próxima sesión debe:
1. Si hay red disponible: ejecutar `pnpm install --frozen-lockfile && pnpm build`, y si hay entorno gráfico, hacer la revisión visual real en los tamaños del punto 20. Registrar el resultado real aquí, reemplazando las verificaciones "de sustituto" (TypeScript/esbuild) de todas las sesiones anteriores por la confirmación definitiva.
2. Si no hay red ni entorno gráfico: no hay más trabajo de refinamiento visual que hacer en este bloque — cualquier nueva tarea sería ya de una fase o bloque distinto, y debe tratarse como tal (no reabrir el análisis de los Grupos 1-5, ya cerrado y documentado).

---

## Mejora del modal "Detalle del movimiento" (tarea posterior a Fase 8)

### Punto de partida
Existían dos modales de detalle casi idénticos y pobres: `entries/components/EntryDetailModal.tsx` (con "Progreso" de 4 estados y bloque de proveedor) y `multi-detail/components/MovementDetailModal.tsx` (cabecera + tabla de 6 columnas + una línea de "Auditoría"). Ambos mostraban solo id, documento, estado, versión y una tabla mínima.

### Modelo real inspeccionado (no se modificó)
`Movement` (`domain/entities/Movement.ts`), `MovementLine`, `Authorization`, `AuditEvent`, `Evidence` (`types/index.ts`, alimentado por `state.evidences`), `Product.description`, `CostCenter`, `Responsible`.

### Cambios
- **Nueva vista compartida** `movements/shared/detail/`: `MovementDetailView.tsx` (cabecera + tabs + lectura de datos con los hooks existentes), `MovementSummary.tsx`, `MovementLinesTable.tsx`, `MovementTimeline.tsx`, `MovementAttachments.tsx` y `movementDetailData.ts` (funciones puras: etiquetas de tipo, importe de línea, historial, progreso, tamaño de archivo).
- `EntryDetailModal.tsx` y `MovementDetailModal.tsx` quedaron como envoltorios delgados (`Modal size="full"` + `MovementDetailView` + botón Cerrar). Mismas props y mismos puntos de uso (`Entries.tsx`, `MultiDetailMovement.tsx`), sin cambios allí.
- **Mejoras pequeñas y retrocompatibles a componentes compartidos** (`components/ui/index.tsx`): `Modal` acepta `size="full"` (`max-w-[94vw] lg:max-w-[80vw]`; los tamaños existentes no cambian) y `EmptyState` acepta `compact` (padding reducido; sin la prop se ve igual que antes).
- Estructura: 4 pestañas (Información · Líneas · Auditoría · Adjuntos), justificadas porque la tabla de líneas puede tener hasta 11 columnas y el historial/auditoría es lista aparte; el modal ya tenía header fijo, cuerpo con scroll interno, footer y bloqueo de scroll del body.

### Qué se muestra ahora (solo datos que existen)
- **Cabecera**: id (mono), tipo, documento (tipo + serie-número), estado (`MovementStatusBadge`), nº de ítems, versión, registrado por + fecha.
- **Información**: tipo, documento, fecha de registro, fecha de confirmación, registrado por, autorizado por (`authorizedBy` o resolutor de la `Authorization` aprobada), rechazado por y motivo del rechazo, responsable/solicitante, centro de costo, motivo, costo promedio resultante, ID de correlación, marca de movimiento sensible (+ nivel), proveedor externo (snapshot o vivo), observaciones (con `EmptyState` compacto si no hay).
- **Líneas**: #, SKU, producto, descripción del producto (`Product.description`, con wrapping controlado), unidad, cantidad, costo unitario, total de línea, lote/serie, vencimiento, origen, destino. Las columnas opcionales solo aparecen si alguna línea tiene ese dato. Números con `text-right tabular-nums`. **Totales**: "Ítems" y "Total del movimiento" (suma de las líneas, misma regla que `EntriesList`).
- **Auditoría**: progreso Borrador → Pendiente → Autorizado/Rechazado → Confirmado (mismo recorrido de antes, ahora con las fechas reales que se conocen), historial con actor/fecha/nota, y tabla de eventos del log de auditoría cuyo `object` contiene el id del movimiento o de su autorización.
- **Adjuntos**: evidencias de `state.evidences` con `movementId` o listadas en `evidenceIds` (nombre, tipo, tamaño, fecha, usuario; enlace solo si existe `url`). Si el movimiento declara `evidenceIds` sin archivo (caso de los movimientos creados desde el formulario), se avisa en una nota en vez de inventar un archivo.

### Campos pedidos que NO existen en el modelo (no se mostraron ni se simularon)
Moneda y tipo de cambio por movimiento (solo existe un parámetro global `currency` en Parámetros, no un campo de `Movement`); Subtotal, IGV, descuento e impuesto (no hay desglose: solo `totalCost`); toda la sección **Logística** (transportista, placa, conductor, guía de remisión, dirección de entrega, peso, volumen) — por eso la sección no se renderiza; usuario que **confirmó** el movimiento (solo existe `confirmedAt`); comentarios históricos por estado (no se almacenan); descripción propia de la línea (se usa la descripción del producto). Precio unitario existe como `unitCost` y se rotula "Costo unit.".

### Acciones del footer
Solo **Cerrar**. No existen hoy Imprimir, Exportar PDF ni Editar para movimientos ya registrados, y el encargo pide no inventarlas; el modal sigue siendo solo de consulta.

### Decisiones a tener presentes
- El vínculo movimiento ↔ eventos de auditoría es por coincidencia de texto en `AuditEvent.object` (`Movimiento MOV-…`, `MOV-…`, `AUTH …`), porque el evento no guarda una referencia estructurada. Es el único enlace real disponible; si se agrega `movementId` al evento conviene reemplazarlo.
- Los `PhysicalCount` (conteos) tienen su propio modal (`PhysicalCountDetailModal`) y no se tocaron.

### Verificación
Sin red, `pnpm` ni `esbuild` (mismo entorno de siempre): `ts.transpileModule` sobre todos los archivos nuevos/modificados sin diagnósticos; chequeo de tipos best-effort con `tsc` y React "stub" sin errores atribuibles a la lógica nueva (los errores restantes son de los tipos de React ausentes); prueba en Node de `buildHistory`/`buildProgress`/`formatBytes`/`lineValue` con datos del demo (movimiento aprobado y rechazado) con resultados correctos. **No verificado**: `pnpm build`, render en navegador, responsive real (1440/1280/1024/390/375), interacción de las pestañas. Pendiente ejecutar `pnpm install --frozen-lockfile && pnpm build` y revisar visualmente.
