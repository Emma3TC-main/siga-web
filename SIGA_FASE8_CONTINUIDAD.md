# SIGA WEB — FASE 8: Mejora y estandarización profesional de tablas

## Estado general

- **Bloque 1 — Sistema base**: **completado**.
- **Bloque 2 — Operaciones (Movimientos, Entradas, Salidas, Transferencias, Ajustes, Inventario)**: **completado**.
- **Bloque 3 — Catálogo (Productos, Unidades, Proveedores)**: **completado**.
- **Bloque 4 — Administración (Auditoría, Usuarios)**: **completado** (esta sesión). Incluye el pendiente real que venía arrastrándose desde el Bloque 1 (vista mobile de `Audit.tsx`).
- **Bloque 5 — Centro de Reportes**: **completado** (esta sesión). Con esto los 5 bloques de la Fase 8 están implementados; queda pendiente únicamente la verificación real (`pnpm build` + revisión visual en navegador), imposible en este entorno.

**Nota importante**: dado que las 2 inconsistencias reales encontradas en el Bloque 1 (botones de acción sin estandarizar, columnas de Estado/Acciones sin centrar) estaban presentes en *todos* los módulos objetivo, se corrigieron de una vez en las tablas de Operaciones, Catálogo y Administración que ya existían, como parte del propio Bloque 1 (arreglo del sistema base + su aplicación inmediata). Esto no reemplaza los Bloques 2–5: cada uno debe revisarse igual en su momento por si quedan inconsistencias *específicas* de su módulo (densidad, columnas particulares, estados propios, etc.) no relacionadas con el sistema base.

---

## Bloque 1 — Sistema base: análisis y cambios aplicados esta sesión

### Análisis

Se revisó `src/index.css` (clases `.siga-table`, `.siga-card`, `.siga-input`, etc.) y `src/presentation/components/ui/index.tsx` (Button, Badge, InventoryStatusBadge, MachineryStatusBadge, MovementStatusBadge, PageHeader, EmptyState, TableSkeleton, iconos). Conclusión: **no existe** un componente de tabla compartido (`DataTable`/`TableActions`); cada módulo repite `<table className="siga-table">` con su propio marcado, reutilizando ya bastante bien las clases y badges compartidos existentes.

Se hizo un barrido (`grep`) de las 8 tablas reales dentro del alcance de esta fase (Operaciones: `InventoryTable.tsx`, `EntriesList.tsx`, `MovementsList.tsx` — esta última cubre Salidas/Transferencias/Ajustes con el mismo componente vía `MultiDetailModeConfig`; Catálogo: `ProductsTable.tsx`, `SuppliersTable.tsx`, `Units.tsx`; Administración: `Users.tsx`, `Audit.tsx`; Reportes: 5 vistas en `reports/components/`, de solo lectura, sin columna de acciones) contra los 29 criterios del encargo. Se encontraron 2 inconsistencias reales y sistemáticas, presentes en casi todos los módulos:

1. **Botones de acción sin estandarizar**: convivían `p-1` (Productos, Proveedores, Inventario, Usuarios, Auditoría) y `p-2`/`p-2.5` (Entradas, Movimientos); tamaños de ícono 14 vs 16; colores de hover distintos (`hover:bg-[#6FD1D7]/20` vs `hover:bg-[#3B7597]/10`); tooltip/`aria-label` presente solo en Proveedores y en los botones "Ver" de Entradas/Movimientos, ausente en el resto.
2. **Columnas "Estado" y "Acciones" sin centrar** (punto 8 del encargo original: "Estados → centro", "Acciones → centro"): en Productos, Proveedores, Inventario, Usuarios, Auditoría, Entradas y Movimientos, el badge de estado y el/los botón(es) de acción quedaban alineados a la izquierda de su celda por ser el comportamiento por defecto de `<td>`, sin ninguna clase de centrado.

Las tablas de **Reportes** (`CostCenterReportView.tsx`, `ValuationReportView.tsx`, `InventoryReportView.tsx`, `MovementFlowReportView.tsx`, `ReplenishmentReportView.tsx`) y **`Units.tsx`** ya usaban alineación numérica correcta en su mayoría; `RolesPermissions.tsx` sigue con su matriz propia fuera de `.siga-table` (decisión ya documentada e intencional desde la Fase 7, reconfirmada, no se tocó). Machinery (tabla de historial de movimientos en su modal) **no forma parte del alcance declarado de esta fase** (no está en la lista de Operaciones/Catálogo/Administración/Reportes del encargo) — no se tocó, para no ampliar el alcance.

### Cambios aplicados

**1. Nuevo componente compartido — `TableActionButton`** (`src/presentation/components/ui/index.tsx`):
Botón "ghost" estándar para columnas de acciones: `p-1.5`, `rounded-md`, transición de color, foco visible (`focus-visible:ring-2`), `disabled` con opacidad reducida, y **siempre** `title` + `aria-label` a partir de un prop `label` obligatorio (antes solo Proveedores tenía tooltip). Cuatro variantes de color reutilizando la paleta ya definida en SIGA (ninguna nueva): `default` (`text-[#3B7597]`, igual que antes), `success` (verde esmeralda, ya usado para "ir a entradas"), `warning` (ámbar, ya usado para "desactivar"), `danger` (rojo, ya usado para "ir a salidas"). No se agregó ninguna librería ni color fuera de la paleta existente.

