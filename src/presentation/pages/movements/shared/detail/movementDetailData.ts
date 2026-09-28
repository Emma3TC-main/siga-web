import type { Movement, MovementLine, MovementStatus, MovementType } from '../../../../../domain/entities/Movement';
import type { Authorization } from '../../../../../domain/entities/Authorization';

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  entrada: 'Entrada',
  salida: 'Salida',
  transferencia: 'Transferencia',
  ajuste_positivo: 'Ajuste positivo',
  ajuste_negativo: 'Ajuste negativo',
  conteo: 'Conteo',
};

/** Importe de una línea: el total registrado o, si falta, cantidad × costo unitario (misma regla que ya usa EntriesList). */
export function lineValue(line: MovementLine): number {
  return line.totalCost ?? line.quantity * (line.unitCost ?? 0);
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1_000))} KB`;
}

export type HistoryTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

export interface HistoryEntry {
  key: string;
  label: string;
  tone: HistoryTone;
  actor?: string;
  at?: string;
  note?: string;
}

/**
 * Arma la línea de tiempo únicamente con datos que el sistema realmente almacena:
 * registro (createdAt/registeredBy), solicitud y resolución de la autorización
 * (Authorization) y confirmación (confirmedAt). No se guarda quién confirmó ni
 * comentarios históricos, por eso no se muestran.
 */
export function buildHistory(movement: Movement, authorization: Authorization | undefined, userName: (id?: string) => string | undefined): HistoryEntry[] {
  const entries: HistoryEntry[] = [
    { key: 'registrado', label: 'Registrado', tone: 'neutral', actor: userName(movement.registeredBy), at: movement.createdAt },
  ];

  if (authorization) {
    entries.push({ key: 'solicitud', label: 'Autorización solicitada', tone: 'warning', actor: userName(authorization.registeredBy), at: authorization.createdAt });
    if (authorization.status === 'aprobado') {
      entries.push({ key: 'autorizado', label: 'Autorizado', tone: 'info', actor: userName(authorization.resolvedBy), at: authorization.resolvedAt });
    } else if (authorization.status === 'rechazado') {
      entries.push({ key: 'rechazado', label: 'Rechazado', tone: 'error', actor: userName(authorization.resolvedBy), at: authorization.resolvedAt, note: authorization.rejectionReason });
    }
  } else {
    if (movement.status === 'pendiente_autorizacion') entries.push({ key: 'pendiente', label: 'Pendiente de autorización', tone: 'warning' });
    if (movement.authorizedBy) entries.push({ key: 'autorizado', label: 'Autorizado', tone: 'info', actor: userName(movement.authorizedBy) });
    if (movement.rejectedBy) entries.push({ key: 'rechazado', label: 'Rechazado', tone: 'error', actor: userName(movement.rejectedBy), note: movement.rejectionReason });
  }

  if (movement.confirmedAt) entries.push({ key: 'confirmado', label: 'Confirmado', tone: 'success', at: movement.confirmedAt });
  return entries;
}

export interface ProgressStep {
  label: string;
  reached: boolean;
  rejected?: boolean;
  at?: string;
}

/** Mismo recorrido Borrador → Pendiente → Autorizado → Confirmado que ya existía, con las fechas que sí se conocen. */
export function buildProgress(status: MovementStatus, movement: Movement, authorization?: Authorization): ProgressStep[] {
  const rank = status === 'confirmado' ? 3 : status === 'autorizado' ? 2 : status === 'pendiente_autorizacion' ? 1 : status === 'rechazado' ? 1 : 0;
  return [
    { label: 'Borrador', reached: rank >= 0, at: movement.createdAt },
    { label: 'Pendiente de autorización', reached: rank >= 1, at: authorization?.createdAt },
    status === 'rechazado'
      ? { label: 'Rechazado', reached: true, rejected: true, at: authorization?.resolvedAt }
      : { label: 'Autorizado', reached: rank >= 2, at: authorization?.status === 'aprobado' ? authorization.resolvedAt : undefined },
    { label: 'Confirmado', reached: rank >= 3, at: movement.confirmedAt },
  ];
}
