import type { Category, NewCategory } from '../entities/Category';

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  create(category: NewCategory): Promise<Category>;
}