**2. Reemplazo de botones ad-hoc por `TableActionButton`**, sin cambiar ninguna función que reciben (`onView`, `onEdit`, `onGoEntries`, `onToggleStatusRequest`, etc.) ni agregar/quitar acciones:
- `catalog/products/components/ProductsTable.tsx` (Ver, Editar)
- `catalog/suppliers/components/SuppliersTable.tsx` (Ver, Editar, Activar/Desactivar — este último pasó de un botón manual con clases inline a `variant="warning"`/`variant="success"` según estado, mismo color que antes)
- `inventory/components/InventoryTable.tsx` (Ver, Ir a entradas, Ir a salidas, Ir a transferencias — en la fila desktop **y** en la tarjeta mobile, que tenía el mismo bloque duplicado)
- `admin/Users.tsx` (Ver perfil, Editar — en la fila desktop **y** en la tarjeta mobile)
- `audit/Audit.tsx` (Ver detalle)
- `movements/entries/components/EntriesList.tsx` (Ver — antes `p-2`/ícono 16, ahora igual que el resto de la app)
- `movements/multi-detail/components/MovementsList.tsx` (Ver — mismo caso que Entradas, cubre Salidas/Transferencias/Ajustes)

**3. Centrado de columnas "Estado" y "Acciones"** (header `text-center` + celda `text-center` + wrapper `flex justify-center` cuando hay más de un botón) en los mismos 7 archivos de arriba. Ningún header estaba etiquetado "Acciones" salvo Inventario; se agregó el texto "Acciones" a los `<th>` vacíos de Productos, Proveedores, Usuarios, Auditoría, Entradas y Movimientos para que el encabezado describa la columna (esto es texto de interfaz, no un dato ni una funcionalidad — no se agregó ninguna acción nueva).

**4. Ajuste menor de alineación numérica**: `catalog/Units.tsx`, columna "Productos" (conteo de productos por unidad) pasó de sin alinear a `text-right tabular-nums`, siguiendo la convención ya usada en el resto de la app para columnas numéricas.

### Lo que NO se tocó (evaluado y descartado correctamente)

- Ninguna lógica de filtros, búsqueda, paginación, RBAC, cálculos ni llamadas a datos — solo clases CSS y el componente de botón.
- `RolesPermissions.tsx` (matriz de permisos, fuera de `.siga-table` por diseño, ya evaluado en Fase 7).
- Tablas de Reportes: no tienen columna de acciones ni badges de estado que centrar; su alineación numérica ya estaba correcta.
- `Audit.tsx` no tiene vista de tarjetas mobile (a diferencia de Productos/Proveedores/Inventario/Usuarios) — es una inconsistencia de responsive real, pero es un cambio estructural más grande (agregar una vista nueva, no solo estandarizar estilos), por lo que se dejó para el Bloque 4 (Administración) en vez de mezclarlo en el Bloque 1. Ver "Próxima acción".
- Machinery.tsx: fuera del alcance declarado de la Fase 8, no se tocó.

### Verificación

Entorno sin red (`curl` a `registry.npmjs.org` → `403 Forbidden`, mismo motivo de todas las sesiones de Fase 7) y sin `pnpm` instalado. Se usó el mismo par de verificaciones-sustituto de las sesiones anteriores:

1. **Sintaxis real** de los 9 archivos tocados con `ts.transpileModule` (JSX `react-jsx`, ES2020) — **0 diagnósticos** en los 9.
2. **Grafo de imports completo de toda la aplicación** con `esbuild.build({ bundle: true, entryPoints: ['src/main.tsx'] })`, alias `@` → `src`, CSS stubeado, externalizando `react`/`react-dom`/`react-dom/client`/`react-router-dom`/`recharts` — **build OK, ~705 KB, 0 warnings** (línea base de Fase 7 al cierre del Bloque 4: 599.7 KB; el incremento es coherente con el nuevo componente `TableActionButton` reemplicado en 7 archivos).
3. **Imports muertos**: se contó cada ícono/`TableActionButton`/`Badge` reemplazado en los 7 archivos de acciones — todos aparecen ≥2 veces (import + uso), ningún import quedó sin usar.
4. **No se pudo verificar**: `pnpm install --frozen-lockfile && pnpm build` real, ni revisión visual en navegador (mismo motivo de red/entorno gráfico de todas las sesiones anteriores de este proyecto).

### Pendiente real (no resuelto por falta de entorno)
- Ejecutar `pnpm install --frozen-lockfile && pnpm build` en un entorno con red y registrar aquí el resultado real.
- Revisión visual real en navegador (desktop 1440×900/1280×800/1024×768, mobile 390×844/375×812) del punto 20 del encargo original.

### Próxima acción exacta

