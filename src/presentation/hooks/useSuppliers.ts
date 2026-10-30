import { useCatalog } from '../state/CatalogContext';

export function useSuppliers() {
  const { suppliers, loading, error } = useCatalog();
  return { suppliers, loading, error };
}
