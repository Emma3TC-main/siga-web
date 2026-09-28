MODIFICAR EL PROYECTO SIGA EXISTENTE — NO CREAR DESDE CERO

IMPORTANTE:
Ya existe un prototipo funcional de SIGA en este proyecto de Figma Make.

NO crear una aplicación nueva.
NO borrar el trabajo existente.
NO reiniciar el proyecto.
NO reemplazar el diseño actual.
NO generar una estructura completamente diferente.

Debes TRABAJAR SOBRE EL PROTOTIPO EXISTENTE y EXTENDERLO, CORREGIRLO y COMPLETARLO.

El objetivo principal de esta modificación es implementar correctamente el sistema de ROLES Y PERMISOS del SIGA, manteniendo la estética y Design System que ya existe.

================================================================
1. CONSERVAR EL DISEÑO EXISTENTE
================================================================

Conservar exactamente en la medida de lo posible:

- identidad visual actual;
- estructura general;
- sidebar actual;
- header;
- tipografía;
- iconografía;
- tarjetas;
- tablas;
- botones;
- formularios;
- espaciado;
- bordes;
- sombras;
- componentes existentes;
- estilo visual;
- layouts existentes;
- navegación que ya funciona.

NO rediseñar todo.

NO cambiar innecesariamente la interfaz.

NO convertir el proyecto en otro diseño.

El proyecto ya utiliza la siguiente identidad cromática:

#093C5D
#3B7597
#6FD1D7
#5DF8D8

Mantener esta paleta.

================================================================
2. OBJETIVO DE ESTA MODIFICACIÓN
================================================================

Actualmente el proyecto tiene una navegación/sidebar que muestra prácticamente todos los módulos.

Esto debe corregirse.

El sidebar actual representa principalmente el nivel de acceso del ADMINISTRADOR.

Ahora debes implementar navegación y permisos diferenciados para los 5 roles oficiales del sistema:

1. Administrador
2. Supervisor de Almacén
3. Encargado de Almacén
4. Usuario Autorizado
5. Usuario Móvil Autorizado

NO crear roles adicionales.

NO crear aplicaciones diferentes.

Debe existir UNA SOLA aplicación SIGA.

La diferencia entre roles debe producirse mediante:

- permisos;
- módulos visibles;
- acciones disponibles;
- botones;
- formularios;
- información accesible;
- autorizaciones;
- navegación.

================================================================
3. MODIFICAR EL LOGIN EXISTENTE
================================================================

Conservar el diseño actual del login.

Actualmente existe:

ACCESO DEMO — SELECCIONAR ROL

Conservar los 5 accesos demo.

Cambiar únicamente:

"Usuario Móvil"

por:

"Usuario Móvil Autorizado"

Mantener el resto del diseño.

Al seleccionar cada rol demo, el sistema debe cargar el perfil correspondiente.

================================================================
4. ADMINISTRADOR
================================================================

El sidebar que actualmente existe debe utilizarse como referencia para el ADMINISTRADOR.

El Administrador puede visualizar:

Dashboard

Inventario

Movimientos
  - Entradas
  - Salidas
  - Transferencias
  - Ajustes
  - Conteos físicos

Catálogo

Ubicaciones

Maquinaria y activos

Trazabilidad

Autorizaciones

Reportes

Auditoría

Indicadores

Administración
  - Usuarios
  - Roles y permisos
  - Parámetros
  - Configuración

Integraciones

Continuidad

NO eliminar estos módulos del Administrador.

================================================================
5. SUPERVISOR DE ALMACÉN
================================================================

Crear una variante del sidebar EXISTENTE, sin cambiar el estilo visual.

El Supervisor debe ver:

Dashboard

Inventario

Movimientos
  - Entradas
  - Salidas
  - Transferencias
  - Ajustes
  - Conteos físicos

Catálogo según permiso

Ubicaciones

Maquinaria y activos

Trazabilidad

Autorizaciones

Reportes

Indicadores operativos

Auditoría solamente si tiene permiso.

NO mostrar al Supervisor:

- Administración
- Usuarios
- Roles y permisos
- Integraciones
- Continuidad

La sección "Autorizaciones" debe tener especial importancia visual.

Por ejemplo, conservar el badge rojo existente:

"2"

para indicar movimientos pendientes.

El Supervisor debe poder:

- revisar movimientos;
- aprobar;
- rechazar;
- revisar ajustes;
- validar movimientos sensibles.

================================================================
6. ENCARGADO DE ALMACÉN
================================================================

Crear una variante del sidebar existente.

Mantener exactamente el mismo estilo visual.

El Encargado debe ver:

Dashboard

Inventario

