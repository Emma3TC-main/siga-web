import { useCallback, useEffect, useRef, useState } from 'react';
import type { Movement } from '../../domain/entities/Movement';
import type { MovementHistoryFilters } from '../../domain/repositories/MovementRepository';
import { getErrorMessage } from '../../shared/errors/getErrorMessage';
import { useMovements } from './useMovements';

const DEFAULT_SIZE = 20;

export function useMovementHistory(initialFilters: MovementHistoryFilters = {}, enabled = true) {
  const { searchMovements, getMovementDetail } = useMovements();
  const [filters, setFilters] = useState<MovementHistoryFilters>(initialFilters);
  const initialFiltersRef = useRef(initialFilters);
  const [page, setPage] = useState(0);
  const [size] = useState(DEFAULT_SIZE);
  const [content, setContent] = useState<Movement[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setContent([]);
      setTotalElements(0);
      setLoading(false);
      setError(null);
      return;
    }
    const sequence = ++requestSequence.current;
    setLoading(true);
    searchMovements({ ...filters, page, size })
      .then(result => {
        if (sequence !== requestSequence.current) return;
        setContent(result.content);
        setTotalElements(result.totalElements);
        setError(null);
      })
      .catch(cause => {
        if (sequence !== requestSequence.current) return;
        setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (sequence === requestSequence.current) setLoading(false);
      });
  }, [enabled, filters, page, searchMovements, size]);

  const changeFilters = useCallback((patch: Partial<MovementHistoryFilters>) => {
    setFilters(current => {
      const next = { ...current, ...patch };
      for (const key of Object.keys(next) as (keyof MovementHistoryFilters)[]) {
        if (next[key] === '' || next[key] === undefined) delete next[key];
      }
      return next;
    });
    setPage(0);
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    const movement = await getMovementDetail(id);
    if (!movement) throw new Error('El movimiento ya no está disponible.');
    return movement;
  }, [getMovementDetail]);

  const clearFilters = useCallback(() => {
    setFilters(initialFiltersRef.current);
    setPage(0);
  }, []);

  return {
    content, page, size, totalElements, totalPages: Math.ceil(totalElements / size),
    filters, loading, error, setPage, changeFilters, clearFilters, loadDetail,
  };
}
