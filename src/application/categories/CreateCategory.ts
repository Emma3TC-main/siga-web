import type { Category, CategoryType, CreateCategoryCommand } from '../../domain/entities/Category';
import type { CategoryRepository } from '../../domain/repositories/CategoryRepository';
import { ValidationError } from '../../domain/errors';
import { validateCategoryCreate } from '../../domain/rules/catalogRules';

export interface CreateCategoryInput {
  code: string;
  name: string;
  categoryType: CategoryType;
}

export class CreateCategory {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<Category> {
    const errors = validateCategoryCreate(input);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de categoría inválidos.', errors);

    const command: CreateCategoryCommand = {
      code: input.code.trim(),
      name: input.name.trim(),
      categoryType: input.categoryType,
    };
    return this.repository.create(command);
  }
}
