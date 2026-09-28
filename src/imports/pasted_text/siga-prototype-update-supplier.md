ACTUALIZACIÓN DEL PROTOTIPO EXISTENTE DE SIGA — INCORPORAR MÓDULO DE PROVEEDORES

⚠️ INSTRUCCIÓN PRINCIPAL ⚠️

NO CREAR SIGA DESDE CERO.

NO CREAR UNA NUEVA APLICACIÓN.

NO BORRAR EL PROTOTIPO EXISTENTE.

NO REEMPLAZAR EL DISEÑO ACTUAL.

NO REHACER LAS PANTALLAS QUE YA EXISTEN.

TRABAJAR EXCLUSIVAMENTE SOBRE EL PROYECTO SIGA EXISTENTE.

Esta es una ACTUALIZACIÓN funcional del prototipo actual.

El sistema existente ya cuenta con:

- Login
- Dashboard
- Inventario
- Movimientos
- Entradas
- Salidas
- Transferencias
- Ajustes
- Conteos físicos
- Catálogo
- Ubicaciones
- Maquinaria y activos
- Trazabilidad
- Autorizaciones
- Reportes
- Auditoría
- Indicadores
- Administración
- Integraciones
- Continuidad
- navegación web
- experiencia móvil
- sistema de roles y permisos

CONSERVAR TODO LO ANTERIOR.

La nueva modificación consiste principalmente en INCORPORAR CORRECTAMENTE LA GESTIÓN DE PROVEEDORES y ajustar las pantallas relacionadas con ENTRADAS/RECEPCIONES y TRAZABILIDAD.

============================================================
1. REGLA DE DISEÑO
============================================================

Mantener exactamente el Design System existente.

Conservar:

- estructura visual;
- sidebar;
- header;
- tarjetas;
- tablas;
- formularios;
- botones;
- modales;
- iconografía;
- tipografía;
- espaciado;
- estados;
- navegación;
- responsive;
- diseño mobile.

Mantener la paleta:

#093C5D
#3B7597
#6FD1D7
#5DF8D8

NO crear una estética diferente para Proveedores.

El nuevo módulo debe parecer parte nativa de SIGA.

============================================================
2. PROVEEDORES — DEFINICIÓN
============================================================

Incorporar un nuevo maestro llamado:

"Proveedores"

Su finalidad es identificar de manera confiable el origen de las recepciones externas y conservar dicha información para trazabilidad administrativa.

IMPORTANTE:

PROVEEDORES NO ES UN MÓDULO DE COMPRAS.

NO crear:

- órdenes de compra;
- cotizaciones;
- cuentas por pagar;
- homologación avanzada;
- portal de proveedores;
- evaluación avanzada de proveedores;
- procesos de compras.

Es únicamente el MAESTRO BÁSICO DE PROVEEDORES requerido por SIGA.

============================================================
3. UBICACIÓN DEL MÓDULO
============================================================

Integrar "Proveedores" dentro de la sección de:

CATÁLOGO / DATOS MAESTROS

Si el proyecto actual ya tiene una sección de Catálogo desplegable:

Agregar:

Catálogo
  ├── Productos
  ├── Categorías
  ├── Unidades de medida
  └── Proveedores

NO crear una segunda sección independiente de Catálogo.

NO duplicar Proveedores.

El módulo debe reutilizar la navegación y los componentes existentes.

============================================================
4. PERMISOS DE PROVEEDORES
============================================================

Aplicar RBAC.

ADMINISTRADOR:

Puede:

- visualizar proveedores;
- crear proveedores;
- editar proveedores;
- activar proveedores;
- desactivar proveedores;
- consultar detalle;
- buscar y filtrar.

SUPERVISOR DE ALMACÉN:

Puede consultar proveedores.

La edición/gestión debe depender del permiso configurado.

ENCARGADO DE ALMACÉN:

Puede consultar proveedores cuando sea necesario para la operación de recepción.

No puede administrar el maestro.

USUARIO AUTORIZADO:

Consulta solamente cuando su rol tenga acceso.

No puede crear ni modificar proveedores.

USUARIO MÓVIL AUTORIZADO:

No administrar proveedores.

Puede consultar la información necesaria durante una operación móvil cuando corresponda.

IMPORTANTE:

No mostrar botones de Crear, Editar, Activar o Desactivar a usuarios que no tengan ese permiso.

============================================================
5. LISTADO DE PROVEEDORES
============================================================

Crear una pantalla:

"Proveedores"

utilizando el mismo patrón visual de las tablas existentes en SIGA.

La pantalla debe contener:

