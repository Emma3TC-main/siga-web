import type { Authorization } from '../entities/Authorization';

export interface AuthorizationRepository {
  getAll(): Promise<Authorization[]>;
  getById(id: string): Promise<Authorization | null>;
  /** La autorización nueva queda primera (más reciente → más antigua). */
  add(authorization: Authorization): Promise<Authorization>;
  update(authorization: Authorization): Promise<Authorization>;
}
