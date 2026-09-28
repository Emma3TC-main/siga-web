/** Movimientos de un período (semana) del reporte de flujo. */
export interface MovementFlowPeriod {
  period: string;
  entradas: number;
  salidas: number;
  valor_ent: number;
  valor_sal: number;
}

export interface MonthlyTrendPoint {
  mes: string;
  entradas: number;
  salidas: number;
}

export interface CategoryConsumption {
  name: string;
  value: number;
}

export interface AdjustmentFrequencyPoint {
  mes: string;
  ajustes: number;
}

/** Series históricas de los reportes e indicadores. */
export interface ReportSeries {
  movementFlow: MovementFlowPeriod[];
  monthlyTrend: MonthlyTrendPoint[];
  categoryConsumption: CategoryConsumption[];
  adjustmentFrequency: AdjustmentFrequencyPoint[];
}
