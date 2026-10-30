import type { Category, CategoryType, CreateCategoryCommand } from '../../domain/entities/Category';
import type { CategoryRepository } from '../../domain/repositories/CategoryRepository';
import { ApiClient } from '../http/ApiClient';

export class ApiCategoryRepository implements CategoryRepository {
  private readonly apiClient = new ApiClient();

  async getAll(): Promise<Category[]> {
    const data = await this.apiClient.get<CategoryApiDto[]>('/api/v1/categories');
    return data.map(ApiCategoryRepository.toDomain);
  }

  async create(category: CreateCategoryCommand): Promise<Category> {
    await this.apiClient.post<void>('/api/v1/categories', category);
    const all = await this.getAll();
    return exactlyOneByCode(all, category.code, 'categoría');
  }

  private static toDomain(dto: CategoryApiDto): Category { return { ...dto }; }
}

interface CategoryApiDto {
  id: string;
  code: string;
  name: string;
  categoryType: CategoryType;
  active: boolean;
}

function exactlyOneByCode(items: Category[], code: string, entity: string): Category {
  const matches = items.filter(item => item.code === code);
  if (matches.length !== 1) {
    throw new Error(`La ${entity} fue creada, pero la recarga devolvió ${matches.length} coincidencias para el código exacto enviado. Actualiza antes de volver a intentar.`);
  }
  return matches[0];
}
