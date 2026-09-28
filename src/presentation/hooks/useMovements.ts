import { useCallback } from 'react';
import { useApp } from '../state/AppContext';
import type { Movement } from '../../domain/entities/Movement';
import { useOperations } from '../state/OperationsContext';

/**
 * Los avisos de operaciones (sin conexión, conflicto de stock, confirmación) no se descartan solos,
 * igual que antes de la refactorización.
 */
const KEEP_VISIBLE = false;

export function useMovements() {
  const { movements, loading, error, registerMovement: register, confirmMovement: confirm } = useOperations();
  const { state, showToast } = useApp();
  const online = state.networkOnline;

  const registerMovement = useCallback(async (movement: Movement) => {
    const result = await register({ movement, online });
    if (result.outcome === 'offline') showToast('warning', '503 OFFLINE · Operación conservada únicamente como borrador. Sin cambios de stock.', KEEP_VISIBLE);
    if (result.outcome === 'conflict') showToast('error', result.message, KEEP_VISIBLE);
    return result;
  }, [register, online, showToast]);

  const confirmMovement = useCallback(async (movementId: string, confirmerId: string) => {
    const result = await confirm({ movementId, confirmerId, online });
    if (result.outcome === 'offline') showToast('warning', '503 OFFLINE · No se puede confirmar una operación sensible sin conexión.', KEEP_VISIBLE);
    if (result.outcome === 'conflict') showToast('error', result.message, KEEP_VISIBLE);
    if (result.outcome === 'confirmed') showToast('success', `Movimiento ${result.movementId} confirmado con MFA. Stock actualizado.`, KEEP_VISIBLE);
    return result;
  }, [confirm, online, showToast]);

  return { movements, loading, error, registerMovement, confirmMovement };
}
