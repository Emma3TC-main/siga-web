SIGA — Sistema Integral de Gestión de Almacén para el Sector Mecánico/Minero
INSTRUCCIÓN PRINCIPAL
Construye una aplicación web responsive de nivel profesional y una experiencia móvil complementaria para SIGA — Sistema Integral de Gestión de Almacén para el Sector Mecánico/Minero.
No quiero únicamente pantallas estáticas ni un wireframe. Quiero un prototipo funcional de alta fidelidad, navegable de extremo a extremo, con datos de demostración, estados, formularios, tablas, filtros, búsquedas, validaciones, modales, confirmaciones, alertas, permisos por rol, flujos condicionales, trazabilidad y simulación de persistencia.
El resultado debe sentirse como un software empresarial/ERP/WMS profesional utilizado por una compañía mecánica/minera, no como una plantilla genérica de dashboard.
La interfaz debe ser moderna, sobria, industrial, tecnológica, clara y profesional, priorizando usabilidad en almacenes y operaciones mecánico-mineras.
________________________________________
1. FUENTE DE VERDAD DEL PRODUCTO
Utiliza como fuente funcional el siguiente alcance:
SIGA administra:
•	Materiales industriales.
•	Insumos.
•	Repuestos.
•	Maquinaria pesada.
•	Inventario multiubicación.
•	Lotes/coladas.
•	Series/activos.
•	Vencimientos.
•	Entradas.
•	Salidas.
•	Transferencias.
•	Ajustes positivos y negativos.
•	Stock mínimo.
•	Conteos físicos.
•	Costo promedio ponderado.
•	Kardex.
•	Auditoría.
•	Evidencias digitales.
•	Reportes.
•	Indicadores.
•	Autorizaciones de movimientos sensibles.
•	Usuarios, roles y permisos.
•	Categorías.
•	Productos.
•	Unidades de medida.
•	Ubicaciones.
•	Responsables.
•	Centros de costo.
•	Tipos de movimiento.
•	Parámetros administrativos.
El inventario es la fuente oficial centralizada.
Todo movimiento confirmado debe generar una variación trazable del inventario.
Nunca permitir stock negativo.
Nunca modificar directamente un movimiento histórico confirmado.
Las correcciones deben realizarse mediante movimientos compensatorios o ajustes autorizados.
La aplicación web y la aplicación móvil deben representar las mismas reglas de negocio.
________________________________________
2. OBJETIVO DE EXPERIENCIA
Diseña SIGA como un producto SaaS/ERP industrial profesional.
Inspiración visual:
•	ERP empresarial moderno.
•	WMS profesional.
•	Software de logística industrial.
•	Plataformas de gestión de activos.
•	Interfaces B2B premium.
•	Sistemas utilizados en minería, construcción, mantenimiento y operaciones industriales.
NO copiar literalmente ningún producto existente.
Tomar únicamente principios profesionales de UX:
•	jerarquía visual clara;
•	navegación consistente;
•	tablas potentes;
•	búsqueda global;
•	filtros;
•	estados;
•	acciones primarias visibles;
•	formularios por pasos cuando sean complejos;
•	confirmaciones antes de operaciones críticas;
•	feedback inmediato;
•	dashboards ejecutivos;
•	trazabilidad visual;
•	responsive design;
•	accesibilidad;
•	prevención de errores.
________________________________________
3. IDENTIDAD VISUAL Y SISTEMA DE COLORES

La identidad visual de SIGA debe utilizar EXCLUSIVAMENTE como paleta principal los siguientes colores corporativos:

- #093C5D — Azul Marino Industrial
- #3B7597 — Azul Acero
- #6FD1D7 — Turquesa Tecnológico
- #5DF8D8 — Verde Turquesa Energético

Estos colores deben ser parte obligatoria del Design System y mantenerse consistentes en toda la aplicación web y móvil.

NO sustituir estos colores por una paleta genérica.
NO utilizar morados, naranjas, amarillos o azules diferentes como colores principales.
Los colores adicionales únicamente podrán utilizarse cuando sean necesarios para comunicar estados semánticos como error, advertencia o información crítica.

---

## 3.1 COLOR PRIMARIO — #093C5D

Usar #093C5D como color estructural principal.

Aplicaciones:

- Sidebar.
- Header principal cuando corresponda.
- Logo SIGA.
- Títulos importantes.
- Navegación principal.
- Encabezados de módulos.
- Botones primarios en contextos importantes.
- Elementos de identidad corporativa.
- Tablas y encabezados de secciones.
- Estados activos importantes.
- Elementos de alta jerarquía visual.

Debe transmitir:

- seguridad;
- confianza;
- industria;
- control;
- estabilidad;
- profesionalismo.

Evitar utilizarlo como fondo masivo en toda la interfaz.

---

## 3.2 COLOR SECUNDARIO — #3B7597

Usar #3B7597 como azul secundario/acero.

Aplicaciones:

- Botones secundarios.
- Links.
- Iconos.
- Estados activos secundarios.
- Encabezados secundarios.
- Gráficos.
- Barras de progreso.
- Indicadores.
- Filtros seleccionados.
- Elementos interactivos.
- Hover de elementos relacionados con el color primario.
- Componentes de navegación secundaria.

Debe funcionar como puente visual entre el azul oscuro #093C5D y los tonos turquesa.

---

## 3.3 COLOR ACCENT — #6FD1D7

Usar #6FD1D7 como color de acento tecnológico.

Aplicaciones:

- Highlights.
- KPI destacados.
- Indicadores informativos.
- Elementos seleccionados.
- Gráficos.
- Badges informativos.
- Fondos suaves de tarjetas.
- Estados de información.
- Elementos de trazabilidad.
- Timeline.
- Indicadores de progreso.
- Componentes interactivos destacados.

Utilizarlo con moderación para evitar saturación.

Cuando se utilice como fondo, garantizar suficiente contraste del texto.

---

## 3.4 COLOR ACCENT POSITIVO — #5DF8D8

Usar #5DF8D8 como color de acento energético/positivo.

Aplicaciones:

- Confirmaciones.
- Éxitos.
- Operaciones completadas.
- KPI positivos.
- Indicadores de disponibilidad.
- Stock saludable.
- Estado "Operativo" de maquinaria.
- Acciones confirmadas.
- Estados de sincronización correcta.
- Elementos de éxito en dashboards.
- Microinteracciones.

NO utilizar #5DF8D8 como color principal de grandes superficies.

Debe utilizarse principalmente como acento para llamar la atención sobre resultados positivos.

---

# 3.5 COLORES NEUTROS

La interfaz debe complementar la paleta corporativa con neutros profesionales:

- Blanco para superficies principales.
- Gris muy claro para fondos.
- Gris medio para información secundaria.
- Gris oscuro para texto.
- Negro/gris muy oscuro para máxima legibilidad.

Los neutros deben permitir que #093C5D, #3B7597, #6FD1D7 y #5DF8D8 sean los protagonistas.

No utilizar fondos excesivamente saturados.