La próxima sesión de Fase 8 debe continuar con el **Bloque 3 — Catálogo** (Productos, Unidades, Proveedores): revisar `ProductsTable.tsx`, `SuppliersTable.tsx` y `Units.tsx` por inconsistencias *específicas* del módulo (el sistema base, botones y alineación ya quedaron cerrados en el Bloque 1; truncado de texto largo y `tabular-nums` ya se revisaron en Operaciones en el Bloque 2 — verificar si Catálogo tiene el mismo problema de nombres largos sin `truncate`/`max-width` y aplicar `tabular-nums` a sus columnas numéricas si corresponde, siguiendo el mismo criterio). Después, Bloque 4 (Administración) debe: (a) revisar `Audit.tsx`/`Users.tsx` por inconsistencias específicas del módulo con el mismo criterio, y (b) resolver el pendiente ya documentado de agregar vista de tarjetas mobile a `Audit.tsx`. Si hay red disponible en cualquier sesión futura: ejecutar `pnpm install --frozen-lockfile && pnpm build` y reemplazar las verificaciones "de sustituto" por la confirmación definitiva.

---

## Bloque 2 — Operaciones (Movimientos, Entradas, Salidas, Transferencias, Ajustes, Inventario): análisis y cambios aplicados esta sesión

### Análisis

Las 3 tablas reales de Operaciones (`InventoryTable.tsx`; `EntriesList.tsx` para Entradas; `MovementsList.tsx`, que cubre Salidas/Transferencias/Ajustes mediante `MultiDetailModeConfig`, ya identificadas en el Bloque 1) ya tenían el sistema base correcto (headers, padding, hover, sticky, botones de acción, centrado de Estado/Acciones — todo del Bloque 1). Se revisaron específicamente contra los puntos 8, 9 y 17 del encargo de Fase 8 ("los números deben formar columnas visualmente alineadas... `tabular-nums`"; "no permitas que [texto largo] destruya la estructura de la tabla... `truncate`/`max-width`") comparando cada tabla contra sí misma y entre sí. Se encontraron 3 inconsistencias reales:

1. **Texto largo sin controlar en columnas de nombre/ruta**: a diferencia de `InventoryTable.tsx` (que ya limitaba "Producto" y "Categoría" con `max-w truncate`), las columnas "Detalle" (nombre de producto) y "Registrado por" de `EntriesList.tsx`, y "Tipo / detalle" (nombre de producto) y "Origen / destino" (nombres de ubicación concatenados con "→") de `MovementsList.tsx`, no tenían ningún límite de ancho — un nombre de producto o de ubicación largo podía romper la altura uniforme de la fila y desalinear el resto de columnas.
2. **Columnas numéricas sin `tabular-nums`**: las columnas "Ítems" y "Costo total"/"Valor" de las 3 tablas usaban `text-right` (alineación ya correcta desde el Bloque 1) pero no `tabular-nums`, por lo que los dígitos no quedaban alineados verticalmente entre filas — el único precedente en toda la app era la columna "Productos" de `Units.tsx` (Catálogo, ajuste del propio Bloque 1).
3. **Columna "Documento" con presentación distinta entre tablas hermanas**: en `EntriesList.tsx` el tipo de documento va en `<div className="font-medium">`; en `MovementsList.tsx` iba como texto plano sin envolver, junto al número de documento en la misma celda — mismo dato, misma columna conceptual, presentación ligeramente distinta entre dos tablas que deben sentirse parte del mismo sistema (punto 5 del encargo).

Se revisó también si existían otras tablas dentro de Operaciones no cubiertas por el conteo de "8 tablas reales" del Bloque 1: dentro de `movements/` existen además `MovementDetailModal.tsx`, `EntryDetailModal.tsx`, `MovementSummaryStep.tsx`, `EntrySummaryStep.tsx`, `PhysicalCountDetailModal.tsx` y `NewPhysicalCountModal.tsx`, todas con su propio `<table>` — se mantiene el criterio de alcance ya fijado en el Bloque 1 (y heredado de la Fase 7): son vistas de detalle/resumen dentro de modales y wizards, no la "tabla" principal del módulo, y no forman parte de la lista de tablas reales identificada en el Bloque 1. No se tocaron, para no ampliar el alcance sin que el usuario lo pida explícitamente.

### Cambios aplicados

**1. `truncate` + `max-width` en columnas de texto largo** (sin tocar ningún dato, solo la celda que lo envuelve):
- `EntriesList.tsx`: "Detalle" (nombre de producto y su línea secundaria) → `max-w-[220px] truncate`; "Registrado por" → `max-w-[140px] truncate`.
- `MovementsList.tsx`: "Tipo / detalle" (nombre de producto y su línea secundaria) → `max-w-[200px] truncate`; "Origen / destino" → `max-w-[180px] truncate`.

**2. `tabular-nums` en columnas numéricas** (además de la alineación `text-right` ya existente desde el Bloque 1), en las 3 tablas:
- `InventoryTable.tsx`: "Stock total", "Mínimo", "C. promedio", "Valorización".
- `EntriesList.tsx`: "Ítems", "Costo total".
- `MovementsList.tsx`: "Ítems", "Valor".

**3. Unificación de la columna "Documento"** en `MovementsList.tsx`: el tipo de documento se envolvió en `<div className="font-medium">`, igual que en `EntriesList.tsx`, dejando ambas tablas con la misma presentación para el mismo tipo de dato.

