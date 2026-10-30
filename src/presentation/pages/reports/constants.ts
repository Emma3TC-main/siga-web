export interface ReportDefinition {
  id: 'movements' | 'valuation' | 'adjustments';
  name: string;
  description: string;
  icon: string;
}

export const REPORTS: ReportDefinition[] = [
  { id: 'movements', name: 'Movimientos confirmados', description: 'Movimientos confirmados dentro del período seleccionado.', icon: '↕' },
  { id: 'valuation', name: 'Valorización de inventario', description: 'Saldos actuales con valorización calculada por Reporting.', icon: '💎' },
  { id: 'adjustments', name: 'Ajustes de inventario', description: 'Ajustes positivos y negativos confirmados.', icon: '🔍' },
];
