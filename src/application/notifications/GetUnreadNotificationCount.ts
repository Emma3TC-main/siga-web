import type { NotificationRepository } from '../../domain/repositories/NotificationRepository';

export class GetUnreadNotificationCount {
  constructor(private readonly repository: NotificationRepository) {}

  execute(): Promise<number> {
    return this.repository.getUnreadCount();
  }
}