---

# 3.6 COLORES SEMÁNTICOS

Los colores corporativos NO deben sustituir completamente los colores semánticos.

Para estados críticos utilizar:

ERROR:
Rojo profesional, únicamente para errores, stock insuficiente, operaciones rechazadas o incidencias críticas.

WARNING:
Ámbar/naranja profesional, únicamente para advertencias como bajo stock, vencimientos próximos o autorizaciones pendientes.

INFO:
Utilizar preferentemente #6FD1D7.

SUCCESS:
Utilizar preferentemente #5DF8D8.

NEUTRAL:
Grises.

Estos colores semánticos deben utilizarse únicamente cuando la información requiera diferenciación inmediata.

---

# 3.7 DESIGN TOKENS

Crear variables reutilizables:

Primary:
#093C5D

Secondary:
#3B7597

Accent:
#6FD1D7

Success/Accent:
#5DF8D8

Background:
White / very light neutral

Surface:
White

Text Primary:
Dark neutral

Text Secondary:
Medium gray

Border:
Light neutral gray

Error:
Semantic red

Warning:
Semantic amber

---

# 3.8 REGLA DE CONTRASTE

Priorizar siempre la legibilidad.

Texto blanco sobre #093C5D.

Texto blanco sobre #3B7597 cuando el contraste sea suficiente.

Para #6FD1D7 y #5DF8D8 utilizar preferentemente texto oscuro.

No colocar texto blanco pequeño sobre #6FD1D7 o #5DF8D8.

Los componentes deben mantener contraste suficiente en:

- botones;
- tablas;
- badges;
- inputs;
- navegación;
- dashboards;
- tarjetas;
- estados;
- móvil.

---

# 3.9 DASHBOARD CON LA PALETA CORPORATIVA

El Dashboard debe utilizar la paleta de manera estratégica.

#093C5D:
estructura, títulos, navegación y elementos principales.

#3B7597:
gráficos principales, filtros y acciones secundarias.

#6FD1D7:
indicadores informativos, gráficos secundarios y highlights.

#5DF8D8:
indicadores positivos, disponibilidad, operaciones exitosas y stock saludable.

El dashboard debe verse profesional y elegante.

Evitar convertirlo en una interfaz excesivamente brillante.

La paleta debe sentirse industrial, tecnológica y premium.

---

# 3.10 SIDEBAR

El Sidebar desktop debe utilizar predominantemente:

Background:
#093C5D

Texto:
Blanco

Iconos:
Blanco / #6FD1D7

Elemento seleccionado:
utilizar una combinación visual de #3B7597 y/o #6FD1D7 sin perder contraste.

Indicador activo:
#5DF8D8 o #6FD1D7.

El resultado debe permitir identificar claramente dónde se encuentra el usuario.

---

# 3.11 BOTONES

PRIMARY:

Fondo:
#093C5D

Texto:
Blanco

Hover:
#3B7597

SECONDARY:

Fondo:
#3B7597

Texto:
Blanco

Hover:
#093C5D

ACCENT:

Fondo:
#6FD1D7

Texto:
#093C5D

SUCCESS:

Fondo:
#5DF8D8

Texto:
#093C5D

DANGER:

Utilizar rojo semántico.

Los botones deben mantener consistencia en desktop y móvil.

---

# 3.12 KPI CARDS

Los KPI deben utilizar fondos predominantemente neutros y pequeños acentos corporativos.

Ejemplo:

Card:
fondo blanco.

Título:
gris oscuro.

Número:
#093C5D.

Icono:
#3B7597.

Indicador positivo:
#5DF8D8.

Indicador informativo:
#6FD1D7.

Esto evita saturar el dashboard.

---

# 3.13 ESTADOS DEL INVENTARIO

Normal / saludable:
#5DF8D8

Informativo:
#6FD1D7

En proceso:
#3B7597

Bajo stock:
warning semántico.

Sin stock:
error semántico.

Vencido:
error semántico.

Cuarentena:
warning semántico.

---

# 3.14 MAQUINARIA

Estados:

OPERATIVO:
#5DF8D8

EN MANTENIMIENTO:
warning semántico.

INOPERATIVO:
error semántico.

EN TRÁNSITO:
#6FD1D7

FUERA DE SERVICIO:
gris oscuro.

Los estados deben aparecer mediante:

- Badge.
- Indicador.
- Icono.
- Texto.

Nunca depender únicamente del color.

---

# 3.15 TRAZABILIDAD

La sección de trazabilidad debe tener una identidad visual basada principalmente en:

#093C5D
#3B7597
#6FD1D7

Usar:

- líneas de timeline;
- nodos;
- iconos;
- estados;
- conexiones;
- historial.

Para eventos completados utilizar #5DF8D8.

La trazabilidad debe sentirse técnica y precisa.

---

# 3.16 AUDITORÍA

La auditoría debe utilizar una interfaz sobria.

Base:
#093C5D + neutros.

Eventos normales:
#3B7597.

Eventos informativos:
#6FD1D7.

Eventos exitosos:
#5DF8D8.

Eventos críticos:
rojo semántico.

Evitar utilizar colores llamativos sin significado.

---

# 3.17 MÓVIL

La aplicación móvil debe conservar exactamente la misma identidad visual.

Header:
#093C5D.

Bottom navigation:
#093C5D.

Elemento activo:
#6FD1D7.

Acciones positivas:
#5DF8D8.

Acciones secundarias:
#3B7597.

Mantener una apariencia consistente entre Web y Mobile.

---

# 3.18 PRINCIPIO VISUAL FINAL

La proporción visual aproximada debe ser:

60–70%:
blancos y neutros.

15–20%:
#093C5D.

10–15%:
#3B7597.

5–10%:
#6FD1D7 y #5DF8D8.

Los porcentajes son una guía visual, no una restricción matemática.

La interfaz debe sentirse principalmente limpia y profesional, utilizando la paleta corporativa como sistema de jerarquía y no como decoración.

RESULTADO VISUAL BUSCADO:

"Software empresarial industrial de alta gama, tecnológico, confiable, preciso y moderno."

La identidad visual debe ser consistente en:

