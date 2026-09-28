import { useCatalog } from '../state/CatalogContext';

export function useLocations() {
  const { locations, loading, error } = useCatalog();
  return { locations, loading, error };
}
