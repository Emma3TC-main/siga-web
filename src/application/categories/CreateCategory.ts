import type { Category, NewCategory } from '../../domain/entities/Category';
import type { CategoryRepository } from '../../domain/repositories/CategoryRepository';
import { ValidationError } from '../../domain/errors';
import { validateCategoryName } from '../../domain/rules/catalogRules';

export type CreateCategoryInput = Pick<NewCategory, 'name' | 'type' | 'description'>;

export class CreateCategory {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<Category> {
    const errors = validateCategoryName(input);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de categoría inválidos.', errors);

    return this.repository.create({
      name: input.name.trim(),
      type: input.type,
      description: input.description?.trim() || undefined,
    });
  }
}
