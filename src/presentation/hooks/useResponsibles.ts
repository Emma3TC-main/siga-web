import { useCatalog } from '../state/CatalogContext';

export function useResponsibles() {
  const { responsibles, loading, error } = useCatalog();
  return { responsibles, loading, error };
}
