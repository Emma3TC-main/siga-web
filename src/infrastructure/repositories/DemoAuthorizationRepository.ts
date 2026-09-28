import type { Authorization } from '../../domain/entities/Authorization';
import type { AuthorizationRepository } from '../../domain/repositories/AuthorizationRepository';
import { DEMO_AUTHORIZATIONS } from '../../data/demo/authorizations';

export class DemoAuthorizationRepository implements AuthorizationRepository {
  private authorizations: Authorization[] = [...DEMO_AUTHORIZATIONS];

  async getAll(): Promise<Authorization[]> {
    return [...this.authorizations];
  }

  async getById(id: string): Promise<Authorization | null> {
    return this.authorizations.find(authorization => authorization.id === id) ?? null;
  }

  async add(authorization: Authorization): Promise<Authorization> {
    this.authorizations = [authorization, ...this.authorizations];
    return authorization;
  }

  async update(authorization: Authorization): Promise<Authorization> {
    this.authorizations = this.authorizations.map(item => (item.id === authorization.id ? authorization : item));
    return authorization;
  }
}
