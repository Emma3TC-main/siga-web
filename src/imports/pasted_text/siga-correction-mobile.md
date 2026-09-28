===============================================================
CORRECCIÓN DEL PROTOTIPO SIGA EXISTENTE
USUARIO MÓVIL AUTORIZADO + NAVEGACIÓN MOBILE
===============================================================

⚠️ IMPORTANTE ⚠️

ESTA ES UNA CORRECCIÓN DEL PROYECTO SIGA EXISTENTE.

NO CREAR SIGA DESDE CERO.

NO CREAR UNA NUEVA APLICACIÓN.

NO BORRAR PANTALLAS.

NO ELIMINAR MÓDULOS.

NO REHACER EL SISTEMA DE ROLES.

NO VOLVER A CREAR EL MÓDULO DE PROVEEDORES.

NO MODIFICAR FUNCIONALIDADES QUE YA ESTÁN CORRECTAMENTE
IMPLEMENTADAS.

Realizar únicamente las correcciones indicadas a continuación.

===============================================================
1. PROBLEMA ACTUAL — USUARIO MÓVIL AUTORIZADO
===============================================================

Se ha detectado un problema con el rol:

"Usuario Móvil Autorizado"

Actualmente este rol ha quedado limitado incorrectamente y
NO permite acceder desde la VERSIÓN WEB a los módulos que
corresponden a su rol y permisos.

CORREGIR ESTE COMPORTAMIENTO.

IMPORTANTE:

"Usuario Móvil Autorizado" es un ROL, NO significa que el
usuario solamente pueda utilizar la aplicación Mobile.

El nombre del rol NO debe utilizarse como una restricción
automática que bloquee el acceso desde Web.

===============================================================
2. USUARIO MÓVIL AUTORIZADO — WEB
===============================================================

Permitir que el Usuario Móvil Autorizado pueda iniciar sesión
desde la versión Web.

Después del login:

mostrar el Dashboard Web correspondiente a su rol.

Permitir acceso a TODOS los módulos que estén autorizados
para ese rol.

NO bloquear el acceso simplemente porque el rol se llama
"Usuario Móvil Autorizado".

===============================================================
3. REGLA DE PERMISOS
===============================================================

El acceso debe depender de:

ROL + PERMISOS

y NO de:

ROL + DISPOSITIVO.

Es decir:

Usuario Móvil Autorizado
+
Web
=
puede acceder a los módulos permitidos.

Usuario Móvil Autorizado
+
Mobile
=
puede acceder a los módulos permitidos.

La interfaz puede adaptarse al dispositivo, pero los permisos
de negocio deben mantenerse.

===============================================================
4. NO CONFUNDIR ROL CON DISPOSITIVO
===============================================================

IMPORTANTE:

"Usuario Móvil Autorizado" NO significa:

"usuario que solamente puede utilizar Mobile".

Significa un rol autorizado para determinadas operaciones
móviles y/o funciones definidas por permisos.

No bloquear:

- Login Web
- Dashboard Web
- módulos Web autorizados
- consultas Web autorizadas
- operaciones Web autorizadas

===============================================================
5. MÓDULOS WEB DEL USUARIO MÓVIL AUTORIZADO
===============================================================

Mostrar únicamente los módulos que realmente tenga autorizados.

NO mostrar todos los módulos automáticamente.

NO ocultar todos los módulos por ser Usuario Móvil Autorizado.

Aplicar la misma lógica RBAC existente.

Si tiene permiso:

mostrar módulo.

Si NO tiene permiso:

ocultar módulo.

Si intenta entrar directamente a un módulo sin permiso:

mostrar:

"Acceso restringido"

"Tu rol no tiene permisos para acceder a esta sección."

===============================================================
6. MANTENER LA DIFERENCIACIÓN DE ROLES
===============================================================

NO hacer que todos los roles tengan los mismos permisos.

Mantener diferenciados:

1. Administrador
2. Supervisor de Almacén
3. Encargado de Almacén
4. Usuario Autorizado
5. Usuario Móvil Autorizado

La corrección consiste únicamente en evitar que
"Usuario Móvil Autorizado" sea interpretado como
"solo puede entrar desde Mobile".

===============================================================
7. WEB Y MOBILE
===============================================================

La diferencia entre Web y Mobile debe ser principalmente:

PRESENTACIÓN
+
DISTRIBUCIÓN
+
EXPERIENCIA DE USUARIO

NO debe ser una eliminación arbitraria de funcionalidades.

Si un usuario tiene permiso para utilizar una función:

esa función debe poder representarse en Web y/o Mobile
según corresponda al flujo definido.

No bloquear el acceso Web por el nombre del rol.

===============================================================
8. CORRECCIÓN DE LA BARRA DE NAVEGACIÓN MOBILE
===============================================================

