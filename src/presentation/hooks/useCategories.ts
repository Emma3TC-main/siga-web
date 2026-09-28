import { useCatalog } from '../state/CatalogContext';

export function useCategories() {
  const { categories, loading, error, createCategory } = useCatalog();
  return { categories, loading, error, createCategory };
}