Archivos modificados:
- `src/presentation/pages/inventory/components/InventoryTable.tsx` (4 clases `tabular-nums` agregadas; vista desktop únicamente — la tarjeta mobile no sufre el mismo problema de alineación de columnas)
- `src/presentation/pages/movements/entries/components/EntriesList.tsx` (`truncate`/`max-width` en 2 columnas + `tabular-nums` en 2 columnas; vista desktop únicamente)
- `src/presentation/pages/movements/multi-detail/components/MovementsList.tsx` (`truncate`/`max-width` en 2 columnas + `tabular-nums` en 2 columnas + unificación de "Documento"; vista desktop únicamente)

### Lo que NO se tocó (evaluado y descartado correctamente)

- Las vistas de tarjetas mobile de las 3 tablas: el problema de texto largo es específico de la estructura rígida de una tabla (columnas alineadas, altura de fila uniforme); una tarjeta ya envuelve el texto libremente sin romper ningún alineamiento, así que no aplica el mismo ajuste ahí.
- La etiqueta "Costo total" (Entradas) vs. "Valor" (Salidas/Transferencias/Ajustes): es una diferencia de nomenclatura de negocio (costo incurrido al ingresar stock vs. valor de stock existente que se mueve), no una inconsistencia visual — no se unificó el texto.
- Modales de detalle/resumen (`MovementDetailModal.tsx`, `EntryDetailModal.tsx`, `MovementSummaryStep.tsx`, `EntrySummaryStep.tsx`, `PhysicalCountDetailModal.tsx`, `NewPhysicalCountModal.tsx`): fuera del alcance de "tablas reales" ya fijado en el Bloque 1, no se tocaron.
- Ninguna lógica de filtros, paginación, cálculos (`movementLines`, `routeLabel`, `formatCurrency`) ni datos — solo clases CSS.

### Verificación

Mismo entorno sin red (`npm install`/`npm ping` → `403 Forbidden`) y sin `pnpm` instalado; a diferencia del Bloque 1, en esta sesión tampoco estuvo disponible `esbuild` (ni suelto ni vía `npx`), así que no se pudo repetir la verificación de grafo de imports completo de esa sesión. Se usó el mismo verificador de sintaxis de las sesiones de Fase 7:
1. **Sintaxis real** de los 3 archivos tocados con `ts.transpileModule` (JSX `react-jsx`, ES2020) — **0 diagnósticos** en los 3.
2. **Balance de etiquetas**: conteo de `<div`/`</div>` y `<td`/`</td>` en los 3 archivos — coinciden exactamente (`InventoryTable`: 20/20 div, 12/12 td; `EntriesList`: 12/12 div, 9/9 td; `MovementsList`: 13/13 div, 9/9 td).
3. **Revisión manual campo por campo**: se confirmó que ninguna columna, dato ni handler (`onSelectProduct`, `onView`, `movementLines`, `routeLabel`) cambió — solo se agregaron clases a los `<td>`/`<div>` existentes.
4. **No se pudo verificar**: grafo de imports con `esbuild` (no disponible en esta sesión, sí lo estuvo en la del Bloque 1), `tsc --strict` completo, `pnpm build` real, ni revisión visual en navegador.

### Pendiente real (no resuelto por falta de entorno)
- Ejecutar `pnpm install --frozen-lockfile && pnpm build` en un entorno con red y registrar aquí el resultado real.
- Revisión visual real en navegador (desktop 1440×900/1280×800/1024×768, mobile 390×844/375×812) del punto 20 del encargo original — en particular confirmar que los nuevos `max-w-[...]` elegidos (140–220px) no cortan textos legítimamente cortos ni dejan demasiado espacio en blanco en pantallas anchas.

### Próxima acción exacta

La próxima sesión de Fase 8 debe continuar con el **Bloque 3 — Catálogo** (Productos, Unidades, Proveedores): revisar `ProductsTable.tsx`, `SuppliersTable.tsx` y `Units.tsx` por inconsistencias *específicas* del módulo (el sistema base, botones y alineación ya quedaron cerrados en el Bloque 1; truncado de texto largo y `tabular-nums` ya se revisaron en Operaciones en el Bloque 2 — verificar si Catálogo tiene el mismo problema de nombres largos sin `truncate`/`max-width` y aplicar `tabular-nums` a sus columnas numéricas si corresponde, siguiendo el mismo criterio). Después, Bloque 4 (Administración) debe: (a) revisar `Audit.tsx`/`Users.tsx` por inconsistencias específicas del módulo con el mismo criterio, y (b) resolver el pendiente ya documentado de agregar vista de tarjetas mobile a `Audit.tsx`. Si hay red disponible en cualquier sesión futura: ejecutar `pnpm install --frozen-lockfile && pnpm build` y reemplazar las verificaciones "de sustituto" por la confirmación definitiva.

---

## Bloque 3 — Catálogo (Productos, Unidades, Proveedores): análisis y cambios aplicados esta sesión

### Análisis

Las 3 tablas reales de Catálogo (`ProductsTable.tsx`, `SuppliersTable.tsx`, `Units.tsx`, ya identificadas en el Bloque 1) ya tenían el sistema base correcto (headers, padding, hover, botones de acción, centrado de Estado/Acciones). Se revisaron con el mismo criterio aplicado en el Bloque 2 (puntos 8, 9 y 17 del encargo: alineación numérica con `tabular-nums`, control de texto largo con `truncate`/`max-width`). Se encontraron 2 inconsistencias reales:

