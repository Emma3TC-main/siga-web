import type { Alert } from '../../domain/entities/Alert';
import type { AlertRepository } from '../../domain/repositories/AlertRepository';

export class GetAlerts {
  constructor(private readonly repository: AlertRepository) {}

  execute(): Promise<Alert[]> {
    return this.repository.getAll();
  }
}
