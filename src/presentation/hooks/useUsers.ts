import { useOperations } from '../state/OperationsContext';

/** Directorio de personas usado únicamente para etiquetas en pantallas operativas. */
export function useUsers() {
  const { operationalUsers, loading, error } = useOperations();
  return { users: operationalUsers, loading, error };
}
