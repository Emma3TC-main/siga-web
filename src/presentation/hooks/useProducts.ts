import { useCatalog } from '../state/CatalogContext';

export function useProducts() {
  const { products, loading, error, createProduct, updateProduct } = useCatalog();
  return { products, loading, error, createProduct, updateProduct };
}
