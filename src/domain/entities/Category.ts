export type CategoryType = 'MATERIAL' | 'INSUMO' | 'REPUESTO' | 'MAQUINARIA';

export interface Category {
  id: string;
  code: string;
  name: string;
  categoryType: CategoryType;
  active: boolean;
}

export type CreateCategoryCommand = Pick<Category, 'code' | 'name' | 'categoryType'>;
