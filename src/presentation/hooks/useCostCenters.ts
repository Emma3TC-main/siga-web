import { useCatalog } from '../state/CatalogContext';

export function useCostCenters() {
  const { costCenters, loading, error } = useCatalog();
  return { costCenters, loading, error };
}
