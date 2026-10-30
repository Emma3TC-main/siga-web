import type {
  NotificationListOptions,
  NotificationPage,
  NotificationRepository,
} from '../../domain/repositories/NotificationRepository';

export class ListNotifications {
  constructor(private readonly repository: NotificationRepository) {}

  execute(options?: NotificationListOptions): Promise<NotificationPage> {
    return this.repository.listNotifications(options);
  }
}
