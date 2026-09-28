import type { Alert } from '../entities/Alert';

export function splitAlertsByRead(alerts: readonly Alert[]): { unread: Alert[]; read: Alert[] } {
  return {
    unread: alerts.filter(alert => !alert.read),
    read: alerts.filter(alert => alert.read),
  };
}