Título:
Proveedores

Subtítulo:
Maestro de proveedores

Botón:

"+ Nuevo proveedor"

El botón solamente debe aparecer para usuarios autorizados.

Tabla con:

- Código
- RUC / Identificador
- Razón social
- Nombre comercial
- Contacto
- Teléfono
- Correo
- Estado
- Acciones

Estados:

ACTIVO
INACTIVO

Utilizar los mismos badges/estados visuales que ya utiliza SIGA.

============================================================
6. BÚSQUEDA Y FILTROS
============================================================

Agregar búsqueda por:

- código;
- RUC;
- razón social;
- nombre comercial.

Filtros:

- estado: Todos / Activo / Inactivo.

Mantener el estilo de filtros existente en el proyecto.

Agregar:

- paginación;
- cantidad de registros;
- estado vacío;
- estado de carga;
- estado de error.

============================================================
7. CREAR PROVEEDOR
============================================================

Crear formulario:

"Nuevo proveedor"

Campos obligatorios:

- Código interno
- RUC / Identificador tributario
- Razón social
- Nombre comercial, cuando corresponda
- Nombre de contacto
- Teléfono
- Correo electrónico
- Dirección
- Estado

Por defecto:

Estado = Activo

Validar campos.

No permitir guardar información incompleta.

Mostrar mensajes de validación claros.

============================================================
8. EDITAR PROVEEDOR
============================================================

Permitir editar la información del proveedor únicamente a usuarios con permiso.

La pantalla debe reutilizar el mismo formulario de creación.

Título:

"Editar proveedor"

Permitir modificar:

- razón social;
- nombre comercial;
- contacto;
- teléfono;
- correo;
- dirección;
- otros datos maestros permitidos.

El código interno y el identificador tributario deben tratarse como datos identificativos y validar duplicados.

============================================================
9. ACTIVAR / DESACTIVAR
============================================================

Implementar cambio de estado:

ACTIVO → INACTIVO

INACTIVO → ACTIVO

Antes de desactivar:

mostrar modal de confirmación.

Ejemplo:

"¿Desactivar proveedor?"

"El proveedor no podrá seleccionarse en nuevas recepciones, pero su información histórica se conservará."

Botones:

Cancelar
Desactivar proveedor

IMPORTANTE:

Desactivar NO significa eliminar.

NO crear botón "Eliminar proveedor".

La desactivación debe ser lógica.

============================================================
10. REGLA CRÍTICA DE TRAZABILIDAD
============================================================

Cuando un proveedor sea desactivado:

NO eliminar sus datos.

NO eliminar sus recepciones anteriores.

NO modificar los movimientos históricos.

NO cambiar el proveedor registrado en movimientos anteriores.

Las recepciones confirmadas deben conservar:

- proveedor;
- identificador/RUC;
- razón social utilizada en el momento de la recepción.

Por lo tanto:

PROVEEDOR ACTUAL
≠
SNAPSHOT HISTÓRICO DE LA RECEPCIÓN

============================================================
11. INTEGRACIÓN CON ENTRADAS
============================================================

MODIFICAR LA PANTALLA DE ENTRADAS EXISTENTE.

NO crear una pantalla nueva de entradas.

Cuando la entrada corresponda a una RECEPCIÓN EXTERNA:

Agregar campo:

"Proveedor"

Debe ser un selector/buscador.

Mostrar:

- razón social;
- RUC/identificador.

SOLO mostrar proveedores ACTIVOS para nuevas recepciones.

Los proveedores INACTIVOS no pueden seleccionarse.

============================================================
12. SELECTOR DE PROVEEDOR
============================================================

El selector debe permitir:

Buscar por:

- razón social;
- RUC;
- código.

Mostrar resultados como:

Empresa / Razón social
RUC: XXXXXXXX
Código: PROV-001
Estado: Activo

Al seleccionar:

mostrar claramente el proveedor seleccionado.

============================================================
13. ENTRADA EXTERNA
============================================================

Para una entrada externa:

Proveedor = obligatorio.

Para otros tipos de entrada donde el proveedor no corresponda:

Proveedor = opcional/no aplicable según el tipo de movimiento.

NO obligar proveedor en todos los movimientos indiscriminadamente.

El sistema debe distinguir:

Recepción externa
vs.
otras entradas que no tengan origen externo.

============================================================
14. DETALLE DE ENTRADA
============================================================

Modificar el detalle de una entrada existente para mostrar:

Proveedor

Razón social
RUC / Identificador

Además de los datos que ya existen:

