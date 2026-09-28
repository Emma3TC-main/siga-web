===============================================================
AJUSTE EXCLUSIVO DE LA VERSIÓN MOBILE DEL PROTOTIPO SIGA
===============================================================

⚠️ INSTRUCCIÓN PRINCIPAL ⚠️

TRABAJAR ÚNICAMENTE SOBRE LA VERSIÓN MOBILE DEL PROYECTO SIGA
QUE YA EXISTE.

NO CREAR SIGA DESDE CERO.

NO CREAR UNA NUEVA APLICACIÓN.

NO BORRAR EL PROTOTIPO EXISTENTE.

NO REEMPLAZAR LAS PANTALLAS EXISTENTES.

NO MODIFICAR LA VERSIÓN DESKTOP/WEB SALVO QUE SEA ESTRICTAMENTE
NECESARIO PARA MANTENER EL RESPONSIVE.

NO MODIFICAR LA FUNCIONALIDAD YA IMPLEMENTADA DE PROVEEDORES.

NO VOLVER A CREAR EL MÓDULO DE PROVEEDORES.

NO CAMBIAR LA ESTRUCTURA GENERAL DE SIGA.

Esta solicitud tiene UN ÚNICO OBJETIVO:

MEJORAR Y CORREGIR LA ADAPTACIÓN MOBILE DEL PROTOTIPO EXISTENTE,
manteniendo exactamente la identidad visual, navegación,
funcionalidad, roles y componentes que ya existen.

===============================================================
1. ANALIZAR PRIMERO EL MOBILE EXISTENTE
===============================================================

Antes de realizar cambios:

analiza cómo está construida actualmente la versión Mobile.

Identifica:

- Header Mobile
- Dashboard Mobile
- navegación inferior
- tarjetas
- listas
- formularios
- tablas adaptadas
- botones
- filtros
- buscadores
- notificaciones
- avatar
- contenido principal
- espacios superiores e inferiores
- áreas seguras del dispositivo

NO reemplazar estos componentes.

REUTILIZARLOS.

Solo ajustar aquello que sea necesario para conseguir una
adaptación Mobile profesional.

===============================================================
2. OBJETIVO PRINCIPAL
===============================================================

La versión Mobile debe verse como una aplicación móvil
profesional y correctamente adaptada a dispositivos modernos.

Debe:

- respetar el área segura superior;
- respetar el área segura inferior;
- evitar contenido debajo de elementos del dispositivo;
- mantener el Header existente;
- mantener el Dashboard existente;
- mantener la navegación inferior existente;
- mantener todos los componentes existentes;
- conservar la estética actual.

NO hacer un rediseño completo.

===============================================================
3. DYNAMIC ISLAND — REGLA FUNDAMENTAL
===============================================================

MUY IMPORTANTE:

La Dynamic Island que aparece en la vista previa del iPhone
NO forma parte de la interfaz de SIGA.

La Dynamic Island pertenece al HARDWARE / DEVICE PREVIEW.

Por lo tanto:

NO crear una Dynamic Island dentro de SIGA.

NO dibujar una cápsula negra.

NO añadir un componente que simule una Dynamic Island.

NO modificar la Dynamic Island.

NO intentar ocultarla.

NO reemplazarla.

NO utilizarla como parte del Header.

La Dynamic Island puede continuar apareciendo en la vista previa
del iPhone.

Eso es CORRECTO.

===============================================================
4. SAFE AREA SUPERIOR
===============================================================

El contenido de SIGA debe respetar el área segura superior
del dispositivo.

El Header NO debe quedar debajo de la Dynamic Island.

El Header debe comenzar debajo del área superior reservada
por el dispositivo.

IMPORTANTE:

NO mover todo el Dashboard hacia abajo.

NO agregar un padding enorme a toda la aplicación.

NO modificar innecesariamente la posición de las tarjetas.

NO alterar el contenido principal.

La corrección debe realizarse principalmente en el HEADER.

===============================================================
5. HEADER MOBILE
===============================================================

Mantener el Header Mobile actual.

Conservar los elementos que ya existen, por ejemplo:

- buscador;
- notificaciones;
- avatar;
- acciones existentes.

Únicamente ajustar su posición vertical para respetar
la Safe Area superior.

La estructura conceptual debe ser:

