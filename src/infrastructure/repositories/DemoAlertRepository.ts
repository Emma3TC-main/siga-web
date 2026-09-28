import type { Alert } from '../../domain/entities/Alert';
import type { AlertRepository } from '../../domain/repositories/AlertRepository';
import { DEMO_ALERTS } from '../../data/demo/alerts';

export class DemoAlertRepository implements AlertRepository {
  private alerts: Alert[] = [...DEMO_ALERTS];

  async getAll(): Promise<Alert[]> {
    return [...this.alerts];
  }

  async add(alert: Alert): Promise<Alert> {
    this.alerts = [alert, ...this.alerts];
    return alert;
  }

  async markAsRead(id: string): Promise<void> {
    this.alerts = this.alerts.map(alert => (alert.id === id ? { ...alert, read: true } : alert));
  }
}