1. **Mismo dato mostrado de forma distinta entre módulos**: la columna "Producto" de `ProductsTable.tsx` muestra exactamente el mismo campo (`p.name`) que la columna "Producto" de `InventoryTable.tsx` (Operaciones) — pero mientras Inventario ya lo limitaba con `max-w-[180px] truncate` (desde la Fase 7), el propio catálogo de Productos lo dejaba sin ningún límite. Mismo caso con "Categoría" (`cat?.name`, sin `truncate` en Productos, sí en Inventario). En `SuppliersTable.tsx`, "Razón social", "Nombre comercial", "Contacto" y "Correo" (nombre legal, nombre comercial, contacto y email — los 4 campos de texto libre más propensos a ser largos en datos reales de proveedores) tampoco tenían ningún límite.
2. **Columnas numéricas sin `tabular-nums`**: "Stock", "Costo prom." y "Valoriz." de `ProductsTable.tsx` ya usaban `text-right` (correcto desde antes) pero no `tabular-nums`, igual que el patrón ya corregido en Operaciones (Bloque 2). `SuppliersTable.tsx` no tiene columnas numéricas (no aplica). `Units.tsx` ya tenía `tabular-nums` en su única columna numérica desde el propio Bloque 1 — no se tocó.

### Cambios aplicados

**1. `truncate` + `max-width`** (sin tocar ningún dato):
- `ProductsTable.tsx`: "Producto" (nombre) → `max-w-[220px] truncate`; "Categoría" → `max-w-[140px] truncate`.
- `SuppliersTable.tsx`: "Razón social" → `max-w-[200px] truncate`; "Nombre comercial" → `max-w-[160px] truncate`; "Contacto" (nombre de contacto) → `max-w-[140px] truncate`; "Correo" → `max-w-[180px] truncate`. También en su tarjeta mobile: el contenedor de texto pasó a `min-w-0` y el nombre/RUC-contacto a `truncate` (mismo ajuste que ya tenían las tarjetas mobile de `ProductsTable.tsx`/`InventoryTable.tsx`, pero que a esta tabla nunca se le había aplicado) — sin esto, un nombre de proveedor muy largo podía empujar visualmente el badge de estado fuera de su sitio en la tarjeta.

**2. `tabular-nums`** en `ProductsTable.tsx`: "Stock", "Costo prom.", "Valoriz." (vista desktop).

Archivos modificados:
- `src/presentation/pages/catalog/products/components/ProductsTable.tsx` (2 columnas con `truncate`/`max-width` + 3 con `tabular-nums`; vista desktop únicamente)
- `src/presentation/pages/catalog/suppliers/components/SuppliersTable.tsx` (4 columnas desktop con `truncate`/`max-width` + ajuste `min-w-0`/`truncate` en la tarjeta mobile)

### Lo que NO se tocó (evaluado y descartado correctamente)

- `Units.tsx`: su tabla no tiene vista de tarjetas mobile (solo `overflow-auto` con scroll horizontal dentro de un `siga-card`) — a diferencia de Productos/Proveedores/Inventario/Usuarios. **No se agregó una vista mobile nueva**: el propio encargo de Fase 8 (punto 20) dice explícitamente "No conviertas automáticamente todas las tablas en cards... el scroll horizontal controlado puede ser la solución correcta", y la tabla de Units es pequeña (6 columnas, datos cortos: código, nombre, grupo, badge, factor de conversión, conteo) — el scroll horizontal ya es una solución razonable aquí, no una inconsistencia a corregir. Columnas "Nombre" y "Grupo" de `Units.tsx` tampoco se les agregó `truncate`: son catálogos controlados de vocabulario corto (unidades de medida, grupos como "Cantidad"/"Peso"/"Volumen"), sin evidencia real de textos largos — el encargo pide no "arreglar" algo que no está roto (punto 24: no agregar cambios porque "parezca que falta algo").
- No se agregó ningún atributo `title` (tooltip nativo) a las celdas truncadas: se mantuvo el mismo criterio ya usado en el Bloque 2 (Operaciones) — el acceso al detalle completo ya existe vía "Ver detalle"/clic en la fila o tarjeta, que es la "forma razonable de consultarla" que pide el punto 17 del encargo; se prefirió consistencia entre bloques a agregar un mecanismo nuevo solo en Catálogo.
- Ninguna lógica de filtros, búsqueda, `getStock`, `createUnit`, permisos (`canEdit`/`canCreate`) ni datos — solo clases CSS.

### Verificación

Mismo entorno sin red (`403 Forbidden`) y sin `pnpm`/`esbuild` disponibles esta sesión (igual que en el Bloque 2). Se usó el mismo verificador de sintaxis:
1. **Sintaxis real** de los 2 archivos tocados con `ts.transpileModule` — **0 diagnósticos**.
2. **Balance de etiquetas**: `ProductsTable.tsx` 13/13 `<div>`, 9/9 `<td>`; `SuppliersTable.tsx` 12/12 `<div>`, 8/8 `<td>` — coinciden exactamente.
3. **Revisión manual campo por campo**: se confirmó que las 9 columnas de `ProductsTable.tsx` y las 8 de `SuppliersTable.tsx` (incluidas sus 2–3 acciones por fila) siguen presentes sin cambios de props ni de los handlers (`onView`, `onEdit`, `onToggleStatusRequest`, `getStock`).
4. **No se pudo verificar**: grafo de imports con `esbuild`, `tsc --strict` completo, `pnpm build` real, ni revisión visual en navegador.