┌──────────────────────────────┐
│      ÁREA DEL DISPOSITIVO    │
│      Dynamic Island          │
├──────────────────────────────┤
│                              │
│      SAFE AREA SUPERIOR      │
│                              │
├──────────────────────────────┤
│ 🔍 Buscar   🔔   👤          │
│       HEADER SIGA            │
├──────────────────────────────┤
│                              │
│ Buenas noches, Carlos        │
│                              │
│ [ contenido existente ]      │
│                              │
└──────────────────────────────┘

NO colocar ningún elemento de SIGA dentro del área ocupada
por la Dynamic Island.

===============================================================
6. STATUS BAR
===============================================================

IMPORTANTE:

La Status Bar también pertenece al sistema operativo/dispositivo.

Si el preview del iPhone ya muestra:

- hora;
- señal;
- Wi-Fi;
- batería;

NO crear una segunda Status Bar dentro de SIGA.

NO duplicar la hora.

NO duplicar batería.

NO duplicar señal.

NO crear una barra artificial encima del Header.

Utilizar el espacio proporcionado por el dispositivo y respetar
la Safe Area.

Si el preview NO proporciona visualmente la Status Bar,
reservar únicamente el espacio superior necesario para que
el Header de SIGA no quede debajo del área del sistema.

===============================================================
7. HOME INDICATOR
===============================================================

Aplicar la misma lógica en la parte inferior.

El Home Indicator pertenece al dispositivo.

NO crear un Home Indicator adicional dentro de SIGA.

NO colocar botones ni contenido debajo de él.

La navegación inferior existente debe respetar el área segura
inferior.

===============================================================
8. NAVEGACIÓN INFERIOR
===============================================================

CONSERVAR la navegación inferior actual.

NO crear una nueva navegación.

NO convertir el Sidebar Desktop en navegación Mobile.

Mantener las opciones existentes.

La navegación debe:

- permanecer visible;
- ser táctil;
- tener suficiente espacio;
- respetar el Home Indicator;
- no quedar cortada;
- no superponerse con contenido.

===============================================================
9. RESPONSIVE REAL
===============================================================

No diseñar solamente para un tamaño específico de iPhone.

La interfaz debe adaptarse a diferentes:

- anchos;
- alturas;
- tamaños de pantalla.

Evitar posiciones absolutas innecesarias.

Evitar tamaños fijos que provoquen:

- desbordamiento;
- contenido cortado;
- textos superpuestos;
- botones fuera de pantalla;
- tarjetas incompletas.

Utilizar layouts flexibles.

===============================================================
10. DASHBOARD MOBILE
===============================================================

NO rediseñar el Dashboard.

NO cambiar las tarjetas existentes.

NO cambiar los gráficos existentes.

NO cambiar los KPI existentes.

NO cambiar la estructura de información.

Únicamente corregir:

- espaciado superior;
- Safe Area;
- separación del Header;
- responsive.

El contenido debe conservar su posición relativa.

===============================================================
11. TARJETAS MOBILE
===============================================================

Mantener las tarjetas existentes.

Deben:

- ocupar correctamente el ancho disponible;
- respetar márgenes laterales;
- evitar desbordamientos;
- mantener jerarquía visual;
- mantener los iconos;
- mantener los textos;
- mantener los estados.

No comprimir excesivamente las tarjetas.

===============================================================
12. TABLAS
===============================================================

Cuando una pantalla existente tenga tablas de escritorio:

NO mostrar una tabla horizontal ilegible en Mobile.

Adaptar la información a:

- cards;
- listas;
- filas compactas;
- detalle expandible.

Mantener la misma información y funcionalidad.

NO eliminar información solamente porque se trata de Mobile.

===============================================================
13. FORMULARIOS MOBILE
===============================================================

Los formularios existentes deben adaptarse a pantalla pequeña.

Utilizar:

- inputs de ancho completo;
- labels visibles;
- botones táctiles;
- separación adecuada;
- scroll vertical;
- mensajes de validación visibles.

Evitar:

- dos columnas comprimidas;
- botones pequeños;
- campos cortados;
- texto superpuesto.

===============================================================
14. BOTONES Y TOUCH
===============================================================

Optimizar para interacción táctil.

Los botones deben tener un área de interacción cómoda.

Mantener:

- iconografía;
- texto;
- jerarquía;
- estados.

No convertir todos los botones en iconos.

No eliminar texto cuando sea necesario para comprender
la acción.

===============================================================
15. BUSCADOR MOBILE
===============================================================

Mantener el buscador existente.

Adaptarlo al ancho disponible.

No permitir que:

- invada el borde;
- choque con notificaciones;
- choque con avatar;
- quede debajo de la Dynamic Island;
- se corte el texto.

