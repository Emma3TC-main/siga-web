import type { Alert } from '../../domain/entities/Alert';
import type { Notification } from '../../domain/entities/Notification';
import type { AlertRepository } from '../../domain/repositories/AlertRepository';
import type {
  NotificationListOptions,
  NotificationPage,
  NotificationRepository,
} from '../../domain/repositories/NotificationRepository';
import { DEMO_ALERTS } from '../../data/demo/alerts';

export class DemoAlertRepository implements AlertRepository, NotificationRepository {
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

  async listNotifications(options: NotificationListOptions = {}): Promise<NotificationPage> {
    const page = options.page ?? 0;
    const size = options.size ?? 20;
    const notifications = this.alerts
      .filter(alert => !options.unreadOnly || !alert.read)
      .map(toNotification);
    return {
      content: notifications.slice(page * size, (page + 1) * size),
      page,
      size,
      totalElements: notifications.length,
    };
  }

  async getUnreadCount(): Promise<number> {
    return this.alerts.filter(alert => !alert.read).length;
  }
}

function toNotification(alert: Alert): Notification {
  return {
    id: alert.id,
    recipientUserId: 'demo',
    type: alert.type,
    title: alert.title,
    message: alert.description,
    severity: alert.severity.toUpperCase(),
    referenceType: alert.movementId ? 'Movement' : alert.productId ? 'Product' : 'Alert',
    referenceId: alert.movementId ?? alert.productId ?? alert.id,
    createdAt: alert.createdAt,
    readAt: alert.read ? alert.createdAt : null,
  };
}
