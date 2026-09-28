import { useApp } from '../../../state/AppContext';
import { useProducts } from '../../../hooks/useProducts';
import { useMovements } from '../../../hooks/useMovements';
import { useStock } from '../../../hooks/useStock';
import { useAuthorizations } from '../../../hooks/useAuthorizations';
import { machineryAvailability as computeMachineryAvailability, getMachinery } from '../../../../domain/rules/machineryRules';
import type { Movement } from '../../../../domain/entities/Movement';

export interface EnrichedMovement extends Movement {
  productName?: string;
}

/**
 * Centraliza los cálculos derivados que antes vivían inline en Dashboard.tsx, para que la página
 * quede como compositor y cada panel reciba datos ya resueltos. No cambia ninguna fórmula ni regla
 * de negocio existente: es el mismo cálculo, movido aquí.
 */
export function useDashboardMetrics() {
  const { state, markAlertRead } = useApp();
  const { currentUser, alerts } = state;
  const { products } = useProducts();
  const { movements } = useMovements();
  const { stock } = useStock();
  const { authorizations } = useAuthorizations();

  const totalStock = products.map(p => {
    const qty = stock.filter(s => s.productId === p.id).reduce((sum, s) => sum + s.quantity, 0);
    return qty * p.avgCost;
  }).reduce((sum, v) => sum + v, 0);

  const machinery = getMachinery(products);
  const operativeMachinery = machinery.filter(p => p.machineryStatus === 'operativo').length;
  const machineryAvailability = computeMachineryAvailability(machinery);

  const getStockTotal = (productId: string) => stock.filter(s => s.productId === productId).reduce((sum, s) => sum + s.quantity, 0);
  const belowMin = products.filter(p => p.type !== 'maquinaria' && getStockTotal(p.id) > 0 && getStockTotal(p.id) < p.minStock).length;
  const zeroStock = products.filter(p => p.type !== 'maquinaria' && getStockTotal(p.id) === 0 && p.minStock > 0).length;

  const today = new Date();
  const expirySoon = products.filter(p => {
    const s = stock.find(st => st.productId === p.id && st.expiryDate);
    if (!s?.expiryDate) return false;
    const d = new Date(s.expiryDate);
    const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 60;
  }).length;

  const entriesThisPeriod = movements.filter(m => m.createdAt.startsWith('2025-08') && m.type === 'entrada').length;
  const exitsThisPeriod = movements.filter(m => m.createdAt.startsWith('2025-08') && m.type === 'salida').length;
  const pendingAuthorizations = authorizations.filter(a => a.status === 'pendiente').length;

  const recentMovements: EnrichedMovement[] = movements.slice(0, 8).map(mv => ({
    ...mv,
    productName: products.find(p => p.id === mv.productId)?.name,
  }));
  const criticalAlerts = alerts.filter(a => !a.read && a.severity === 'critical').slice(0, 5);
  const warningAlerts = alerts.filter(a => !a.read && a.severity === 'warning').slice(0, 3);

  return {
    currentUser,
    totalStock,
    machinery,
    operativeMachinery,
    machineryAvailability,
    belowMin,
    zeroStock,
    expirySoon,
    entriesThisPeriod,
    exitsThisPeriod,
    pendingAuthorizations,
    recentMovements,
    criticalAlerts,
    warningAlerts,
    markAlertRead,
  };
}