Además, mejorar visual y funcionalmente la:

"BARRA DE NAVEGACIÓN INFERIOR MOBILE"

La barra actual presenta problemas de diseño y debe ser
mejorada.

NO reemplazar la navegación por otra completamente diferente.

Mantener las opciones y funcionalidades existentes.

Mejorar únicamente:

- distribución;
- espaciado;
- alineación;
- jerarquía;
- tamaño de iconos;
- tamaño de textos;
- área táctil;
- indicador de sección activa;
- separación;
- adaptación a Safe Area;
- equilibrio visual.

===============================================================
9. DISEÑO PROFESIONAL DE LA BARRA INFERIOR
===============================================================

La navegación inferior debe tener apariencia de aplicación
profesional de nivel empresarial.

Debe ser:

- limpia;
- moderna;
- equilibrada;
- minimalista;
- fácil de entender;
- cómoda para interacción táctil.

Evitar:

- iconos demasiado grandes;
- textos demasiado pequeños;
- elementos amontonados;
- espacios desiguales;
- botones pegados entre sí;
- indicadores desalineados;
- exceso de colores;
- sombras excesivas.

===============================================================
10. ESTRUCTURA DE LA BARRA
===============================================================

Mantener una estructura de navegación inferior compacta.

Utilizar las secciones principales ya existentes.

Si existen más módulos de los que pueden mostrarse cómodamente:

utilizar:

"Más"

para acceder a los módulos secundarios.

Ejemplo:

┌──────────────────────────────────────────┐
│                                          │
│ Inicio   Inventario   Movimientos   Más │
│   ●          ○             ○         ⋮   │
└──────────────────────────────────────────┘

NO intentar colocar todos los módulos en la barra inferior.

La barra debe mostrar únicamente las secciones principales.

Los demás módulos permanecen accesibles mediante "Más"
cuando el rol tenga permisos.

===============================================================
11. NAVEGACIÓN "MÁS"
===============================================================

Crear o mejorar el menú "Más" únicamente si ya existe o es
necesario para organizar correctamente los módulos.

Dentro de "Más":

mostrar los módulos adicionales permitidos para el usuario.

Ejemplo:

Más

Transferencias
Ajustes
Conteos físicos
Trazabilidad
Reportes
Auditoría
Autorizaciones
Catálogo
Administración
Configuración

IMPORTANTE:

La lista debe cambiar según el rol.

NO mostrar funciones no autorizadas.

===============================================================
12. INDICADOR DE SECCIÓN ACTIVA
===============================================================

La sección actualmente seleccionada debe ser claramente
identificable.

Utilizar la identidad visual existente de SIGA.

Utilizar principalmente:

#093C5D
#3B7597
#6FD1D7
#5DF8D8

No utilizar colores aleatorios.

El estado activo debe ser visible pero elegante.

===============================================================
13. ICONOS
===============================================================

Mantener la familia de iconos utilizada actualmente.

Los iconos deben:

- tener tamaños consistentes;
- estar perfectamente centrados;
- tener separación uniforme;
- mantener el mismo estilo visual.

NO mezclar estilos de iconos.

NO utilizar iconos excesivamente grandes.

===============================================================
14. TEXTO DE LA NAVEGACIÓN
===============================================================

Los textos deben ser:

- legibles;
- cortos;
- consistentes;
- correctamente alineados.

No reducir demasiado el tamaño de fuente para intentar
introducir más elementos.

Si un módulo tiene un nombre largo:

utilizar una etiqueta corta y comprensible.

===============================================================
15. ÁREA TÁCTIL
===============================================================

Cada elemento de la navegación debe tener una zona táctil
cómoda.

No utilizar botones demasiado pequeños.

Debe ser fácil tocar:

- Inicio;
- Inventario;
- Movimientos;
- Escanear, si existe;
- Más.

===============================================================
16. SAFE AREA INFERIOR
===============================================================

La barra inferior debe respetar el área segura inferior
del dispositivo.

El Home Indicator pertenece al dispositivo.

NO crear otro Home Indicator.

NO colocar elementos debajo de él.

La barra debe tener padding inferior suficiente para evitar
superposición.

===============================================================
17. DYNAMIC ISLAND
===============================================================

Mantener la regla anterior:

La Dynamic Island pertenece al dispositivo y NO a SIGA.

NO crear una Dynamic Island.

NO dibujar una cápsula negra.

NO intentar eliminarla.

El Header debe respetar la Safe Area superior.

===============================================================
18. HEADER MOBILE
===============================================================

NO modificar innecesariamente el Header existente.

Mantener:

- buscador;
- notificaciones;
- avatar;
- demás elementos existentes.

Únicamente asegurar que:

- no quede debajo de Dynamic Island;
- respete la Safe Area;
- no duplique Status Bar;
- no se superponga con contenido.

