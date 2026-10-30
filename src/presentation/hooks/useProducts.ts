import { useCatalog } from '../state/CatalogContext';

export function useProducts() {
  const { products, loading, error } = useCatalog();
  return { products, loading, error };
}
