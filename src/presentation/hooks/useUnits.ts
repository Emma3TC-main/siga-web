import { useCatalog } from '../state/CatalogContext';

export function useUnits() {
  const { units, loading, error, createUnit } = useCatalog();
  return { units, loading, error, createUnit };
}
