import { useCallback, useEffect, useRef, useState } from 'react';
import { physicalCountUseCases } from '../../app/compositionRoot';
import type {
  AddUnexpectedPhysicalCountLineInput,
  CancelPhysicalCountInput,
  CapturePhysicalCountLineInput,
  ClosePhysicalCountInput,
  CreatePhysicalCountInput,
  PhysicalCount,
  PhysicalCountPage,
} from '../../domain/entities/PhysicalCount';
import { ApiError } from '../../infrastructure/http/ApiClient';

const PAGE_SIZE = 20;
const EMPTY_PAGE: PhysicalCountPage = { content: [], page: 0, size: PAGE_SIZE, totalElements: 0 };

export interface PhysicalCountCommandError {
  code: string | null;
  message: string;
}

export function usePhysicalCounts() {
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<PhysicalCountPage>(EMPTY_PAGE);
  const [detail, setDetail] = useState<PhysicalCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [commandLoading, setCommandLoading] = useState(false);
  const [error, setError] = useState<PhysicalCountCommandError | null>(null);
  const commandKeys = useRef(new Map<string, string>());

  const loadPage = useCallback(async (requestedPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const next = await physicalCountUseCases.listCounts(requestedPage, PAGE_SIZE);
      setResult(next);
      setPage(next.page);
    } catch (cause) {
      setError(toCommandError(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadPage(page); }, [loadPage, page]);

  const openCount = useCallback(async (id: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const count = await physicalCountUseCases.getCount(id);
      setDetail(count);
      return count;
    } catch (cause) {
      setError(toCommandError(cause));
      return null;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const runMutation = useCallback(async (operation: () => Promise<PhysicalCount>, conflictId?: string) => {
    setCommandLoading(true);
    setError(null);
    try {
      const updated = await operation();
      setDetail(updated);
      await loadPage(page);
      return updated;
    } catch (cause) {
      const commandError = toCommandError(cause);
      if (commandError.code === 'VERSION_CONFLICT' && conflictId) {
        commandError.message = 'El conteo fue actualizado por otro usuario. Se recargó la versión más reciente.';
        try { setDetail(await physicalCountUseCases.getCount(conflictId)); } catch { /* keep original conflict */ }
      }
      setError(commandError);
      return null;
    } finally {
      setCommandLoading(false);
    }
  }, [loadPage, page]);

  const keyed = useCallback((signature: string) => {
    const existing = commandKeys.current.get(signature);
    if (existing) return existing;
    const created = crypto.randomUUID();
    commandKeys.current.set(signature, created);
    return created;
  }, []);

  const createCount = useCallback(async (input: CreatePhysicalCountInput) => {
    const signature = `create:${JSON.stringify(input)}`;
    const created = await runMutation(() => physicalCountUseCases.createCount(input, keyed(signature)));
    if (created) commandKeys.current.delete(signature);
    return created;
  }, [keyed, runMutation]);

  const captureLine = useCallback((input: CapturePhysicalCountLineInput) =>
    runMutation(() => physicalCountUseCases.captureLine(input), input.countId), [runMutation]);

  const addUnexpectedLine = useCallback(async (input: AddUnexpectedPhysicalCountLineInput) => {
    const signature = `unexpected:${JSON.stringify(input)}`;
    const updated = await runMutation(() => physicalCountUseCases.addUnexpectedLine(input, keyed(signature)), input.countId);
    if (updated) commandKeys.current.delete(signature);
    return updated;
  }, [keyed, runMutation]);

  const closeCount = useCallback(async (input: ClosePhysicalCountInput) => {
    const signature = `close:${input.countId}:${input.expectedVersion}`;
    const updated = await runMutation(() => physicalCountUseCases.closeCount(input, keyed(signature)), input.countId);
    if (updated) commandKeys.current.delete(signature);
    return updated;
  }, [keyed, runMutation]);

  const cancelCount = useCallback(async (input: CancelPhysicalCountInput) => {
    const signature = `cancel:${input.countId}:${input.expectedVersion}:${input.reason}`;
    const updated = await runMutation(() => physicalCountUseCases.cancelCount(input, keyed(signature)), input.countId);
    if (updated) commandKeys.current.delete(signature);
    return updated;
  }, [keyed, runMutation]);

  return {
    counts: result.content, page: result.page, size: result.size, totalElements: result.totalElements,
    loading, detailLoading, commandLoading, detail, error,
    setPage, loadPage, openCount, closeDetail: () => setDetail(null), clearError: () => setError(null),
    createCount, captureLine, addUnexpectedLine, closeCount, cancelCount,
  };
}

function toCommandError(cause: unknown): PhysicalCountCommandError {
  if (cause instanceof ApiError) {
    const code = typeof cause.data?.code === 'string' ? cause.data.code : null;
    if (code === 'IDEMPOTENCY_CONFLICT') return { code, message: 'La operación ya fue usada con datos diferentes. Revise el conteo antes de continuar.' };
    if (code === 'PHYSICAL_COUNT_STATE_CONFLICT') return { code, message: 'La acción ya no es válida para el estado actual del conteo.' };
    if (cause.status === 403) return { code, message: 'No tiene permiso para gestionar conteos físicos.' };
    return { code, message: cause.message || 'No se pudo completar la operación.' };
  }
  return { code: null, message: cause instanceof Error ? cause.message : 'No se pudo completar la operación.' };
}
