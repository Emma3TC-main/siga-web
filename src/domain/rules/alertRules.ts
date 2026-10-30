import type { Notification } from '../entities/Notification';

export function splitAlertsByRead(alerts: readonly Notification[]): { unread: Notification[]; read: Notification[] } {
  return {
    unread: alerts.filter(alert => alert.readAt === null),
    read: alerts.filter(alert => alert.readAt !== null),
  };
}