- Login.
- Dashboard.
- Inventario.
- Movimientos.
- Catálogos.
- Ubicaciones.
- Maquinaria.
- Trazabilidad.
- Reportes.
- Auditoría.
- Administración.
- Móvil.________________________________________
4. RESPONSIVE DESIGN
Crear:
Desktop
Optimizado para:
1440 × 900.
También debe adaptarse correctamente a:
1280 × 800.
1024 × 768.
Tablet
Diseño adaptativo.
Mobile
Optimizado para:
390 × 844.
375 × 812.
La experiencia móvil NO debe ser simplemente el desktop reducido.
Debe tener:
•	navegación inferior;
•	acciones rápidas;
•	tarjetas;
•	formularios verticales;
•	lector/entrada de códigos simulada;
•	botones grandes;
•	información priorizada;
•	operación con una mano.
________________________________________
5. ARQUITECTURA GENERAL DE NAVEGACIÓN WEB
Crear un Sidebar permanente en desktop.
Menú principal
1.	Inicio / Dashboard
2.	Inventario
3.	Movimientos
o	Entradas
o	Salidas
o	Transferencias
o	Ajustes
o	Conteos físicos
4.	Catálogo
o	Productos
o	Categorías
o	Unidades de medida
5.	Ubicaciones
6.	Maquinaria y activos
7.	Trazabilidad
8.	Autorizaciones
9.	Reportes
10.	Auditoría
11.	Indicadores
12.	Administración
•	Usuarios
•	Roles y permisos
•	Responsables
•	Centros de costo
•	Tipos de movimiento
•	Documentos
•	Parámetros
13.	Integraciones
14.	Continuidad y monitoreo
15.	Perfil
El menú debe cambiar dinámicamente según el rol.
No mostrar funciones no autorizadas.
________________________________________
6. ROLES
Implementar estos roles:
Administrador
Permisos:
•	gestionar usuarios;
•	gestionar roles;
•	gestionar catálogos;
•	categorías;
•	unidades;
•	parámetros;
•	stock mínimo;
•	auditoría;
•	indicadores;
•	reportes;
•	inventario;
•	entradas;
•	salidas;
•	transferencias;
•	ajustes;
•	autorizaciones.
Supervisor de Almacén
Puede:
•	supervisar operaciones;
•	consultar inventario;
•	registrar entradas;
•	registrar salidas;
•	transferencias;
•	ejecutar ajustes;
•	autorizar movimientos sensibles;
•	consultar reportes;
•	consultar historial;
•	auditoría según permiso.
Encargado de Almacén
Puede:
•	consultar inventario;
•	registrar entradas;
•	registrar salidas;
•	transferencias;
•	consultar reportes;
•	consultar historial.
No permitir ajustes por defecto.
Usuario Autorizado
Puede consultar y ejecutar únicamente operaciones permitidas por su rol.
Usuario Móvil
Puede consultar inventario y registrar movimientos permitidos desde móvil.
Implementar selector de usuario/demo para poder demostrar los diferentes permisos.
________________________________________
7. LOGIN
Crear pantalla de autenticación profesional.
Elementos:
•	Logo SIGA.
•	Nombre completo del sistema.
•	Usuario/email.
•	Contraseña.
•	Mostrar/ocultar contraseña.
•	Recordarme.
•	Recuperar contraseña.
•	Botón Ingresar.
•	Estado de carga.
•	Error de credenciales.
•	Usuario desactivado.
•	Sesión expirada.
Agregar usuarios demo:
Administrador
admin@siga.demo
Supervisor
supervisor@siga.demo
Encargado
almacen@siga.demo
Usuario autorizado
usuario@siga.demo
Usuario móvil
movil@siga.demo
La autenticación puede ser simulada para el prototipo.
________________________________________
8. DASHBOARD
Crear un dashboard operativo profesional.
No saturar.
Mostrar aproximadamente 6–8 indicadores prioritarios.
KPI
1.	Valor total inmovilizado.
2.	Disponibilidad de activos.
3.	Productos bajo mínimo.
4.	Productos sin stock.
5.	Insumos próximos a vencer.
6.	Entradas del período.
7.	Salidas del período.
8.	Alertas/movimientos sensibles.
Cada KPI debe ser interactivo.
Al hacer click debe llevar al módulo correspondiente filtrado.
Visualizaciones
Agregar:
•	tendencia de entradas vs salidas;
•	distribución de inventario por categoría;
•	inventario por ubicación;
•	productos bajo mínimo;
•	movimientos recientes;
•	alertas críticas;
•	maquinaria por estado.
No sobrecargar el dashboard.
Alertas
Mostrar:
•	Sin stock.
•	Bajo mínimo.
•	Próximo vencimiento.
•	Vencido.
•	Movimiento sensible pendiente.
•	Ajuste pendiente de autorización.
•	Maquinaria en mantenimiento.
•	Maquinaria inoperativa.
________________________________________
9. INVENTARIO
Crear pantalla principal de inventario.
Tabla
Columnas:
•	SKU.
•	Producto.
•	Categoría.
•	Tipo.
•	Stock total.
•	Unidad.
•	Stock mínimo.
•	Estado.
•	Ubicaciones.
•	Lote/colada.
•	Serie/activo.
•	Vencimiento.
•	Costo promedio.
•	Valorización.
•	Estado operativo si es maquinaria.
•	Acciones.
Estados
•	Normal.
•	Bajo stock.
•	Sin stock.
•	Próximo a vencer.
•	Vencido.
•	En cuarentena.
Funciones
•	búsqueda;
•	filtros;
•	búsqueda avanzada;
•	ordenar;
•	columnas configurables;
•	paginación;
•	exportar;
•	ver detalle;
•	registrar entrada;
•	registrar salida;
•	transferir.
________________________________________
10. DETALLE DEL PRODUCTO
Crear página detallada.
Header:
•	nombre;
•	SKU;
•	categoría;
•	estado;
•	imagen;
•	acciones.
Tabs:
1.	Resumen.
2.	Existencias.
3.	Ubicaciones.
4.	Lotes.
5.	Series.
6.	Kardex.
7.	Costos.
8.	Evidencias.
9.	Historial.
Mostrar:
•	stock total;
•	stock disponible;
•	stock mínimo;
•	unidad de almacén;
•	unidad base;
•	conversión;
•	costo promedio;
•	valorización;
•	información técnica.
________________________________________
11. CATÁLOGO DE PRODUCTOS
Crear CRUD completo.
Formulario:
•	SKU/código interno;
•	nombre/descripción;
•	categoría;
•	tipo;
•	estado;
•	unidad de almacén;
•	unidad base;
•	factor de conversión;
•	stock mínimo;
•	punto de reposición;
•	información técnica;
•	requiere lote;
•	requiere colada;
•	requiere vencimiento;
•	requiere número de serie;
•	estrategia de despacho;
•	costo;
•	observaciones.
Validar campos obligatorios.
No permitir productos sin categoría válida.
________________________________________
12. CATEGORÍAS
Categorías principales:
Materiales
Tipos:
•	Aceros y aleaciones estructurales.
•	Materiales antiabrasivos y de desgaste.
•	Materiales de soldadura y corte.
•	Elementos de fijación de alta resistencia.
•	Polímeros, cauchos y aislamientos industriales.
Insumos
Configurables.
Repuestos
Configurables.
Maquinaria pesada
Tipos:
•	Movimiento de tierras.
•	Carga y transporte.
•	Perforación y extracción.
•	Procesamiento y trituración.
•	Izaje y manipulación.
•	Equipos auxiliares y de soporte.
Permitir agregar categorías futuras mediante configuración.
________________________________________
13. UNIDADES DE MEDIDA
Crear CRUD.
Unidades base:
Masa:
•	kg
•	t
Longitud:
•	m
•	mm
Área:
•	m²
Volumen:
•	m³
•	L
•	gal
Logísticas:
•	und
•	juego/kit
•	par
Comerciales:
•	plancha
•	barra
•	tubo
•	rollo
•	cilindro
•	tambor
Permitir configurar:
Unidad de almacén
Unidad base
Factor de conversión
Ejemplo:
1 rollo = 500 m
Si salen 0.5 rollos:
250 m equivalentes.
Mostrar esta conversión automáticamente.
________________________________________
14. TRAZABILIDAD POR TIPO DE PRODUCTO
La UI debe cambiar dinámicamente según categoría/configuración.
Maquinaria
Obligatorio:
•	VIN/PIN;
•	código de activo;
•	marca;
•	modelo;
•	horómetro;
•	estado operativo;
•	ubicación.
Estados:
•	Operativo.
•	En mantenimiento.
•	Inoperativo.
•	En tránsito.
•	Fuera de servicio.
Repuestos
Por defecto cantidad.
Opcional:
•	número de serie.
Materiales
Cantidad + unidad.
Opcional:
•	lote;
•	colada.
Insumos
Cantidad.
Según configuración:
•	lote;
•	vencimiento.
Mostrar validaciones dinámicas.
________________________________________
15. UBICACIONES
Crear módulo visual de ubicaciones.
Estructura profunda
Almacén
→ Zona
→ Pasillo
→ Rack/Estante
→ Nivel
→ Posición
Estructura plana
Almacén/Patio
→ Zona
→ Posición
Áreas iniciales:
•	Almacén principal.
•	Patio de maquinaria.
•	Taller de mantenimiento.
•	Zona de recepción.
•	Zona de cuarentena.
•	Zona de despacho.
Crear vista:
•	árbol jerárquico;
•	listado;
•	mapa visual simplificado del almacén;
•	capacidad;
•	ocupación;
•	productos almacenados.
Un producto puede estar en múltiples ubicaciones.
Mostrar:
Stock total = suma de existencias válidas por ubicación.
________________________________________
16. ENTRADAS
Crear flujo completo tipo wizard.
Paso 1 — Producto
Seleccionar producto.
Paso 2 — Cantidad
•	cantidad;
•	unidad;
•	conversión automática.
Paso 3 — Ubicación
Seleccionar ubicación destino.
Paso 4 — Trazabilidad
Mostrar dinámicamente:
•	lote;
•	colada;
•	vencimiento;
•	serie;
•	activo.
Paso 5 — Costos
•	costo unitario;
•	costo total;
•	costo promedio proyectado.
Paso 6 — Documento
•	tipo de documento;
•	serie;
•	número/referencia;
•	motivo;
•	observaciones.
Documentos configurables:
•	Factura.
•	Guía de Remisión Remitente.
•	Vale.
•	Orden de trabajo.
•	Acta.
•	Otros.
No asumir que un documento interno es comprobante tributario.
Paso 7 — Responsable
•	solicitante/responsable;
•	centro de costo.
Paso 8 — Evidencia
Upload:
•	PDF;
•	JPG/JPEG;
•	PNG.
Paso 9 — Resumen
Mostrar todo antes de confirmar.
Confirmación
Al confirmar:
•	actualizar stock;
•	actualizar ubicación;
•	actualizar costo promedio cuando corresponda;
•	crear movimiento;
•	crear auditoría;
•	asociar evidencia.
Mostrar éxito:
"Entrada registrada correctamente"
con:
•	ID movimiento;
•	producto;
•	cantidad;
•	ubicación;
•	usuario;
•	fecha/hora.
Nunca actualizar parcialmente.
________________________________________
17. SALIDAS
Crear flujo completo.
Pasos:
1.	Producto.
2.	Cantidad.
3.	Unidad.
4.	Ubicación origen.
5.	Lote/serie/activo.
6.	Solicitante/responsable.
7.	Centro de costo.
8.	Motivo/tipo.
9.	Documento.
10.	Evidencia.
11.	Validación.
12.	Autorización si corresponde.
13.	Confirmación.
REGLA CRÍTICA
Si:
cantidad salida > existencia disponible específica
Entonces:
•	rechazar;
•	no modificar stock;
•	mostrar causa;
•	permitir corregir.
Nunca permitir stock negativo.
Movimiento sensible
Ejemplos:
•	maquinaria pesada;
•	repuestos de alto valor;
•	ajustes;
•	otras operaciones configuradas.
Si es sensible:
Mostrar estado:
"PENDIENTE DE AUTORIZACIÓN"
Crear pantalla de autorización para Supervisor/Administrador.
________________________________________
18. AUTORIZACIONES
Crear bandeja:
•	pendientes;
•	aprobadas;
•	rechazadas.
Cada solicitud debe mostrar:
•	ID;
•	tipo;
•	producto;
•	cantidad;
•	ubicación;
•	solicitante;
•	registrador;
•	centro de costo;
•	motivo;
•	documento;
•	evidencia;
•	fecha;
•	nivel de sensibilidad.
Acciones:
•	Aprobar.
•	Rechazar.
Rechazo requiere motivo.
Al aprobar:
la operación queda habilitada para confirmación.
Al rechazar:
no modificar stock.
Registrar autorizador.
________________________________________
19. TRANSFERENCIAS
Crear flujo:
Producto
→ Cantidad
→ Ubicación origen
→ Ubicación destino
→ Lote/serie/activo
→ Motivo
→ Evidencia
→ Resumen
→ Confirmar.
Validaciones:
•	origen obligatorio;
•	destino obligatorio;
•	origen ≠ destino;
•	existencia suficiente;
•	conservar lote/serie/activo.
Resultado:
disminuir origen.
aumentar destino.
NO modificar stock total organizacional.
Registrar historial.
________________________________________
20. AJUSTES
Crear módulo restringido.
Tipos:
•	Ajuste positivo.
•	Ajuste negativo.
Motivos:
•	Conteo físico.
•	Merma.
•	Daño en almacén.
•	Vencimiento.
•	Diferencia de inventario.
•	Error de registro anterior.
•	Otro motivo autorizado.
Campos:
•	producto;
•	ubicación;
•	cantidad;
•	unidad;
•	lote/serie;
•	motivo;
•	justificación;
•	responsable;
•	evidencia.
Mostrar advertencia:
"Los ajustes afectan directamente el inventario y requieren privilegios especiales."
Requerir autorización superior según política.
Registrar:
•	registrador;
•	autorizador;
•	fecha/hora;
•	evidencia.
Nunca editar movimientos históricos.
________________________________________
21. CONTEOS FÍSICOS
Crear módulo.
Permitir:
•	crear conteo;
•	seleccionar ubicación;
•	seleccionar productos;
•	registrar cantidad teórica;
•	registrar cantidad física;
•	calcular diferencia;
•	identificar sobrantes;
•	identificar faltantes;
•	generar propuesta de ajuste;
•	registrar evidencia.
Mostrar:
Exactitud de inventario / IRA.
Fórmula:
IRA (%) =
(ítems sin diferencia / ítems verificados) × 100
________________________________________
22. KARDEX / HISTORIAL
Crear pantalla de historial de producto.
Columnas:
•	fecha/hora;
•	movimiento;
•	entrada;
•	salida;
•	transferencia;
•	ajuste;
•	saldo;
•	usuario;
•	ubicación;
•	lote;
•	serie;
•	documento;
•	costo aplicado.
Filtros:
•	fecha;
•	movimiento;
•	producto;
•	usuario;
•	ubicación;
•	lote;
•	serie;
•	documento.
Crear timeline visual.
Los movimientos confirmados son inmutables.
________________________________________
23. MAQUINARIA Y ACTIVOS
Crear módulo especializado.
Vista de tarjetas + tabla.
Cada activo:
•	código;
•	VIN/PIN;
•	marca;
•	modelo;
•	horómetro;
•	estado;
•	ubicación;
•	fecha de ingreso;
•	último movimiento.
Estados visuales:
Operativo
En mantenimiento
Inoperativo
En tránsito
Fuera de servicio
Detalle del activo:
•	información general;
•	ubicación;
•	historial;
•	movimientos;
•	evidencias;
•	estado;
•	trazabilidad.
________________________________________
24. ALERTAS
Crear centro de alertas.
Categorías:
•	stock crítico;
•	bajo mínimo;
•	vencimiento;
•	vencido;
•	movimiento sensible;
•	autorización pendiente;
•	ajuste;
•	maquinaria;
•	incidencias.
Cada alerta debe ser accionable.
Ejemplo:
"12 productos por debajo del stock mínimo"
Botón:
"Ver productos"
________________________________________
25. REPORTES
Crear centro de reportes profesional.
Reportes obligatorios:
1.	Inventario Actual.
2.	Kardex / Historial de Producto.
3.	Trazabilidad de Maquinaria y Activos.
4.	Trazabilidad de Lotes y Vencimientos.
5.	Flujo de Movimientos.
6.	Alerta de Reposición.
7.	Consumo por Centro de Costo.
8.	Auditoría de Ajustes y Movimientos Sensibles.
9.	Valorización de Inventario.
10.	Inventario por Ubicación.
11.	Insumos Próximos a Vencer / Vencidos.
12.	Conteos y Exactitud de Inventario.
Cada reporte debe permitir:
•	filtros;
•	fecha;
•	categoría;
•	producto;
•	ubicación;
•	usuario;
•	centro de costo;
•	tipo de movimiento;
•	búsqueda;
•	ordenar;
•	vista previa;
•	exportar/simular exportación.
________________________________________
26. VALORIZACIÓN
Utilizar costo promedio ponderado simplificado.
Mostrar:
•	cantidad;
•	costo promedio;
•	valor total.
Fórmula conceptual:
Nuevo costo promedio =
(Valor stock anterior + Valor nueva entrada)
/
Cantidad total resultante
Las salidas utilizan el costo promedio vigente en el momento de la operación.
Mostrar moneda configurable.
________________________________________
27. INDICADORES ANALÍTICOS
Crear página de Analytics.
Indicadores:
IRA
Exactitud de Registro de Inventario.
Rotación
Valor de salidas/consumo del período
/
Valor promedio del inventario.
Cobertura
Stock disponible
/
Consumo promedio diario.
Tasa de mermas y ajustes
Mostrar tendencia.
Concentración del gasto
Por:
•	centro de costo;
•	área;
•	taller;
•	cuadrilla.
Disponibilidad de maquinaria
Activos operativos
/
Activos controlados × 100.
Otros:
•	consumo por categoría;
•	consumo por ubicación;
•	consumo por centro de costo;
•	productos sin movimiento;
•	antigüedad del inventario;
•	valor por categoría;
•	frecuencia de ajustes;
•	lotes próximos a vencer;
•	cumplimiento de reposición;
•	movimientos por usuario/área;
•	tendencia mensual de entradas y salidas.
________________________________________
28. AUDITORÍA
Crear módulo de auditoría avanzado.
Registrar como mínimo:
•	autenticaciones;
•	accesos relevantes;
•	creación/desactivación de usuarios;
•	cambios de roles;
•	cambios de permisos;
•	cambios de datos maestros críticos;
•	entradas;
•	salidas;
•	transferencias;
•	ajustes;
•	autorizaciones;
•	cambios de stock mínimo;
•	asociación de evidencias;
•	movimientos sensibles;
•	continuidad/restauración cuando corresponda.
Tabla:
•	fecha;
•	hora;
•	usuario;
•	acción;
•	módulo;
•	objeto;
•	resultado;
•	IP simulada;
•	descripción.
Crear timeline de auditoría.
Permitir abrir detalle del evento.
________________________________________
29. EVIDENCIAS DIGITALES
Crear componente reutilizable de evidencia.
Formatos:
•	PDF;
•	JPG;
•	JPEG;
•	PNG.
Permitir:
•	cargar;
•	previsualizar;
•	descargar/simular descarga;
•	eliminar solo si el permiso lo permite;
•	ver metadatos.
Casos:
•	foto de máquina;
•	repuesto de alto valor;
•	guía;
•	vale;
•	acta;
•	daño;
•	merma;
•	diferencia;
•	recepción.
La evidencia complementa los datos estructurados.
________________________________________
30. ADMINISTRACIÓN DE USUARIOS
CRUD completo.
Campos:
•	nombre;
•	apellido;
•	usuario;
•	email;
•	teléfono;
•	rol;
•	estado;
•	ámbito;
•	fecha creación;
•	último acceso.
Estados:
•	Activo.
•	Inactivo.
Al desactivar:
No permitir iniciar nuevas sesiones.
Pero conservar historial.
________________________________________
31. ROLES Y PERMISOS
Crear matriz visual.
Filas:
•	Inventario.
•	Entradas.
•	Salidas.
•	Transferencias.
•	Ajustes.
•	Autorizaciones.
•	Reportes.
•	Historial.
•	Auditoría.
•	Usuarios.
•	Catálogos.
•	Configuración.
Columnas:
•	Administrador.
•	Supervisor.
•	Encargado.
•	Usuario autorizado.
•	Usuario móvil.
Permitir editar permisos únicamente al Administrador.
________________________________________
32. RESPONSABLES Y CENTROS DE COSTO
CRUD.
Responsables pueden ser:
•	persona;
•	área;
•	taller;
•	cuadrilla;
•	centro de costo.
Cada salida debe poder asociarse a un responsable o centro de costo cuando corresponda.
________________________________________
33. PARÁMETROS
Crear módulo de configuración.
Parámetros:
•	stock mínimo;
•	punto de reposición;
•	sensibilidad;
•	estrategias FIFO;
•	FEFO;
•	selección manual;
•	documentos;
•	tipos de movimiento;
•	motivos de ajuste;
•	moneda;
•	alertas;
•	horizonte de vencimiento;
•	reglas de autorización.
Todo debe ser configurable.
________________________________________
34. INTEROPERABILIDAD
Crear sección "Integraciones".
Mostrar:
Power BI / Microsoft Fabric
Estado:
"Conectado / Lectura"
Indicar:
•	última sincronización;
•	registros disponibles;
•	estado;
•	modo solo lectura.
No permitir modificar inventario desde BI.
Almacenamiento de evidencias
Mostrar:
•	proveedor;
•	almacenamiento utilizado;
•	archivos;
•	estado;
•	última sincronización;
•	integridad.
La integración BI es unidireccional:
SIGA → BI.
BI nunca modifica SIGA.
________________________________________
35. MONITOREO Y CONTINUIDAD
Crear módulo de estado del sistema.
Mostrar:
•	estado de API;
•	base de datos;
•	almacenamiento;
•	evidencias;
•	BI;
•	backups;
•	health check;
•	última ejecución;
•	incidencias.
Objetivos:
RPO ≤ 24 horas.
RTO ≤ 4 horas.
Backup completo diario.
Retención de copias diarias por 30 días.
Mostrar dashboard de continuidad.
________________________________________
36. INCIDENTES
Crear centro de incidencias.
Tipos:
•	stock;
•	evidencia;
•	autorización;
•	integración;
•	sistema;
•	backup;
•	restauración.
Cada incidente:
•	ID;
•	fecha;
•	módulo;
•	severidad;
•	descripción;
•	estado;
•	usuario;
•	acciones.
Estados:
•	Abierto.
•	En análisis.
•	Resuelto.
•	Cerrado.
Nunca permitir que un error parcial altere el inventario.
________________________________________
37. EXPERIENCIA MÓVIL
Crear una aplicación móvil coherente con SIGA.
Pantallas:
1.	Login.
2.	Inicio.
3.	Inventario.
4.	Buscar producto.
5.	Detalle producto.
6.	Entrada rápida.
7.	Salida rápida.
8.	Transferencia.
9.	Escaneo/identificación.
10.	Mis movimientos.
11.	Pendientes de autorización si corresponde.
12.	Alertas.
13.	Perfil.
Bottom navigation:
•	Inicio.
•	Inventario.
•	Movimientos.
•	Alertas.
•	Más.
________________________________________
38. OPERACIÓN MÓVIL
Priorizar velocidad.
Crear botones:
"+ Entrada"
"+ Salida"
"Transferir"
"Consultar"
"Escanear"
Simular lector de código QR/barcode mediante interfaz.
Después de seleccionar un producto:
mostrar:
•	SKU;
•	nombre;
•	stock total;
•	ubicación;
•	stock disponible;
•	lote;
•	serie;
•	vencimiento.
Las mismas validaciones de web deben aplicarse en móvil.
________________________________________
39. DISEÑO DE FORMULARIOS MÓVILES
Usar:
•	campos grandes;
•	selects optimizados;
•	teclado numérico para cantidades;
•	validación inline;
•	sticky action button;
•	resumen antes de confirmar.
Para operaciones críticas:
mostrar confirmación explícita.
________________________________________
40. ESTADOS GLOBALES Y DATOS
Crear una estructura de datos simulada coherente.
Debe existir información de ejemplo para:
Productos
Al menos:
•	20 materiales;
•	15 insumos;
•	20 repuestos;
•	10 máquinas.
Ubicaciones
Al menos:
•	2 almacenes;
•	4 zonas;
•	varios racks;
•	niveles;
•	posiciones;
•	patio;
•	taller;
•	recepción;
•	cuarentena;
•	despacho.
Movimientos
Crear al menos:
•	20 entradas;
•	20 salidas;
•	10 transferencias;
•	5 ajustes;
•	5 movimientos sensibles;
•	autorizaciones aprobadas y rechazadas.
Usuarios
Crear usuarios de cada rol.
Alertas
Crear:
•	bajo stock;
•	sin stock;
•	vencimiento;
•	movimiento sensible;
•	autorización pendiente.
Los datos deben ser coherentes entre sí.
________________________________________
41. INTERACCIONES OBLIGATORIAS
NO crear botones decorativos.
Todo botón importante debe funcionar.
Implementar:
•	navegación;
•	tabs;
•	filtros;
•	búsqueda;
•	ordenamiento;
•	paginación;
•	creación;
•	edición;
•	desactivación;
•	confirmación;
•	cancelación;
•	modales;
•	drawers;
•	toast;
•	estados;
•	validaciones;
•	actualización de datos;
•	cambio de rol;
•	autorización;
•	rechazo;
•	generación de movimiento;
•	actualización visual del stock;
•	navegación desde KPI;
•	navegación desde alertas;
•	apertura de reportes;
•	filtros de reportes;
•	timeline;
•	carga de evidencias simulada.
________________________________________
42. REGLAS DE NEGOCIO QUE NUNCA DEBEN ROMPERSE
Estas reglas tienen prioridad sobre cualquier decisión visual.
1.	Nunca permitir stock negativo.
2.	Una salida nunca puede superar la existencia disponible en la ubicación/lote/serie/activo seleccionado.
3.	Si una validación crítica falla, no modificar stock.
4.	Una transferencia debe disminuir origen y aumentar destino.
5.	Una transferencia no cambia el stock total.
6.	Los movimientos confirmados son inmutables.
7.	Las correcciones deben realizarse mediante movimientos compensatorios o ajustes.
8.	La identidad del registrador se obtiene de la sesión.
9.	El registrador no puede editar manualmente su identidad.
10.	Los datos maestros deben existir y estar activos antes de utilizarlos.
11.	Maquinaria requiere serie/VIN/PIN y código de activo.
12.	Repuestos pueden requerir serialización según configuración.
13.	Materiales pueden requerir lote/colada.
14.	Insumos pueden requerir lote/vencimiento.
15.	Productos pueden existir en múltiples ubicaciones.
16.	El stock total es la suma de existencias válidas.
17.	Operaciones sensibles pueden requerir autorización.
18.	Los ajustes requieren motivo y privilegios.
19.	La evidencia debe asociarse al movimiento.
20.	El historial debe permitir reconstruir quién, cuándo, qué, cuánto, dónde, por qué y bajo qué sustento.
21.	BI es solo lectura.
22.	Web y móvil deben aplicar las mismas reglas.
23.	Los errores no deben producir cambios parciales.
24.	Los usuarios desactivados no pueden iniciar nuevas sesiones.
25.	Los permisos dependen del rol.
________________________________________
43. FLUJO CRÍTICO DE SALIDA
Implementar visualmente el siguiente flujo:
INICIO
↓
Producto + cantidad
↓
Ubicación / lote / serie
↓
Solicitante / centro de costo
↓
Documento / motivo
↓
¿Stock suficiente?
NO
→ Rechazo
→ No modificar inventario
SÍ
↓
¿Movimiento sensible?
NO
→ Evidencia
→ Confirmar
SÍ
↓
Solicitar autorización
↓
¿Aprobada?
NO
→ Rechazo
→ No confirmar
SÍ
↓
Evidencia
↓
Confirmar
↓
Actualizar existencia
↓
Valorización
↓
Historial
↓
Auditoría
↓
ÉXITO
Crear esta lógica como flujo real de interfaz.
________________________________________
44. CONFIRMACIONES
Antes de operaciones críticas:
"¿Confirmar salida?"
"Esta operación descontará 15 unidades de la ubicación Rack A-03."
Para ajustes:
"Este ajuste modificará directamente el inventario. Se registrará en auditoría."
Para transferencias:
"Se trasladarán 20 unidades de Rack A a Rack B."
Para desactivar usuario:
"El usuario no podrá iniciar nuevas sesiones, pero su historial será conservado."
________________________________________
45. FEEDBACK
Usar Toasts profesionales.
Success:
"Movimiento registrado correctamente."
Warning:
"El producto se encuentra por debajo del stock mínimo."
Error:
"No se puede completar la salida. La existencia disponible es de 8 unidades."
Info:
"Este movimiento requiere autorización del Supervisor."
________________________________________
46. EMPTY STATES
Crear estados vacíos profesionales.
Ejemplos:
"No hay productos que coincidan con los filtros."
"No existen movimientos en este período."
"No hay autorizaciones pendientes."
"No hay alertas activas."
"No existen evidencias asociadas."
47. LOADING
Simular estados de carga.
Usar skeletons.
Nunca mostrar pantallas vacías durante operaciones simuladas.
48. ERROR STATES
Crear:
•	error de red;
•	sesión expirada;
•	permiso insuficiente;
•	stock insuficiente;
•	producto inactivo;
•	ubicación inválida;
•	documento inválido;
•	evidencia obligatoria faltante;
•	autorización rechazada;
•	integración no disponible.
Mensajes comprensibles.
Nunca mostrar errores técnicos innecesarios al usuario final.
________________________________________
49. SEGURIDAD VISUAL
Ocultar información sensible según rol.
Por ejemplo:
•	costos;
•	valorización;
•	auditoría;
•	configuración;
•	permisos.
Si el usuario no tiene acceso:
mostrar estado:
"Acceso restringido"
No mostrar datos sensibles.
50. BÚSQUEDA GLOBAL
Crear búsqueda global en desktop.
Buscar:
•	SKU;
•	producto;
•	lote;
•	serie;
•	activo;
•	movimiento;
•	documento;
•	ubicación;
•	usuario.
Mostrar resultados agrupados por:
Productos
Movimientos
Activos
Ubicaciones
Documentos
51. NAVEGACIÓN Y UX
Agregar:
•	breadcrumbs;
•	título de página;
•	descripción;
•	acción primaria;
•	acciones secundarias;
•	filtros;
•	contenido;
•	paginación.
Mantener patrones consistentes.
No cambiar la ubicación de botones arbitrariamente entre módulos.
52. TABLAS PROFESIONALES
Las tablas deben soportar:
•	sticky header;
•	hover;
•	selección;
•	ordenar;
•	filtros;
•	paginación;
•	acciones;
•	estados;
•	responsive;
•	columnas importantes visibles primero.
En móvil transformar tablas complejas en cards.
53. DATOS DE DEMOSTRACIÓN
Usar datos realistas del sector mecánico/minero.
Ejemplos:
Materiales:
•	Plancha AR400 1/2"
•	Perfil H 12"
•	Tubo sin costura
•	Barra maciza de acero
•	Electrodos E7018
Insumos:
•	Aceite hidráulico
•	Grasa industrial
•	Refrigerante
•	Disco de corte
•	Gas industrial
Repuestos:
•	Rodamiento
•	Filtro hidráulico
•	Bomba hidráulica
•	Correa
•	Sello mecánico
•	Manguera hidráulica
Maquinaria:
•	Excavadora hidráulica
•	Cargador frontal
•	Camión minero
•	Motoniveladora
•	Perforadora
•	Jumbo
•	Chancadora
•	Montacargas
•	Grúa móvil
•	Grupo electrógeno
No utilizar lorem ipsum.
54. DETALLE VISUAL DEL DASHBOARD
Header:
"Buenos días, Administrador"
Subtexto:
"Resumen operativo del almacén"
Selector:
•	almacén;
•	período.
Fila KPI.
Después:
Gráfico de movimientos.
Después:
Alertas + productos bajo mínimo.
Después:
Movimientos recientes.
Después:
Estado de maquinaria.
________________________________________
55. PERFIL
Crear:
•	información personal;
•	rol;
•	permisos;
•	actividad reciente;
•	cambiar contraseña;
•	cerrar sesión.
56. RESPONSIVE WEB
En desktop:
Sidebar + contenido.
En tablet:
Sidebar colapsable.
En móvil:
Bottom navigation + header compacto.
Los filtros complejos deben convertirse en Drawer.
57. ACCESIBILIDAD
Cumplir principios de accesibilidad:
•	contraste suficiente;
•	focus states;
•	navegación clara;
•	labels;
•	mensajes de error;
•	tamaños táctiles adecuados;
•	no depender exclusivamente del color.
58. ARQUITECTURA DE PANTALLAS
Generar como mínimo las siguientes vistas:
AUTH
1.	Login
2.	Recuperar contraseña
DASHBOARD
3.	Dashboard
4.	Alertas
INVENTARIO
5.	Inventario
6.	Detalle producto
7.	Existencias por ubicación
8.	Kardex
MOVIMIENTOS
9.	Entradas
10.	Nueva entrada
11.	Detalle entrada
12.	Salidas
13.	Nueva salida
14.	Detalle salida
15.	Autorización de salida
16.	Transferencias
17.	Nueva transferencia
18.	Ajustes
19.	Nuevo ajuste
20.	Conteos físicos
21.	Nuevo conteo
CATÁLOGO
22.	Productos
23.	Nuevo producto
24.	Editar producto
25.	Categorías
26.	Unidades de medida
UBICACIONES
27.	Ubicaciones
28.	Detalle ubicación
29.	Mapa/estructura de almacén
ACTIVOS
30.	Maquinaria
31.	Detalle activo
TRAZABILIDAD
32.	Trazabilidad
33.	Lotes
34.	Series/activos
ADMINISTRACIÓN
35.	Usuarios
36.	Nuevo usuario
37.	Roles y permisos
38.	Responsables
39.	Centros de costo
40.	Tipos de movimiento
41.	Documentos
42.	Parámetros
REPORTES
43.	Centro de reportes
44.	Inventario actual
45.	Kardex
46.	Trazabilidad maquinaria
47.	Trazabilidad lotes
48.	Flujo movimientos
49.	Reposición
50.	Consumo centro de costo
51.	Auditoría
52.	Valorización
53.	Inventario ubicación
54.	Vencimientos
55.	Conteos/IRA
ANALYTICS
56.	Indicadores
57.	Tendencias
58.	Consumo
59.	Disponibilidad maquinaria
AUDITORÍA
60.	Auditoría
61.	Detalle evento
INTEGRACIONES
62.	BI
63.	Evidencias / almacenamiento
CONTINUIDAD
64.	Estado sistema
65.	Backups
66.	Recuperación
67.	Incidencias
MÓVIL
68.	Login móvil
69.	Inicio móvil
70.	Inventario móvil
71.	Producto móvil
72.	Entrada móvil
73.	Salida móvil
74.	Transferencia móvil
75.	Escaneo
76.	Movimientos móviles
77.	Alertas móviles
78.	Perfil móvil
59. PROTOTIPO NAVEGABLE
Crear conexiones entre todas las pantallas relevantes.
Ejemplos:
Dashboard → Producto bajo mínimo → Inventario filtrado.
Dashboard → Movimiento sensible → Autorizaciones.
Inventario → Producto → Kardex.
Producto → Entrada.
Producto → Salida.
Producto → Transferencia.
Salida → Autorización.
Autorización → Aprobar → Confirmación.
Autorización → Rechazar → Estado rechazado.
Inventario → Ubicación.
Maquinaria → Activo → Historial.
Reportes → Reporte → Filtros → Resultados.
Auditoría → Evento → Detalle.
Alertas → Acción correspondiente.
60. PRIORIDAD DE FUNCIONALIDAD
Prioridad 1:
•	Login.
•	Dashboard.
•	Inventario.
•	Productos.
•	Entradas.
•	Salidas.
•	Transferencias.
•	Ajustes.
•	Autorizaciones.
•	Kardex.
Prioridad 2:
•	Ubicaciones.
•	Maquinaria.
•	Trazabilidad.
•	Alertas.
•	Reportes.
•	Auditoría.
Prioridad 3:
•	Analytics.
•	Integraciones.
•	Continuidad.
•	Monitoreo.
•	Evidencias.
61. SIMULACIÓN DE BACKEND
Aunque sea un prototipo frontend, crear una capa lógica simulada para que:
•	los productos tengan estado;
•	el inventario cambie después de movimientos;
•	una entrada incremente stock;
•	una salida disminuya stock;
•	una transferencia cambie ubicación;
•	un ajuste cambie stock;
•	una autorización cambie el estado;
•	las alertas se actualicen;
•	los KPI se recalculen;
•	el historial registre movimientos;
•	la auditoría registre acciones.
No hacer interacciones falsas.
Por ejemplo, si se registra una entrada de 10 unidades, el inventario mostrado posteriormente debe reflejar esas 10 unidades.
Si se registra una salida de 5, debe descontarlas.
Si una salida excede el stock, debe bloquearse.
62. CONSISTENCIA DE DATOS
Mantener una única fuente de estado para:
Producto
Existencia
Ubicación
Lote
Serie
Movimiento
Usuario
Responsable
Autorización
Evidencia
Auditoría.
No duplicar datos con valores contradictorios.
63. REGLAS DE DEMOSTRACIÓN
Preparar escenarios demostrables:
Escenario 1
Administrador inicia sesión.
Ve dashboard.
Consulta inventario.
Abre producto.
Consulta ubicaciones.
Consulta Kardex.
Escenario 2
Encargado registra entrada.
Stock aumenta.
Kardex se actualiza.
Auditoría registra operación.
Escenario 3
Encargado intenta sacar más stock del disponible.
Sistema rechaza.
Stock no cambia.
Escenario 4
Supervisor registra salida sensible.
Sistema solicita autorización.
Administrador/Supervisor aprueba.
Se habilita confirmación.
Stock disminuye.
Escenario 5
Usuario realiza transferencia.
Stock origen disminuye.
Destino aumenta.
Stock total permanece igual.
Escenario 6
Supervisor realiza ajuste.
Se exige motivo.
Se registra evidencia.
Se registra autorizador.
Escenario 7
Administrador crea producto serializado.
El sistema solicita serie en las operaciones.
Escenario 8
Se consulta un insumo próximo a vencer.
Aparece alerta.
Escenario 9
Se consulta maquinaria.
Se visualiza estado, serie, activo, ubicación y movimientos.
Escenario 10
Se genera reporte de inventario.
Se filtra por ubicación.
Se muestra resultado.
64. CALIDAD VISUAL
El resultado final debe parecer un producto listo para una presentación universitaria/profesional ante:
•	docentes;
•	jurado;
•	empresa;
•	cliente;
•	stakeholders.
Evitar:
•	pantallas genéricas;
•	colores infantiles;
•	demasiadas tarjetas;
•	gráficos sin utilidad;
•	botones sin función;
•	lorem ipsum;
•	nombres genéricos;
•	datos inconsistentes;
•	formularios incompletos;
•	tablas sin filtros;
•	interfaces sobrecargadas.
65. PRINCIPIO FINAL
SIGA debe comunicar visualmente:
"Una sola fuente de verdad para el inventario, con control, trazabilidad, autorización y evidencia."
Cada módulo debe responder claramente:
¿Quién realizó la operación?
¿Qué producto o activo?
¿Cuánto?
¿Dónde?
¿Cuándo?
¿Por qué?
¿Quién lo solicitó?
¿Quién lo autorizó?
¿Qué documento la sustenta?
¿Qué evidencia existe?
¿Qué efecto tuvo sobre el inventario?
66. ENTREGA ESPERADA
Genera:
1.	Design System.
2.	Componentes reutilizables.
3.	Aplicación web responsive.
4.	Experiencia móvil.
5.	Datos demo.
6.	Flujos completos.
7.	Estados.
8.	Validaciones.
9.	Permisos.
10.	CRUD.
11.	Dashboards.
12.	Reportes.
13.	Auditoría.
14.	Trazabilidad.
15.	Autorizaciones.
16.	Evidencias.
17.	Simulación de backend.
18.	Navegación completa.
19.	Responsive.
20.	Estados de error/loading/empty/success.
La prioridad absoluta es:
FUNCIONALIDAD + CONSISTENCIA DE NEGOCIO + USABILIDAD + DISEÑO PROFESIONAL.
No sacrificar reglas de negocio para simplificar la interfaz.
No eliminar módulos por falta de espacio.
Si una pantalla es compleja, dividirla en tabs, pasos, drawers o subpantallas.
Si existe una regla condicional, representarla visualmente.
Si existe una autorización, crear el flujo completo.
Si existe trazabilidad, crear la vista correspondiente.
Si existe un reporte, crear su interfaz.
Si existe una operación móvil, crear su equivalente móvil.
Construye SIGA como un sistema integral coherente y demostrable, no como una colección de mockups independientes.
67. RESTRICCIÓN DE IDENTIDAD VISUAL
La paleta corporativa de SIGA es obligatoria:
#093C5D
#3B7597
#6FD1D7
#5DF8D8
Antes de generar cada pantalla, verificar que sus colores pertenezcan al Design System de SIGA.
No crear una paleta diferente para cada módulo.
Todos los módulos deben sentirse como partes del mismo producto.
El usuario debe poder pasar de Dashboard → Inventario → Movimiento → Kardex → Auditoría sin percibir cambios de estilo.
La aplicación debe tener una identidad visual unificada tanto en Web como en Mobile.
