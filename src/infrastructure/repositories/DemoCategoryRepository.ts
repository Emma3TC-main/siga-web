import type { Category, NewCategory } from '../../domain/entities/Category';
import type { CategoryRepository } from '../../domain/repositories/CategoryRepository';
import { DEMO_CATEGORIES } from '../../data/demo/categories';

export class DemoCategoryRepository implements CategoryRepository {
  private categories: Category[] = [...DEMO_CATEGORIES];

  async getAll(): Promise<Category[]> {
    return [...this.categories];
  }

  async create(input: NewCategory): Promise<Category> {
    const category: Category = { ...input, id: `cat-${Date.now()}` };
    this.categories = [...this.categories, category];
    return category;
  }
}