### Pendiente real (no resuelto por falta de entorno)
- Ejecutar `pnpm install --frozen-lockfile && pnpm build` en un entorno con red y registrar aquí el resultado real.
- Revisión visual real en navegador de los nuevos `max-w-[...]` (140–220px) en Productos y Proveedores, igual que quedó pendiente para Operaciones en el Bloque 2.

### Próxima acción exacta

La próxima sesión de Fase 8 debe continuar con el **Bloque 4 — Administración** (Auditoría, Usuarios):
1. Revisar `Audit.tsx` y `Users.tsx` por inconsistencias *específicas* del módulo con el mismo criterio ya aplicado en Bloques 2 y 3 (texto largo sin `truncate`/`max-width`, columnas numéricas sin `tabular-nums` si las hay, presentación de datos equivalentes entre ambas tablas).
2. Resolver el pendiente ya documentado en el Bloque 1: agregar vista de tarjetas mobile a `Audit.tsx` (a diferencia de Units.tsx, esto sí se identificó como una inconsistencia real desde el Bloque 1, no una decisión de diseño — ver esa sección).
3. No repetir el análisis de los Bloques 1, 2 y 3 — ya está hecho y documentado arriba.
4. Si hay red disponible en cualquier sesión futura: ejecutar `pnpm install --frozen-lockfile && pnpm build` y reemplazar las verificaciones "de sustituto" por la confirmación definitiva.

---

## Bloque 4 — Administración (Auditoría, Usuarios): análisis y cambios aplicados esta sesión

### Análisis

Las 2 tablas reales de Administración (`Audit.tsx`, `Users.tsx`, ya identificadas en el Bloque 1) ya tenían el sistema base correcto (headers, padding, hover, `TableActionButton`, centrado de Estado/Acciones — Bloque 1). `Audit.tsx` ya traía `truncate`/`max-width` en "Objeto" y "Descripción" desde antes de Fase 8 — no se tocaron. Se revisó con el mismo criterio de los Bloques 2 y 3 (puntos 8, 9 y 17: `tabular-nums`, `truncate`/`max-width`) más el pendiente real ya registrado en el Bloque 1. Se encontraron 3 inconsistencias reales:

1. **Pendiente ya documentado — `Audit.tsx` sin vista mobile**: a diferencia de `Users.tsx` (y de Productos/Proveedores/Inventario), la tabla de Auditoría (10 columnas: Fecha, Hora, Usuario, Acción, Módulo, Objeto, Descripción, IP, Resultado, Acciones) solo tenía scroll horizontal dentro de `flex-1 overflow-auto`, sin ningún bloque `md:hidden`. A diferencia de `Units.tsx` (Bloque 3, donde se decidió dejar el scroll horizontal por ser una tabla pequeña de vocabulario corto), esta sí es una tabla densa de datos textuales variables (nombres, descripciones libres) — el propio Bloque 1 ya la había marcado como una inconsistencia real, no una decisión de diseño.
2. **Columnas "Usuario"/"Email"/"Área-Alcance" sin `truncate`** en `Users.tsx`: mismo patrón ya corregido en Operaciones y Catálogo — nombre completo, email y alcance/área son campos de texto libre sin ningún límite de ancho.
3. **Columna "Usuario" sin `truncate`** en `Audit.tsx` (nombre + email del usuario que generó el evento) — mismo campo conceptual que el punto anterior, mismo ajuste.

`Users.tsx` no tiene columnas numéricas (no aplica `tabular-nums`). No se encontraron más inconsistencias en ninguna de las 2 tablas.

### Cambios aplicados

**1. Nueva vista de tarjetas mobile en `Audit.tsx`** (`md:hidden`, mismo patrón `siga-card` usado en el resto de la app): cada tarjeta muestra fecha/hora, usuario (nombre + email, con `truncate`), badge de resultado, badge de acción + módulo + objeto (código, con `truncate`) y la descripción (con `truncate`). Se tocan la tarjeta para abrir el mismo modal de detalle que ya existía (`setSelected(event.id)`) — no se creó ningún modal ni handler nuevo. **Se omitió deliberadamente la columna "IP"** en la tarjeta (dato de menor prioridad para el escaneo rápido en mobile, igual que otras tarjetas de la app ya omiten columnas secundarias de la vista desktop) — sigue disponible al tocar la tarjeta, que abre el modal de detalle con los 10 campos completos, cumpliendo el punto 17 del encargo ("no ocultes información importante sin una forma razonable de consultarla"). La tabla desktop original se dejó intacta, solo envuelta en `hidden md:block`.
2. **`truncate` + `max-width`** (sin tocar ningún dato):
   - `Users.tsx`: "Usuario" (nombre) → `max-w-[180px] truncate`; "Email" → `max-w-[180px] truncate`; "Área / Alcance" → `max-w-[140px] truncate`.
   - `Audit.tsx`: "Usuario" (nombre + email) → contenedor `max-w-[160px] truncate` con `truncate` en cada línea interna.

