import type { Notification } from '../../domain/entities/Notification';
import type {
  NotificationListOptions,
  NotificationPage,
  NotificationRepository,
} from '../../domain/repositories/NotificationRepository';
import { ApiClient } from '../http/ApiClient';

interface NotificationPageResponse {
  content: Notification[];
  page: number;
  size: number;
  totalElements: number;
}

interface UnreadCountResponse {
  unreadCount: number;
}

export class ApiNotificationRepository implements NotificationRepository {
  private static readonly PATH = '/api/v1/notifications';

  constructor(private readonly client = new ApiClient()) {}

  async listNotifications(options: NotificationListOptions = {}): Promise<NotificationPage> {
    const parameters = new URLSearchParams({
      unreadOnly: String(options.unreadOnly ?? false),
      page: String(options.page ?? 0),
      size: String(options.size ?? 20),
    });
    const response = await this.client.get<NotificationPageResponse>(
      `${ApiNotificationRepository.PATH}?${parameters.toString()}`,
    );
    return {
      content: response.content ?? [],
      page: response.page,
      size: response.size,
      totalElements: response.totalElements,
    };
  }

  async getUnreadCount(): Promise<number> {
    const response = await this.client.get<UnreadCountResponse>(
      `${ApiNotificationRepository.PATH}/unread-count`,
    );
    return response.unreadCount;
  }

  async markAsRead(id: string): Promise<void> {
    await this.client.post<void>(
      `${ApiNotificationRepository.PATH}/${encodeURIComponent(id)}/read`,
      undefined,
    );
  }
}
