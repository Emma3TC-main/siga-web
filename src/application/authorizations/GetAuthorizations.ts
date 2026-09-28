import type { Authorization } from '../../domain/entities/Authorization';
import type { AuthorizationRepository } from '../../domain/repositories/AuthorizationRepository';

export class GetAuthorizations {
  constructor(private readonly repository: AuthorizationRepository) {}

  execute(): Promise<Authorization[]> {
    return this.repository.getAll();
  }
}
