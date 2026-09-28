import type { AlertRepository } from '../../domain/repositories/AlertRepository';

export class MarkAlertRead {
  constructor(private readonly repository: AlertRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.markAsRead(id);
  }
}