Archivos modificados:
- `src/presentation/pages/audit/Audit.tsx` (tabla envuelta en `hidden md:block` + bloque nuevo `md:hidden` con tarjetas + `truncate` en columna "Usuario" de la tabla desktop)
- `src/presentation/pages/admin/Users.tsx` (3 columnas con `truncate`/`max-width` en la tabla desktop; su tarjeta mobile ya tenía `truncate` desde la Fase 7, no se tocó)

### Lo que NO se tocó (evaluado y descartado correctamente)

- "Objeto" y "Descripción" de `Audit.tsx`: ya tenían `truncate`/`max-width` desde antes de la Fase 8 — no se modificaron.
- La tarjeta mobile de `Users.tsx`: ya tenía `min-w-0`/`truncate` correctamente aplicados (Fase 7) — no se tocó, solo la tabla desktop.
- Ninguna lógica de filtros (`filterAuditEvents`, `filterUsers`), permisos (`canManage`), handlers (`toggleStatus`, `openEdit`, `setSelected`, `setDetailId`) ni datos — solo clases CSS y el nuevo bloque de tarjetas (que reutiliza handlers ya existentes, no crea ninguno).

### Verificación

Mismo entorno sin red (`403 Forbidden`) y sin `pnpm`/`esbuild` disponibles esta sesión (igual que en los Bloques 2 y 3). Se usó el mismo verificador de sintaxis:
1. **Sintaxis real** de los 2 archivos tocados con `ts.transpileModule` — **0 diagnósticos**.
2. **Balance de etiquetas**: `Audit.tsx` 23/23 `<div>`, 10/10 `<td>`, 1/1 `<button>`; `Users.tsx` 34/34 `<div>`, 7/7 `<td>`, 2/2 `<button>` — coinciden exactamente.
3. **Sin botón anidado**: se revisó explícitamente que el `<button>` de la tarjeta mobile de `Audit.tsx` no contenga ningún otro `<button>`/`TableActionButton` dentro (lección de un bug ya corregido en Fase 7) — solo contiene `<div>`/`<span>`, sin controles interactivos anidados.
4. **`truncate` en contenedor flex**: se verificó que los `<span>` de acción/módulo/objeto en la tarjeta mobile de `Audit.tsx` tuvieran `min-w-0` (los dos primeros con `flex-shrink-0`, el de "Objeto" con `min-w-0 truncate`) — sin esto, `truncate` no funciona dentro de un contenedor `flex` porque el ítem no se encoge por debajo de su contenido por defecto.
5. **Revisión manual campo por campo**: se confirmó que los 10 campos de `Audit.tsx` siguen presentes en la tabla desktop (incluida "IP", que se omitió deliberadamente solo en la tarjeta mobile, con acceso vía el mismo modal de detalle) y que las 7 columnas de `Users.tsx` no perdieron ningún dato ni acción.
6. **No se pudo verificar**: grafo de imports con `esbuild`, `tsc --strict` completo, `pnpm build` real, ni revisión visual en navegador.

### Pendiente real (no resuelto por falta de entorno)
- Ejecutar `pnpm install --frozen-lockfile && pnpm build` en un entorno con red y registrar aquí el resultado real.
- Revisión visual real en navegador de la nueva vista mobile de `Audit.tsx` y de los `max-w-[...]` agregados en `Users.tsx`/`Audit.tsx`, igual que quedó pendiente para Operaciones y Catálogo.

### Próxima acción exacta

Con esto quedan **completados los Bloques 1 a 4** de la Fase 8. La próxima sesión debe continuar con el **Bloque 5 — Centro de Reportes**:
1. Identificar primero las tablas reales que existen dentro de Reportes — el Bloque 1 ya las localizó: 5 vistas en `reports/components/` (`CostCenterReportView.tsx`, `ValuationReportView.tsx`, `InventoryReportView.tsx`, `MovementFlowReportView.tsx`, `ReplenishmentReportView.tsx`), de solo lectura, sin columna de acciones, con alineación numérica ya correcta en su mayoría (confirmado en el Bloque 1). Empezar releyendo esa nota antes de reanalizar desde cero.
2. Aplicar el mismo criterio ya usado en Bloques 2-4: buscar específicamente texto largo sin `truncate`/`max-width` y columnas numéricas sin `tabular-nums`, sin asumir que ya están resueltas solo porque el Bloque 1 las revisó de forma general.
3. Al cerrar el Bloque 5, la Fase 8 queda completa según el criterio de finalización del propio encargo (punto 28) — se debe hacer un repaso final antes de darla por cerrada.
4. No repetir el análisis de los Bloques 1, 2, 3 y 4 — ya está hecho y documentado arriba.
5. Si hay red disponible en cualquier sesión futura: ejecutar `pnpm install --frozen-lockfile && pnpm build` y reemplazar las verificaciones "de sustituto" por la confirmación definitiva.


---

## Bloque 5 — Centro de Reportes: análisis y cambios aplicados esta sesión

### Análisis