- ID de movimiento;
- tipo;
- fecha;
- usuario registrador;
- productos;
- cantidades;
- unidad;
- ubicación;
- lote/serie;
- estado;
- documentos;
- evidencia.

NO eliminar información existente.

============================================================
15. SNAPSHOT HISTÓRICO
============================================================

MUY IMPORTANTE.

Cuando una recepción sea confirmada:

guardar visualmente el concepto de:

"Datos del proveedor al momento de la recepción"

Mostrar:

Razón social
RUC / Identificador
Código

Si posteriormente el proveedor cambia su razón social:

la recepción histórica NO debe cambiar.

Ejemplo:

Proveedor actual:
"Metalúrgica Andina S.A.C."

Recepción histórica:
"Metalúrgica Andina S.R.L."

La recepción debe conservar la razón social que existía al momento de confirmar el movimiento.

============================================================
16. TRAZABILIDAD
============================================================

Modificar el módulo de Trazabilidad existente para que las recepciones externas permitan rastrear:

Proveedor
↓
Recepción
↓
Producto
↓
Lote / Serie / Activo
↓
Ubicación
↓
Movimientos posteriores

No crear una trazabilidad independiente.

Integrar proveedor al flujo de trazabilidad existente.

============================================================
17. HISTORIAL
============================================================

Modificar el historial existente.

Cuando el movimiento sea una entrada externa:

mostrar proveedor.

Ejemplo:

ENT-000245
Entrada
Metalúrgica Andina S.A.C.
RUC: 20123456789
12/08/2026 10:42
Carlos Mendoza
Confirmado

El proveedor debe ser consultable desde el detalle.

============================================================
18. REPORTES
============================================================

No crear un sistema de reportes nuevo.

Utilizar el módulo de Reportes existente.

Cuando corresponda, permitir que los reportes de entradas/recepciones puedan mostrar o filtrar:

- proveedor;
- RUC;
- cantidad de entradas;
- período.

Mantener los formatos de exportación existentes.

============================================================
19. DASHBOARD
============================================================

NO agregar demasiados KPI.

NO modificar el Dashboard innecesariamente.

Si ya existe una sección de entradas del período:

mantenerla.

No crear un KPI de proveedores salvo que sea realmente necesario.

El proveedor debe principalmente formar parte de:

- datos maestros;
- entradas;
- trazabilidad;
- historial;
- reportes.

============================================================
20. ROLES — NO ROMPER LA CONFIGURACIÓN EXISTENTE
============================================================

Mantener los cinco roles:

1. Administrador
2. Supervisor de Almacén
3. Encargado de Almacén
4. Usuario Autorizado
5. Usuario Móvil Autorizado

NO crear roles nuevos.

NO hacer que todos vean Proveedores.

La interfaz debe cambiar según el rol.

Administrador:
Gestión completa.

Supervisor:
Consulta y gestión solo si tiene permiso.

Encargado:
Consulta operativa.

Usuario Autorizado:
Consulta según permiso.

Usuario Móvil:
Consulta limitada cuando la operación lo requiera.

============================================================
21. SIDEBAR
============================================================

NO modificar el diseño visual del sidebar actual.

Si actualmente existe:

Catálogo >

agregar:

Proveedores

como subopción.

Ejemplo:

Catálogo
  Productos
  Categorías
  Unidades de medida
  Proveedores

Para usuarios sin permiso:

NO mostrar Proveedores.

No dejar espacios vacíos.

No romper el menú.

============================================================
22. SEGURIDAD Y ACCESO
============================================================

No confiar únicamente en ocultar botones.

Si un usuario sin permiso intenta acceder directamente a:

/proveedores

mostrar:

"Acceso restringido"

"Tu rol no tiene permisos para gestionar proveedores."

Botón:

"Volver al Dashboard"

============================================================
23. ESTADOS DEL MÓDULO
============================================================

Implementar:

Loading:

"Cargando proveedores..."

Empty:

"No hay proveedores registrados."

Search empty:

"No encontramos proveedores con esos criterios."

Error:

"No fue posible cargar los proveedores."

Success:

"Proveedor creado correctamente."

"Proveedor actualizado correctamente."

"Proveedor desactivado correctamente."

Forbidden:

"No tienes permisos para realizar esta acción."

============================================================
24. DISEÑO RESPONSIVE
============================================================

Mantener el comportamiento responsive existente.

Desktop:

Tabla completa.

Tablet:

Tabla adaptada.

Mobile:

Transformar la tabla en tarjetas/listado compacto.

No mostrar una tabla ilegible en pantallas pequeñas.

