import type { Responsible } from '../entities/Responsible';

export interface ResponsibleRepository {
  getAll(): Promise<Responsible[]>;
}