Las 5 tablas reales (`CostCenterReportView.tsx`, `ValuationReportView.tsx`, `InventoryReportView.tsx`, `MovementFlowReportView.tsx`, `ReplenishmentReportView.tsx`) son de solo lectura y sin columna de acciones. `PlaceholderReportView.tsx`, `ReportsCatalog.tsx` y `ReportDetailHeader.tsx` no contienen tablas — no se tocaron. Contenedor: todas se renderizan dentro de `flex-1 overflow-auto p-6` de `Reports.tsx`, así que el scroll horizontal ya queda contenido (no hay overflow accidental de página) y **no se agregaron vistas de tarjetas** (punto 20 del encargo: el scroll controlado es válido para tablas de reporte). Tampoco se agregaron `siga-card` contenedores (punto 12: evitar contenedores innecesarios). Inconsistencias reales encontradas:

1. **Corrección de una afirmación errónea del Bloque 1**: el Bloque 1 dijo que las tablas de Reportes "no tienen ... badges de estado que centrar". Es incorrecto: `InventoryReportView.tsx` tiene la columna "Estado" y `ReplenishmentReportView.tsx` la columna "Urgencia", ambas con `<Badge>` alineado a la izquierda, contradiciendo la regla de "Estados → centro" (punto 8) que sí se aplicó en Operaciones/Catálogo/Administración.
2. **Ninguna columna numérica tenía `tabular-nums`** (las 5 tablas, `text-right` ya correcto).
3. **Texto largo sin `truncate`/`max-width`**: nombre de producto (Inventario, Valorización, Reposición), categoría (Inventario) y centro de costo (Consumo por CC).

### Cambios aplicados (solo clases CSS, ningún dato/columna/cálculo)

- `InventoryReportView.tsx`: "Estado" (th + td) centrado; nombre `max-w-[220px] truncate`; categoría `max-w-[140px] truncate`; `tabular-nums` en Stock, C. Promedio, Valorización y el total del `tfoot`.
- `ReplenishmentReportView.tsx`: "Urgencia" (th + td) centrado; nombre `max-w-[220px] truncate`; `tabular-nums` en Stock actual, Stock mínimo y Diferencia.
- `ValuationReportView.tsx`: nombre `max-w-[220px] truncate`; `tabular-nums` en Cantidad, C. Promedio, Valorización y % del total.
- `MovementFlowReportView.tsx`: `tabular-nums` en N° Entradas, N° Salidas, Valor entradas, Valor salidas.
- `CostCenterReportView.tsx`: centro de costo `max-w-[240px] truncate`; `tabular-nums` en N° Movimientos y Valor consumido.

### Lo que NO se tocó
- Colores semánticos existentes (verde/rojo en flujo, rojo en reposición) y la caja ámbar de aviso de Reposición.
- Ninguna lógica de `reportRules`, filtros, exportación ni datos.

### Verificación
Mismo entorno sin red (`403`), sin `pnpm` ni `esbuild`:
1. `ts.transpileModule` sobre los 8 archivos de `reports/components/` — 0 diagnósticos.
2. Balance `<td>`/`</td>`: coincide en todos salvo `InventoryReportView.tsx` (11/10), diferencia explicada por un `<td ... />` autocerrado preexistente en el `tfoot` (no introducido en esta sesión).
3. Cada edición se aplicó con reemplazo exacto verificado (una sola coincidencia por cadena), sin pérdida de columnas.
4. **No verificado**: `tsc --strict`, `pnpm build`, grafo de imports con `esbuild`, render en navegador.

### Cierre de Fase 8 y pendientes reales
- Bloques 1–5 implementados. Criterio del punto 28: consistencia de headers/alineación/`tabular-nums`/`truncate`/estados centrados aplicada en las 16 tablas objetivo; `Units.tsx` conserva scroll horizontal por decisión documentada; modales de detalle/resumen y `Machinery` quedaron fuera de alcance por decisión documentada.
- **Pendiente**: ejecutar `pnpm install --frozen-lockfile && pnpm build` con red y hacer revisión visual real (1440/1280/1024 y 390/375) — en particular validar los `max-w-[...]` (140–240px) y el ancho de la columna "Estado"/"Urgencia" centrada. Hasta entonces la Fase 8 **no** debe darse por verificada visualmente.

---

## Repaso final de Fase 8 (barrido transversal, sin cambios de código)

Se hizo un barrido con `grep` sobre las 16 tablas objetivo (Inventario, Entradas, Movimientos, Productos, Proveedores, Unidades, Usuarios, Auditoría y las 5 vistas de Reportes):
- `<td>` con `text-right` sin `tabular-nums`: **0**.
- Encabezados "Estado/Urgencia/Resultado/Acciones" sin `text-center`: **0**.
- Badges de **estado** sin centrar: **0**.
- Badges que siguen alineados a la izquierda, por decisión: "Tipo" (Inventario, Productos), "Rol" (Usuarios) y "Base/Derivada" (Unidades). Son clasificaciones descriptivas de la fila, no estados (el punto 8 del encargo pide centrar *estados* y *acciones*), y centrarlas las separaría de la columna de nombre que califican. Si el usuario prefiere centrarlas también, es un cambio de una clase por celda.

No se hicieron modificaciones de código en este repaso. **Fase 8: bloques 1–5 implementados; verificación real (`pnpm build` + revisión visual) sigue pendiente por falta de red/`pnpm` en el entorno.** No quedan bloques por ejecutar.