El detalle del proveedor debe ser cómodo para móvil.

============================================================
25. MOBILE
============================================================

NO crear un módulo administrativo completo de proveedores dentro de la app móvil.

El Usuario Móvil Autorizado solamente necesita consultar la información del proveedor cuando sea necesaria para una operación permitida.

La aplicación móvil mantiene las mismas reglas del backend central.

No crear una lógica diferente para proveedores en mobile.

============================================================
26. VALIDACIONES
============================================================

Implementar validaciones:

- campos obligatorios;
- formato de correo;
- formato de teléfono;
- RUC/identificador;
- duplicidad de RUC/identificador;
- duplicidad de código interno;
- proveedor activo para nuevas recepciones.

No permitir seleccionar proveedores inactivos.

============================================================
27. NO AGREGAR FUNCIONES FUERA DEL MANUAL
============================================================

NO implementar:

- órdenes de compra;
- cotizaciones;
- cuentas por pagar;
- evaluación de proveedores;
- ranking de proveedores;
- homologación avanzada;
- portal de proveedores;
- contratos;
- pagos;
- compras;
- negociación comercial.

El módulo es únicamente:

MAESTRO BÁSICO DE PROVEEDORES
+
INTEGRACIÓN CON RECEPCIONES
+
TRAZABILIDAD HISTÓRICA.

============================================================
28. CONSERVAR TODO EL TRABAJO ANTERIOR
============================================================

NO eliminar funcionalidades existentes.

NO reemplazar pantallas.

NO duplicar módulos.

NO duplicar componentes.

NO cambiar los roles existentes.

NO cambiar la lógica existente de inventario.

NO cambiar las reglas existentes de movimientos.

NO alterar el diseño del Dashboard.

NO alterar innecesariamente la navegación mobile.

Agregar únicamente lo necesario para incorporar Proveedores correctamente.

============================================================
29. CRITERIO DE FUNCIONALIDAD
============================================================

El prototipo debe permitir demostrar este flujo completo:

ADMINISTRADOR
↓
Catálogo
↓
Proveedores
↓
Nuevo proveedor
↓
Registrar datos
↓
Guardar
↓
Proveedor ACTIVO
↓
Entradas
↓
Nueva recepción externa
↓
Seleccionar proveedor
↓
Seleccionar productos
↓
Registrar cantidades
↓
Ubicación
↓
Lote/serie cuando corresponda
↓
Documentación/evidencia
↓
Confirmar recepción
↓
Guardar proveedor histórico
↓
Actualizar inventario
↓
Trazabilidad
↓
Historial

============================================================
30. FLUJO DE DESACTIVACIÓN
============================================================

Demostrar también:

Proveedor ACTIVO
↓
Desactivar
↓
Proveedor INACTIVO
↓
NO aparece en nuevas recepciones
↓
SÍ aparece en historial
↓
Las recepciones antiguas conservan sus datos originales.

============================================================
31. INTEGRACIÓN CON EL PROTOTIPO ACTUAL
============================================================

ANTES DE MODIFICAR:

Analizar las pantallas, componentes y navegación que YA EXISTEN.

REUTILIZAR:

- tablas existentes;
- formularios existentes;
- modales existentes;
- badges;
- filtros;
- botones;
- breadcrumbs;
- layouts;
- componentes responsive.

NO crear componentes visuales duplicados si ya existe uno equivalente.

============================================================
32. RESULTADO FINAL
============================================================

El resultado debe parecer:

SIGA EXISTENTE
+
ACTUALIZACIÓN DE PROVEEDORES

NO debe parecer:

NUEVA APLICACIÓN.

La actualización debe integrarse naturalmente al diseño actual.

La prioridad es:

1. Mantener el prototipo existente.
2. Incorporar Proveedores correctamente.
3. Integrarlo con Entradas.
4. Mantener trazabilidad histórica.
5. Respetar roles y permisos.
6. Mantener responsive Web/Mobile.
7. Mantener la estética existente.
8. No agregar funcionalidades que estén fuera del alcance.

ANTES DE TERMINAR:

Verificar que ningún módulo existente haya sido eliminado o reemplazado.

Verificar que ningún rol tenga acceso a funciones que no le corresponden.

Verificar que los proveedores inactivos no puedan utilizarse en nuevas recepciones.

Verificar que los proveedores históricos continúen visibles en recepciones ya confirmadas.

Verificar que la información histórica del proveedor no cambie cuando el maestro sea actualizado.

NO EMPEZAR DESDE CERO.

MODIFICAR Y EXTENDER EL PROYECTO SIGA EXISTENTE.