import type { ProductType } from './Product';

export interface Category {
  id: string;
  name: string;
  type: ProductType;
  description?: string;
  subcategories?: string[];
}

/** `id` lo asigna la fuente de datos. */
export type NewCategory = Omit<Category, 'id'>;
