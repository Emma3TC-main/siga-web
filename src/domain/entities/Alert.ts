export interface Alert {
  id: string;
  type: 'sin_stock' | 'bajo_minimo' | 'proximo_vencer' | 'vencido' | 'movimiento_sensible' | 'autorizacion_pendiente' | 'ajuste' | 'maquinaria';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  productId?: string;
  movementId?: string;
  authorizationId?: string;
  createdAt: string;
  read: boolean;
  actionRoute?: string;
}