Movimientos
  - Entradas
  - Salidas
  - Transferencias

Catálogo en modo consulta

Ubicaciones

Maquinaria y activos

Trazabilidad

Reportes

Historial

NO mostrar:

- Ajustes
- Autorizaciones
- Auditoría
- Administración
- Usuarios
- Roles y permisos
- Integraciones
- Continuidad
- Indicadores administrativos

IMPORTANTE:

El Encargado NO debe poder ejecutar ajustes.

No basta con ocultar la opción.

Si intenta acceder directamente a la ruta de ajustes:

mostrar:

"Acceso restringido"

"Tu rol no tiene permisos para ejecutar ajustes."

================================================================
7. USUARIO AUTORIZADO
================================================================

Crear una variante reducida del sidebar existente.

Mostrar:

Dashboard

Inventario

Movimientos

Catálogo

Ubicaciones

Trazabilidad

Historial

Las operaciones:

- Entradas
- Salidas
- Transferencias

deben aparecer solamente cuando el permiso correspondiente esté habilitado.

NO mostrar:

- Administración
- Usuarios
- Roles y permisos
- Ajustes
- Autorizaciones
- Auditoría
- Integraciones
- Continuidad

El Usuario Autorizado debe tener un nivel de acceso operativo limitado.

================================================================
8. USUARIO MÓVIL AUTORIZADO
================================================================

NO cambiar la estética general existente.

Crear la experiencia móvil utilizando los mismos componentes, colores, tipografía e identidad visual del proyecto existente.

El móvil debe ser una versión adaptada para operación de almacén.

No replicar el sidebar desktop completo.

Utilizar navegación inferior.

Mostrar:

Inicio
Stock
Movimientos
Escanear
Perfil

Acciones rápidas:

- Consultar stock
- Escanear producto
- Registrar entrada
- Registrar salida
- Transferir ubicación
- Ver mis movimientos

Las operaciones disponibles dependen del permiso.

================================================================
9. NO DUPLICAR LA APLICACIÓN
================================================================

MUY IMPORTANTE:

NO crear:

"SIGA Administrador"

"SIGA Supervisor"

"SIGA Encargado"

"SIGA Usuario"

"SIGA Mobile"

como aplicaciones separadas.

Debe existir un único SIGA.

El usuario autenticado determina qué puede ver y hacer.

================================================================
10. IMPLEMENTAR RBAC EN EL PROTOTIPO EXISTENTE
================================================================

Implementar visualmente RBAC.

Cuando el usuario seleccione un rol desde el login demo:

CAMBIAR:

- Sidebar
- Dashboard
- módulos
- botones
- acciones
- opciones disponibles

NO cambiar:

- identidad visual;
- paleta;
- componentes;
- estilo general.

================================================================
11. REGLA DE ACCESO DIRECTO
================================================================

No basta con ocultar los elementos del sidebar.

Si un usuario intenta abrir una pantalla no autorizada mediante una ruta directa:

mostrar pantalla de:

"Acceso restringido"

con:

- icono;
- mensaje;
- botón "Volver al Dashboard".

================================================================
12. MATRIZ DE PERMISOS
================================================================

Implementar como base:

                         ADMIN  SUPERVISOR  ENCARGADO  USUARIO  MÓVIL

Acceso sistema             ✓        ✓          ✓          ✓       ✓
Inventario                 ✓        ✓          ✓          ✓       ✓
Entradas                   ✓        ✓          ✓       permiso  permiso
Salidas                    ✓        ✓          ✓       permiso  permiso
Transferencias             ✓        ✓          ✓       permiso  permiso
Ajustes                    ✓        ✓          ✗          ✗       ✗
Autorizaciones             ✓        ✓          ✗          ✗       ✗
Reportes                   ✓        ✓          ✓       permiso    ✗
Historial                  ✓        ✓          ✓       permiso  permiso
Auditoría                  ✓     permiso       ✗          ✗       ✗
Usuarios/Roles             ✓        ✗          ✗          ✗       ✗

Cuando aparezca "permiso":

hacerlo configurable.

No asumir que todos los usuarios autorizados tienen exactamente los mismos permisos.

================================================================
13. DIFERENCIAR SUPERVISOR Y ENCARGADO
================================================================

MUY IMPORTANTE.

No hacer que Supervisor y Encargado tengan exactamente la misma aplicación.

Ambos pueden realizar operaciones de almacén, pero:

ENCARGADO:

Enfocado en ejecutar la operación diaria.

SUPERVISOR:

Enfocado en supervisar, controlar, validar y autorizar.

Por ello el Supervisor debe tener acceso visual destacado a:

- Autorizaciones
- Movimientos sensibles
- Ajustes
- Alertas
- Indicadores operativos

El Encargado debe tener acceso destacado a:

- Entradas
- Salidas
- Transferencias
- Inventario
- Ubicaciones
- Productos

================================================================
14. DIFERENCIAR USUARIO AUTORIZADO Y MÓVIL
================================================================

USUARIO AUTORIZADO:

Usuario operativo principalmente mediante Web.

USUARIO MÓVIL AUTORIZADO:

Usuario operativo principalmente mediante Mobile.

NO crear reglas de inventario diferentes.

Ambos utilizan las mismas reglas centrales.

================================================================
15. MANTENER LOS MÓDULOS YA CREADOS
================================================================

NO eliminar los módulos existentes.

Reutilizar las pantallas ya creadas.

Aplicar permisos sobre ellas.

Si ya existe:

Inventario

reutilizar esa pantalla.

Si ya existe:

Entradas

reutilizar esa pantalla.

Si ya existe:

Salidas

reutilizar esa pantalla.

Si ya existe:

Transferencias

reutilizar esa pantalla.

Si ya existe:

Autorizaciones

reutilizar esa pantalla.

Si ya existe:

Reportes

reutilizar esa pantalla.

NO duplicar pantallas innecesariamente.

================================================================
16. COMPLETAR LO QUE YA EXISTE
================================================================

Si alguna pantalla existente está incompleta:

COMPLETARLA.

Si algún botón no tiene interacción:

HACERLO FUNCIONAL.

Si alguna tabla no tiene filtros:

AGREGARLOS.

Si algún formulario no tiene validaciones:

AGREGARLAS.

Si alguna acción no tiene estado:

AGREGAR estados de:

- loading;
- éxito;
- error;
- pendiente;
- rechazado;
- acceso restringido.

================================================================
17. MANTENER EL SIDEBAR ACTUAL
================================================================

El sidebar actual es correcto visualmente.

NO rediseñarlo.

Utilizarlo como componente reutilizable.

Crear variantes:

Sidebar / Admin
Sidebar / Supervisor
Sidebar / Encargado
Sidebar / Usuario Autorizado

Para móvil utilizar la navegación móvil existente o crear una variante consistente.

Todos deben compartir:

- mismo color;
- mismos iconos;
- mismo tamaño;
- mismos estados hover;
- mismo estado activo;
- misma tipografía.

================================================================
18. DASHBOARDS SEGÚN ROL
================================================================

NO hacer que todos los roles vean exactamente el mismo Dashboard.

ADMINISTRADOR:

Indicadores globales.

SUPERVISOR:

Supervisión + autorizaciones + alertas.

ENCARGADO:

Operación diaria.

USUARIO AUTORIZADO:

Consulta + operaciones permitidas.

MÓVIL:

Acciones rápidas de campo.

Pero todos deben conservar el mismo Design System.

================================================================
19. DATOS Y OPERACIONES
================================================================

Mantener los datos demo existentes.

NO reemplazarlos innecesariamente.

Si faltan datos, agregar únicamente los necesarios.

Utilizar datos realistas del sector mecánico/minero.

================================================================
20. VALIDACIONES
================================================================

Conservar y completar las validaciones.

No permitir:

- salida superior al stock;
- transferencia sin existencia;
- ajuste sin motivo;
- movimiento sensible sin autorización;
- operación no permitida por rol.

================================================================
21. OBJETIVO FINAL
================================================================

El resultado final debe parecer una EVOLUCIÓN del prototipo existente.

NO debe parecer un proyecto nuevo.

Debe verse como:

"SIGA v1.0 → SIGA completo con RBAC"

Mantener la estética actual.

Modificar principalmente:

- permisos;
- navegación;
- dashboards;
- acciones;
- estados;
- funcionalidad.

================================================================
22. CRITERIO DE ÉXITO
================================================================

Al finalizar, debe ser posible:

1. Entrar como Administrador.
2. Ver todos los módulos.
3. Cerrar sesión.
4. Entrar como Supervisor.
5. Ver un sidebar diferente.
6. Ver Autorizaciones.
7. No ver Administración.
8. Entrar como Encargado.
9. No ver Ajustes ni Autorizaciones.
10. Entrar como Usuario Autorizado.
11. Ver solamente módulos permitidos.
12. Entrar como Usuario Móvil Autorizado.
13. Ver la experiencia Mobile.
14. Intentar entrar a un módulo restringido.
15. Recibir "Acceso restringido".

Todo esto debe utilizar las MISMAS pantallas, componentes y estética ya existentes siempre que sea posible.

NO empezar desde cero.

MODIFICAR EL PROYECTO EXISTENTE.