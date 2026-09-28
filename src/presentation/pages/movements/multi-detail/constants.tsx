import type { ReactNode } from 'react';
import { AdjustIcon, ArrowUpIcon, ArrowsIcon } from '../../../components/ui';
import type { MovementType } from '../../../../domain/entities/Movement';

export type MovementMode = 'exit' | 'transfer' | 'adjustment';

export const MULTI_DETAIL_STEPS = ['Cabecera', 'Detalle (N ítems)', 'Evidencia', 'Resumen'];
export const MULTI_DETAIL_DOCUMENTS = ['Orden de Trabajo', 'Vale', 'Acta', 'Factura', 'Guía de Remisión Remitente', 'Otros'];
export const ADJUSTMENT_MOTIVES = ['Conteo físico', 'Merma', 'Daño en almacén', 'Vencimiento', 'Diferencia de inventario', 'Error de registro anterior', 'Otro motivo autorizado'];

export interface MultiDetailModeConfig {
  title: string;
  singular: string;
  description: string;
  icon: ReactNode;
  types: MovementType[];
}

export const MODE_CONFIG: Record<MovementMode, MultiDetailModeConfig> = {
  exit: { title: 'Salidas', singular: 'salida', description: 'Despachos con cabecera y múltiples productos', icon: <ArrowUpIcon size={46} />, types: ['salida'] },
  transfer: { title: 'Transferencias', singular: 'transferencia', description: 'Traslados multidetalle entre ubicaciones', icon: <ArrowsIcon size={46} />, types: ['transferencia'] },
  adjustment: { title: 'Ajustes de inventario', singular: 'ajuste', description: 'Ajustes positivos y negativos controlados', icon: <AdjustIcon size={46} />, types: ['ajuste_positivo', 'ajuste_negativo'] },
};

/** Nombre del módulo de permisos (routeRegistry/canAccess) asociado a cada modo. */
export const MODE_MODULE_NAME: Record<MovementMode, 'exits' | 'transfers' | 'adjustments'> = {
  exit: 'exits',
  transfer: 'transfers',
  adjustment: 'adjustments',
};

/** Id de ruta (getBreadcrumbs/navigate) asociado a cada modo. */
export const MODE_ROUTE_ID: Record<MovementMode, 'exits' | 'transfers' | 'adjustments'> = MODE_MODULE_NAME;