===============================================================
16. NOTIFICACIONES Y AVATAR
===============================================================

Conservar los elementos existentes del Header.

Asegurar:

- alineación;
- tamaño correcto;
- separación;
- área táctil;
- Safe Area.

No moverlos fuera del Header.

===============================================================
17. PROVEEDORES — MOBILE
===============================================================

IMPORTANTE:

PROVEEDORES YA ESTÁ IMPLEMENTADO.

NO volver a crear el módulo.

NO modificar su funcionamiento Web.

ÚNICAMENTE adaptar a Mobile las partes que ya existen
y que correspondan a la experiencia móvil.

En Mobile:

NO crear un nuevo elemento principal llamado "Proveedores"
en la navegación inferior.

El acceso a proveedor debe ser CONTEXTUAL.

Por ejemplo:

Movimientos
↓
Nueva recepción
↓
Recepción externa
↓
Proveedor

===============================================================
18. SELECTOR DE PROVEEDOR MOBILE
===============================================================

Si el flujo Mobile existente permite realizar una recepción
externa:

el campo:

"Proveedor"

debe estar correctamente adaptado a Mobile.

No utilizar una tabla Desktop.

Utilizar:

- selector;
- modal;
- bottom sheet;
- lista;
- buscador.

Debe ser táctil.

Ejemplo:

┌──────────────────────────────┐
│ ← Seleccionar proveedor      │
├──────────────────────────────┤
│ 🔍 Buscar proveedor...       │
├──────────────────────────────┤
│ Metalúrgica Andina S.A.C.    │
│ RUC: 20123456789              │
│ PROV-001                      │
├──────────────────────────────┤
│ Repuestos Mineros S.A.C.     │
│ RUC: 20987654321              │
│ PROV-002                      │
└──────────────────────────────┘

Mantener la lógica de proveedores ya implementada.

===============================================================
19. PROVEEDORES INACTIVOS EN MOBILE
===============================================================

Mantener la regla existente:

Proveedor ACTIVO:
→ puede seleccionarse en una nueva recepción.

Proveedor INACTIVO:
→ no puede seleccionarse.

En historial:

Proveedor INACTIVO:
→ debe seguir siendo visible.

NO modificar esta lógica.

Solo asegurar que se visualice correctamente en Mobile.

===============================================================
20. DETALLE DE RECEPCIÓN MOBILE
===============================================================

Mantener el detalle de recepción existente.

Cuando corresponda:

mostrar:

Proveedor
Razón social
RUC / Identificador

Además de los demás datos existentes.

No eliminar información.

Adaptar la distribución para pantalla pequeña.

===============================================================
21. HISTORIAL MOBILE
===============================================================

Mantener el historial existente.

Para entradas externas:

mostrar el proveedor de manera clara.

Ejemplo:

ENT-000245
Entrada externa
Metalúrgica Andina S.A.C.
12/08/2026
Confirmado

Al tocar:

abrir el detalle existente.

===============================================================
22. TRAZABILIDAD MOBILE
===============================================================

Mantener la trazabilidad existente.

Cuando corresponda:

Proveedor
↓
Recepción
↓
Producto
↓
Lote / Serie
↓
Ubicación
↓
Movimientos

No crear una pantalla de trazabilidad nueva.

===============================================================
23. ROLES MOBILE
===============================================================

NO modificar los roles.

Mantener:

- Administrador;
- Supervisor de Almacén;
- Encargado de Almacén;
- Usuario Autorizado;
- Usuario Móvil Autorizado.

La versión Mobile debe respetar exactamente los permisos
existentes.

NO mostrar funciones que el usuario no tenga autorizadas.

===============================================================
24. ESTADOS
===============================================================

Mantener todos los estados existentes:

- Loading;
- Empty;
- Error;
- Success;
- Forbidden;
- Search empty.

Adaptarlos visualmente a Mobile.

===============================================================
25. PALETA
===============================================================

CONSERVAR:

#093C5D
#3B7597
#6FD1D7
#5DF8D8

NO cambiar los colores.

NO crear colores nuevos como parte de esta actualización.

===============================================================
26. TIPOGRAFÍA E ICONOGRAFÍA
===============================================================

Mantener exactamente la tipografía existente.

Mantener la iconografía existente.

No reemplazar iconos arbitrariamente.

No modificar la identidad visual.

===============================================================
27. ESPACIADO
===============================================================

Optimizar el espaciado Mobile sin cambiar la identidad.

Mantener:

- márgenes laterales;
- separación entre tarjetas;
- padding;
- jerarquía.

