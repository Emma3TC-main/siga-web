import type { Responsible } from '../../domain/entities/Responsible';
import type { ResponsibleRepository } from '../../domain/repositories/ResponsibleRepository';

export class GetResponsibles {
  constructor(private readonly repository: ResponsibleRepository) {}

  execute(): Promise<Responsible[]> {
    return this.repository.getAll();
  }
}
