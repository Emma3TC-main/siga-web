import { useCallback, useEffect, useState } from 'react';
import { lotAdminUseCases } from '../../app/compositionRoot';
import type { LotAdmin, LotManualStatus } from '../../domain/entities/Lot';
import type { LotAdminQuery, LotCreateCommand, LotUpdateCommand } from '../../domain/repositories/LotRepository';
import { NotFoundError, ValidationError } from '../../domain/errors';
import { ApiError } from '../../infrastructure/http/ApiClient';

const INITIAL_QUERY: LotAdminQuery = { page: 0, size: 20 };
export interface TraceabilityAdminError { code: string | null; message: string; }

export function useLotAdmin() {
  const [query, setQueryState] = useState<LotAdminQuery>(INITIAL_QUERY);
  const [lots, setLots] = useState<LotAdmin[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [detail, setDetail] = useState<LotAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<TraceabilityAdminError | null>(null);

  const load = useCallback(async (requested: LotAdminQuery) => {
    setLoading(true); setError(null);
    try {
      const page = await lotAdminUseCases.list(requested);
      setLots(page.content); setTotalElements(page.totalElements);
    } catch (cause) { setError(toAdminError(cause, 'LOT')); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(query); }, [load, query]);
  const setQuery = useCallback((next: LotAdminQuery) => setQueryState(next), []);

  const open = useCallback(async (id: string) => {
    setDetailLoading(true); setError(null);
    try { const current = await lotAdminUseCases.get(id); setDetail(current); return current; }
    catch (cause) { setError(toAdminError(cause, 'LOT')); return null; }
    finally { setDetailLoading(false); }
  }, []);

  const mutated = useCallback(async (value: LotAdmin) => {
    setDetail(value); await load(query); return value;
  }, [load, query]);

  const failed = useCallback(async (cause: unknown, id?: string) => {
    const commandError = toAdminError(cause, 'LOT');
    if (commandError.code === 'VERSION_CONFLICT' && id) {
      commandError.message = 'El lote fue actualizado por otro usuario. Se recargó la versión más reciente; revisa antes de reintentar.';
      try { setDetail(await lotAdminUseCases.get(id)); } catch { /* preserve conflict */ }
    }
    setError(commandError); return null;
  }, []);

  const create = useCallback(async (command: LotCreateCommand) => {
    setSaving(true); setError(null);
    try { return await mutated(await lotAdminUseCases.create(command)); }
    catch (cause) { return failed(cause); }
    finally { setSaving(false); }
  }, [failed, mutated]);

  const update = useCallback(async (id: string, command: LotUpdateCommand) => {
    setSaving(true); setError(null);
    try { return await mutated(await lotAdminUseCases.update(id, command)); }
    catch (cause) { return failed(cause, id); }
    finally { setSaving(false); }
  }, [failed, mutated]);

  const changeStatus = useCallback(async (current: LotAdmin, targetStatus: LotManualStatus) => {
    setSaving(true); setError(null);
    try { return await mutated(await lotAdminUseCases.changeStatus(current.id, targetStatus, current.version)); }
    catch (cause) { return failed(cause, current.id); }
    finally { setSaving(false); }
  }, [failed, mutated]);

  return { query, lots, totalElements, detail, loading, detailLoading, saving, error,
    setQuery, open, create, update, changeStatus, reload: () => load(query),
    closeDetail: () => setDetail(null), clearError: () => setError(null) };
}

export function toAdminError(cause: unknown, resource: 'LOT' | 'ASSET'): TraceabilityAdminError {
  const fallback = resource === 'LOT' ? 'No se pudo completar la operación del lote.' : 'No se pudo completar la operación del activo.';
  if (cause instanceof NotFoundError) return {
    code: resource === 'LOT' ? 'LOT_NOT_FOUND' : 'ASSET_NOT_FOUND',
    message: resource === 'LOT' ? 'El lote ya no está disponible.' : 'El activo ya no está disponible.',
  };
  if (cause instanceof ValidationError) return { code: 'VALIDATION_ERROR', message: 'Revisa los campos y formatos ingresados.' };
  if (!(cause instanceof ApiError)) return { code: null, message: cause instanceof Error ? cause.message : fallback };
  const code = typeof cause.data?.code === 'string' ? cause.data.code : null;
  const messages: Record<string, string> = {
    VALIDATION_ERROR: 'Revisa los campos y formatos ingresados.',
    AUTH_INVALID: 'La sesión ya no es válida. Vuelve a iniciar sesión.',
    AUTH_FORBIDDEN: 'No tienes el permiso TRACEABILITY_MANAGE para realizar esta acción.',
    LOT_NOT_FOUND: 'El lote ya no está disponible.',
    ASSET_NOT_FOUND: 'El activo ya no está disponible.',
    DATA_CONFLICT: resource === 'LOT' ? 'Ya existe un lote con esa identidad para el producto.' : 'El código o número de serie ya pertenece a otro activo.',
    VERSION_CONFLICT: 'El recurso fue actualizado por otro usuario.',
    LOT_STATUS_CONFLICT: 'La transición del lote no es válida para su estado, fecha o existencias actuales.',
    LOT_NOT_AVAILABLE: 'El lote no está disponible para la operación solicitada.',
    ASSET_STATUS_CONFLICT: 'La transición no es válida. Para retirar un activo debe quedar sin stock positivo.',
    ASSET_NOT_AVAILABLE: 'El activo no está disponible para la operación solicitada.',
  };
  return { code, message: code && messages[code] ? messages[code] : cause.message || fallback };
}
