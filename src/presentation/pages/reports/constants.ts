export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge: string | null;
}

export const REPORTS: ReportDefinition[] = [
  { id: 'inventario', name: 'Inventario Actual', description: 'Estado actual del inventario por producto y ubicación', icon: '📦', badge: 'Principal' },
  { id: 'kardex', name: 'Kardex / Historial de Producto', description: 'Historial completo de movimientos por producto', icon: '📋', badge: null },
  { id: 'trazabilidad-maq', name: 'Trazabilidad de Maquinaria', description: 'Historial de ubicaciones y estados de activos', icon: '🏗', badge: null },
  { id: 'trazabilidad-lotes', name: 'Trazabilidad de Lotes y Vencimientos', description: 'Control de lotes, coladas y fechas de vencimiento', icon: '🏷', badge: null },
  { id: 'flujo', name: 'Flujo de Movimientos', description: 'Entradas y salidas del período seleccionado', icon: '↕', badge: null },
  { id: 'reposicion', name: 'Alerta de Reposición', description: 'Productos por debajo del punto de reposición', icon: '⚠', badge: 'Operativo' },
  { id: 'consumo-cc', name: 'Consumo por Centro de Costo', description: 'Consumo y valorización por centro de costo', icon: '💰', badge: null },
  { id: 'auditoria', name: 'Auditoría de Ajustes', description: 'Ajustes y movimientos sensibles', icon: '🔍', badge: null },
  { id: 'valorizacion', name: 'Valorización de Inventario', description: 'Valor del inventario por costo promedio', icon: '💎', badge: null },
  { id: 'inv-ubicacion', name: 'Inventario por Ubicación', description: 'Stock disponible por rack, zona o almacén', icon: '📍', badge: null },
  { id: 'vencimientos', name: 'Insumos Próximos a Vencer', description: 'Insumos con vencimiento en los próximos 90 días', icon: '⏰', badge: 'Urgente' },
  { id: 'conteos', name: 'Conteos y Exactitud IRA', description: 'Resultados de conteos físicos e IRA', icon: '✅', badge: null },
];

/** IDs de reportes que ya tienen una vista de detalle implementada; el resto cae en el placeholder. */
export const IMPLEMENTED_REPORT_IDS = ['inventario', 'flujo', 'reposicion', 'consumo-cc', 'valorizacion'];
