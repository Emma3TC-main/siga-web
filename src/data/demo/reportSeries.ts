import type { ReportSeries } from '../../domain/entities/ReportSeries';

export const DEMO_REPORT_SERIES: ReportSeries = {
  movementFlow: [
    { period: '01-07 Ago', entradas: 3, salidas: 2, valor_ent: 28600, valor_sal: 7000 },
    { period: '08-14 Ago', entradas: 4, salidas: 5, valor_ent: 11300, valor_sal: 7300 },
    { period: '15-21 Ago', entradas: 2, salidas: 4, valor_ent: 1200, valor_sal: 3900 },
    { period: '22-24 Ago', entradas: 1, salidas: 2, valor_ent: 960, valor_sal: 370 },
  ],
  monthlyTrend: [
  { mes: 'Ene', entradas: 8200, salidas: 6800 },
  { mes: 'Feb', entradas: 9500, salidas: 7200 },
  { mes: 'Mar', entradas: 7800, salidas: 9100 },
  { mes: 'Abr', entradas: 11200, salidas: 8500 },
  { mes: 'May', entradas: 9800, salidas: 7600 },
  { mes: 'Jun', entradas: 13400, salidas: 10200 },
  { mes: 'Jul', entradas: 11800, salidas: 9400 },
  { mes: 'Ago', entradas: 6100, salidas: 5200 },
],
  categoryConsumption: [
  { name: 'Repuestos', value: 52400 },
  { name: 'Materiales', value: 38600 },
  { name: 'Insumos', value: 14200 },
],
  adjustmentFrequency: [
  { mes: 'Mar', ajustes: 1 },
  { mes: 'Abr', ajustes: 0 },
  { mes: 'May', ajustes: 2 },
  { mes: 'Jun', ajustes: 1 },
  { mes: 'Jul', ajustes: 0 },
  { mes: 'Ago', ajustes: 3 },
],
};
