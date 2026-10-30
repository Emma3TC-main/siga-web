import type { NotificationRepository } from '../../domain/repositories/NotificationRepository';

export class MarkNotificationRead {
  constructor(private readonly repository: NotificationRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.markAsRead(id);
  }
}
