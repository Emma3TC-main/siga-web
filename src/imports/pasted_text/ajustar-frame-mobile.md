AJUSTAR EL FRAME MOBILE EXISTENTE DE SIGA — STATUS BAR NATIVA

IMPORTANTE:
No rediseñar la aplicación móvil existente.

Modificar únicamente la estructura del dispositivo/frame móvil para representar correctamente una interfaz móvil real.

Actualmente el prototipo está mostrando una "Dynamic Island" negra como si fuera un elemento de la página.

ESO ES INCORRECTO.

La Dynamic Island/notch NO debe formar parte del contenido de SIGA.

================================================================
1. STATUS BAR DEL DISPOSITIVO
================================================================

Crear una zona superior reservada para la STATUS BAR del sistema operativo.

La Status Bar debe representar elementos propios del dispositivo, NO elementos de SIGA.

Mostrar visualmente:

- Hora actual, por ejemplo: 9:41
- Señal móvil
- Wi-Fi
- Porcentaje de batería
- Icono de batería

La Status Bar debe estar ubicada en la parte superior del dispositivo.

Ejemplo conceptual:

┌─────────────────────────────────────┐
│ 9:41                    ▂▂▂  WiFi 🔋│ ← STATUS BAR DEL SISTEMA
├─────────────────────────────────────┤
│                                     │
│          CONTENIDO DE SIGA          │
│                                     │
│                                     │
└─────────────────────────────────────┘

================================================================
2. DYNAMIC ISLAND / NOTCH
================================================================

NO crear una Dynamic Island como componente de SIGA.

NO colocar una cápsula negra dentro del contenido de la aplicación.

NO hacer que la Dynamic Island forme parte del Header de SIGA.

Si el frame pretende representar un iPhone moderno:

La Dynamic Island/notch debe considerarse parte del HARDWARE DEL DISPOSITIVO.

Puede utilizarse únicamente como elemento visual del mockup del teléfono, pero debe quedar fuera del contenido funcional de SIGA.

La aplicación NO debe posicionar elementos debajo de ella.

================================================================
3. SAFE AREA
================================================================

Crear correctamente las áreas seguras del dispositivo.

La aplicación debe respetar:

- Status Bar superior
- área segura superior
- contenido de SIGA
- Home Indicator inferior

El contenido de SIGA nunca debe quedar debajo de la Status Bar.

================================================================
4. HEADER DE SIGA
================================================================

Después de la Status Bar debe comenzar el Header de la aplicación.

El Header de SIGA debe ser independiente de la Status Bar.

Ejemplo:

STATUS BAR
────────────────────────────
9:41                 WiFi 🔋

HEADER SIGA
────────────────────────────
←   SIGA          🔔   CM

CONTENIDO
────────────────────────────
Dashboard
...

Es decir:

STATUS BAR ≠ HEADER DE SIGA

No mezclarlos.

================================================================
5. HEADER MOBILE DE SIGA
================================================================

Mantener el Header existente y únicamente moverlo debajo de la Status Bar.

Conservar:

- logo;
- nombre SIGA;
- notificaciones;
- avatar;
- botones existentes.

No colocar estos elementos dentro de la Status Bar.

================================================================
6. HOME INDICATOR
================================================================

En la parte inferior del dispositivo, crear un área segura para el Home Indicator.

Representación:

────────────────────────────

       ━━━━━━━━━

No utilizar el Home Indicator como parte de la navegación de SIGA.

La navegación inferior de SIGA debe estar por encima del área segura del dispositivo.

================================================================
7. ESTRUCTURA FINAL DEL FRAME
================================================================

La estructura visual debe ser:

DEVICE FRAME
│
├── STATUS BAR
│   ├── Hora
│   ├── Señal
│   ├── Wi-Fi
│   └── Batería
│
├── APP SAFE AREA
│   │
│   ├── HEADER SIGA
│   │
│   ├── CONTENIDO
│   │
│   └── BOTTOM NAVIGATION
│
└── HOME INDICATOR AREA

La Dynamic Island, si se representa, pertenece únicamente al frame/hardware del dispositivo.

================================================================
8. NO CAMBIAR LA ESTÉTICA
================================================================

Conservar:

- paleta #093C5D
- #3B7597
- #6FD1D7
- #5DF8D8
- tipografía;
- iconografía;
- componentes;
- botones;
- tarjetas;
- navegación;
- diseño actual.

No rediseñar las pantallas.

Únicamente corregir la estructura del dispositivo móvil y el posicionamiento vertical.

================================================================
9. COMPORTAMIENTO RESPONSIVE
================================================================

El contenido de SIGA debe adaptarse al área disponible debajo de la Status Bar.

No utilizar posiciones absolutas que hagan que el contenido quede debajo de:

- Status Bar;
- Dynamic Island/notch;
- Home Indicator.

Utilizar safe areas/padding adecuados.

================================================================
10. RESULTADO ESPERADO
================================================================

El resultado debe parecer una aplicación móvil REAL instalada en un dispositivo.

NO debe parecer:

"una página web metida dentro de un teléfono con una Dynamic Island dibujada encima".

Debe parecer:

"una aplicación SIGA ejecutándose dentro del sistema operativo del teléfono".

La Status Bar pertenece al dispositivo.

El Header pertenece a SIGA.

La navegación pertenece a SIGA.

El Home Indicator pertenece al dispositivo.

Mantener esta separación visual y funcional.