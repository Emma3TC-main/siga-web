import type { Category, CreateCategoryCommand } from '../entities/Category';

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  create(category: CreateCategoryCommand): Promise<Category>;
}