Ajustar únicamente cuando sea necesario para la pantalla pequeña.

===============================================================
28. NO MODIFICAR WEB
===============================================================

ESTA ACTUALIZACIÓN ES PRINCIPALMENTE MOBILE.

NO cambiar:

- Dashboard Desktop;
- Sidebar Desktop;
- tablas Desktop;
- Header Desktop;
- estructura Desktop;
- layout Desktop.

Si un componente es compartido:

realizar cambios responsive únicamente mediante el breakpoint
correspondiente, sin alterar la apariencia Desktop.

===============================================================
29. NO MODIFICAR FUNCIONALIDAD
===============================================================

NO modificar la lógica de:

- Inventario;
- Movimientos;
- Entradas;
- Salidas;
- Transferencias;
- Ajustes;
- Conteos;
- Trazabilidad;
- Proveedores;
- Autorizaciones;
- Reportes;
- Auditoría.

Esta tarea es principalmente de:

ADAPTACIÓN RESPONSIVE + UX MOBILE.

===============================================================
30. VERIFICACIÓN VISUAL
===============================================================

Después de realizar los cambios, comprobar especialmente:

HEADER:

✓ No queda debajo de Dynamic Island.

✓ No se superpone con Status Bar.

✓ No hay doble Status Bar.

✓ Buscador correctamente alineado.

✓ Notificaciones correctamente alineadas.

✓ Avatar correctamente alineado.

DASHBOARD:

✓ No fue desplazado innecesariamente.

✓ Las tarjetas conservan su diseño.

✓ No existe contenido cortado.

NAVEGACIÓN:

✓ Navegación inferior visible.

✓ No queda debajo del Home Indicator.

✓ Botones correctamente alineados.

PROVEEDORES:

✓ Selector usable en Mobile.

✓ Proveedores activos seleccionables.

✓ Proveedores inactivos no seleccionables.

✓ Historial conserva proveedores inactivos.

RESPONSIVE:

✓ No hay overflow horizontal innecesario.

✓ No hay textos cortados.

✓ No hay elementos superpuestos.

✓ No hay botones fuera de pantalla.

✓ No hay componentes debajo de las áreas seguras.

===============================================================
31. PRUEBA ESPECIAL DEL IPHONE
===============================================================

Utilizar el preview de iPhone disponible en Figma Make.

Comprobar:

1. Dynamic Island visible como parte del dispositivo.
2. SIGA NO intenta dibujar una Dynamic Island.
3. Header comienza debajo del área segura.
4. Status Bar no se duplica.
5. Dashboard comienza después del Header.
6. Contenido no queda oculto.
7. Navegación inferior respeta Home Indicator.
8. No existen solapamientos.

===============================================================
32. REGLA DE NO DESTRUCCIÓN
===============================================================

NO eliminar componentes existentes.

NO sustituir componentes existentes por versiones simplificadas.

NO borrar pantallas.

NO borrar flujos.

NO borrar datos de demostración.

NO eliminar funcionalidades.

NO cambiar la navegación existente.

NO cambiar los roles.

NO cambiar permisos.

NO cambiar la lógica de negocio.

===============================================================
33. RESULTADO ESPERADO
===============================================================

El resultado final debe ser:

EL MISMO SIGA ACTUAL
+
UNA VERSIÓN MOBILE CORRECTAMENTE ADAPTADA.

Debe sentirse como una aplicación profesional de gestión
de almacenes para el sector mecánico/minero.

La prioridad es:

1. Safe Area correcta.
2. Header correctamente posicionado.
3. Dynamic Island tratada como parte del dispositivo.
4. Status Bar sin duplicación.
5. Home Indicator respetado.
6. Navegación Mobile conservada.
7. Dashboard conservado.
8. Componentes responsive.
9. Touch UX.
10. Proveedores correctamente adaptado a Mobile.
11. Roles y permisos intactos.
12. Identidad visual intacta.

===============================================================
INSTRUCCIÓN FINAL
===============================================================

NO EMPEZAR DESDE CERO.

NO CREAR UN NUEVO PROYECTO.

NO REHACER SIGA.

NO MODIFICAR LA VERSIÓN WEB INNECESARIAMENTE.

NO VOLVER A CREAR PROVEEDORES.

MODIFICAR ÚNICAMENTE LA EXPERIENCIA MOBILE EXISTENTE.

Primero analiza el Mobile actual y luego realiza únicamente
los ajustes necesarios para conseguir una adaptación profesional,
responsive, usable y respetuosa de las áreas seguras del dispositivo.