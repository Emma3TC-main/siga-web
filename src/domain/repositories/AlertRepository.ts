import type { Alert } from '../entities/Alert';

export interface AlertRepository {
  getAll(): Promise<Alert[]>;
  /** La alerta nueva queda primera (más reciente → más antigua). */
  add(alert: Alert): Promise<Alert>;
  markAsRead(id: string): Promise<void>;
}
