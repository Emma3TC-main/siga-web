# SIGA — entrega final para el Grupo Integrador 2

## Archivo principal

`SIGA_Grupo_Integrador_2_FINAL.make` es la copia final actualizada del Figma Make. No modifica ni reemplaza automáticamente el archivo original de Oliver.

SHA-256: `0CE2ED3585FB4CCFD8B084DCBABF6770697D5A3C10140039B4C4D8CF9A8E9D8F`

## Cómo importarlo

1. Oliver —o cualquier compañero con Figma Make habilitado— debe abrir el explorador de archivos de Figma.
2. Usar **Importar / Import file** o arrastrar el archivo `.make` sobre Borradores/Recientes.
3. Abrir la copia y comprobar el nombre **SIGA - Grupo Integrador 2 - FINAL**.
4. Probar con los perfiles Administrador, Usuario autorizado y Usuario móvil.
5. Si el equipo la aprueba, compartir esta nueva copia o trasladar sus cambios al archivo oficial.

Si la cuenta de Jaime continúa mostrando “No tienes acceso a esta función”, la importación debe realizarse con una cuenta/seat que sí tenga Figma Make. Tener permiso para editar un archivo y tener acceso al producto Make son permisos diferentes.

## Alcance completado

- **Entradas, salidas, transferencias y ajustes** con cabecera + múltiples líneas, agregar/eliminar ítems, validación acumulada y resumen.
- Estados `BORRADOR`, `PENDIENTE_AUTORIZACION`, `AUTORIZADO`, `CONFIRMADO` y `RECHAZADO`.
- Autorización separada de la confirmación sensible mediante MFA/TOTP; código de demostración: `123456`.
- Bloqueo de stock negativo, conflictos visibles `409` y consumo de existencias por lotes/fecha de vencimiento.
- Costo promedio ponderado en entradas y en el almacén destino de transferencias.
- Evidencia obligatoria para ajustes negativos, detalle de movimientos y trazabilidad con `correlationId`.
- Estados de interfaz: carga, vacío, éxito, validación, error de dominio, `401`, `403`, `409`, desconexión y error inesperado.
- Control de acceso por roles y tablero específico para usuario autorizado/móvil.
- Navegación móvil inferior, menú adicional y modo sin conexión limitado a borradores.
- Categorías y unidades persistentes durante la sesión; continuidad operacional, roles y parámetros alineados.
- Parámetros coherentes: promedio ponderado obligatorio, stock negativo deshabilitado y almacenamiento MinIO / Google Cloud Storage.
- Etiquetas accesibles y diseños adaptables a escritorio y móvil.

## Verificación realizada

- TypeScript `--noEmit`: sin errores.
- Compilación de producción con Vite: correcta.
- Revisión funcional en Chrome de Administrador, Usuario autorizado y Usuario móvil.
- Probados multidetalle, conflicto `409`, restricciones de rol, modo sin conexión y MFA.
- Repositorio Git interno reconstruido desde el `.make` final y validado con `git fsck --full`.
- Commit incluido: `e6e42082c6d33c846eb908ee23fe30f5aee83533`.

## Límite real de la entrega

Esta es una **maqueta funcional de alta fidelidad**, que es el alcance del Figma solicitado por el grupo. Simula autenticación, TOTP, persistencia y almacenamiento para demostrar los flujos; no sustituye la API, base de datos, proveedor TOTP ni carga real de archivos de un sistema en producción. Tampoco fue posible hacer la prueba final de importación en la cuenta de Jaime por el bloqueo de su seat de Figma Make; esa última comprobación debe hacerla Oliver o un compañero con Make habilitado.
