import type { Notification } from '../entities/Notification';

export interface NotificationListOptions {
  unreadOnly?: boolean;
  page?: number;
  size?: number;
}

export interface NotificationPage {
  content: Notification[];
  page: number;
  size: number;
  totalElements: number;
}

export interface NotificationRepository {
  listNotifications(options?: NotificationListOptions): Promise<NotificationPage>;
  getUnreadCount(): Promise<number>;
  markAsRead(id: string): Promise<void>;
}
