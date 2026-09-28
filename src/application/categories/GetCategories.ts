import type { Category } from '../../domain/entities/Category';
import type { CategoryRepository } from '../../domain/repositories/CategoryRepository';

export class GetCategories {
  constructor(private readonly repository: CategoryRepository) {}

  execute(): Promise<Category[]> {
    return this.repository.getAll();
  }
}
