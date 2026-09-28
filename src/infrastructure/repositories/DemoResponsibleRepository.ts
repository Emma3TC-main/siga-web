import type { Responsible } from '../../domain/entities/Responsible';
import type { ResponsibleRepository } from '../../domain/repositories/ResponsibleRepository';
import { DEMO_RESPONSIBLES } from '../../data/demo/responsibles';

export class DemoResponsibleRepository implements ResponsibleRepository {
  private readonly responsibles: Responsible[] = [...DEMO_RESPONSIBLES];

  async getAll(): Promise<Responsible[]> {
    return [...this.responsibles];
  }
}