===============================================================
19. STATUS BAR
===============================================================

Si el preview del dispositivo proporciona:

- hora;
- batería;
- señal;
- Wi-Fi;

NO crear una segunda Status Bar.

La Status Bar pertenece al sistema operativo.

SIGA debe respetar su espacio.

===============================================================
20. NO MOVER EL DASHBOARD
===============================================================

No desplazar todo el Dashboard para solucionar problemas
del Header o Safe Area.

No agregar padding superior excesivo.

La corrección debe realizarse localmente en el Header.

Mantener:

- tarjetas;
- gráficos;
- KPI;
- contenido;
- márgenes.

===============================================================
21. RESPONSIVE
===============================================================

La barra inferior debe adaptarse correctamente a:

- teléfonos pequeños;
- teléfonos medianos;
- teléfonos grandes;
- orientación vertical.

No utilizar posiciones absolutas que generen:

- solapamientos;
- elementos cortados;
- overflow;
- textos fuera de pantalla.

===============================================================
22. NO MODIFICAR DESKTOP
===============================================================

Esta actualización NO debe alterar visualmente la versión
Desktop.

La corrección del menú inferior corresponde exclusivamente
a Mobile.

La corrección del Usuario Móvil Autorizado SÍ debe aplicarse
al sistema de permisos Web y Mobile.

===============================================================
23. PROVEEDORES
===============================================================

PROVEEDORES YA ESTÁ IMPLEMENTADO.

NO volver a crearlo.

NO modificar su estructura.

NO modificar sus formularios.

NO modificar su lógica.

Únicamente conservarlo dentro de las reglas de permisos
existentes.

===============================================================
24. PRUEBA OBLIGATORIA — USUARIO MÓVIL AUTORIZADO
===============================================================

Realizar esta prueba:

Login
↓
Usuario Móvil Autorizado
↓
Versión Web
↓
Dashboard

Resultado esperado:

El usuario puede entrar correctamente.

Después:

Dashboard
↓
módulo autorizado
↓
acceso correcto

Si tiene permiso para otro módulo:

también puede acceder.

Si NO tiene permiso:

mostrar:

"Acceso restringido"

No bloquear todos los módulos por defecto.

===============================================================
25. PRUEBA MOBILE
===============================================================

Usuario Móvil Autorizado
↓
Login Mobile
↓
Dashboard Mobile
↓
Navegación inferior

Verificar:

✓ barra correctamente alineada;
✓ iconos centrados;
✓ textos legibles;
✓ sección activa visible;
✓ áreas táctiles adecuadas;
✓ Safe Area inferior;
✓ Home Indicator respetado;
✓ sin elementos cortados;
✓ sin overflow horizontal.

===============================================================
26. PRUEBA DE NAVEGACIÓN
===============================================================

Probar:

Inicio
→ funciona.

Inventario
→ funciona.

Movimientos
→ funciona.

Más
→ abre correctamente.

Desde Más:

cada módulo autorizado
→ debe abrir correctamente.

Cada módulo no autorizado
→ NO debe aparecer.

===============================================================
27. CRITERIO VISUAL
===============================================================

La barra inferior debe verse como una navegación Mobile
profesional de un sistema empresarial.

Debe mantener la identidad SIGA:

#093C5D
#3B7597
#6FD1D7
#5DF8D8

No introducir un estilo visual completamente diferente.

===============================================================
28. REGLA FINAL DE NO DESTRUCCIÓN
===============================================================

NO eliminar módulos.

NO eliminar permisos.

NO eliminar roles.

NO eliminar pantallas.

NO eliminar navegación.

NO eliminar Proveedores.

NO modificar Desktop innecesariamente.

NO empezar desde cero.

NO reemplazar el proyecto existente.

Modificar únicamente:

1. Acceso Web del Usuario Móvil Autorizado.
2. Organización de módulos según permisos.
3. Diseño y usabilidad de la barra inferior Mobile.
4. Safe Area superior/inferior.
5. Ajustes necesarios de responsive Mobile.

===============================================================
29. RESULTADO ESPERADO
===============================================================

El resultado final debe mantener exactamente el SIGA existente,
pero corregir:

PROBLEMA 1:
Usuario Móvil Autorizado bloqueado incorrectamente en Web.

SOLUCIÓN:
Puede acceder desde Web a los módulos que su rol/permisos
le permiten.

PROBLEMA 2:
Barra inferior Mobile visualmente deficiente.

SOLUCIÓN:
Rediseñar únicamente su distribución y presentación para que
sea moderna, limpia, profesional, táctil y responsive.

PROBLEMA 3:
Posibles problemas con Safe Area.

SOLUCIÓN:
Header y navegación inferior respetan las áreas seguras
del dispositivo.

NO realizar ningún otro cambio.