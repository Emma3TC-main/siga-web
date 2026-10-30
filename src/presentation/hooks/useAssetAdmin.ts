import { useCallback, useEffect, useState } from 'react';
import { assetAdminUseCases } from '../../app/compositionRoot';
import type { AssetAdmin, AssetManualStatus } from '../../domain/entities/Asset';
import type { AssetAdminQuery, AssetCreateCommand, AssetUpdateCommand } from '../../domain/repositories/AssetRepository';
import { toAdminError, type TraceabilityAdminError } from './useLotAdmin';

const INITIAL_QUERY: AssetAdminQuery = { page: 0, size: 20 };

export function useAssetAdmin() {
  const [query, setQueryState] = useState<AssetAdminQuery>(INITIAL_QUERY);
  const [assets, setAssets] = useState<AssetAdmin[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [detail, setDetail] = useState<AssetAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<TraceabilityAdminError | null>(null);

  const load = useCallback(async (requested: AssetAdminQuery) => {
    setLoading(true); setError(null);
    try {
      const page = await assetAdminUseCases.list(requested);
      setAssets(page.content); setTotalElements(page.totalElements);
    } catch (cause) { setError(toAdminError(cause, 'ASSET')); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(query); }, [load, query]);
  const setQuery = useCallback((next: AssetAdminQuery) => setQueryState(next), []);

  const open = useCallback(async (id: string) => {
    setDetailLoading(true); setError(null);
    try { const current = await assetAdminUseCases.get(id); setDetail(current); return current; }
    catch (cause) { setError(toAdminError(cause, 'ASSET')); return null; }
    finally { setDetailLoading(false); }
  }, []);

  const mutated = useCallback(async (value: AssetAdmin) => {
    setDetail(value); await load(query); return value;
  }, [load, query]);

  const failed = useCallback(async (cause: unknown, id?: string) => {
    const commandError = toAdminError(cause, 'ASSET');
    if (commandError.code === 'VERSION_CONFLICT' && id) {
      commandError.message = 'El activo fue actualizado por otro usuario. Se recargó la versión más reciente; revisa antes de reintentar.';
      try { setDetail(await assetAdminUseCases.get(id)); } catch { /* preserve conflict */ }
    }
    setError(commandError); return null;
  }, []);

  const register = useCallback(async (command: AssetCreateCommand) => {
    setSaving(true); setError(null);
    try { return await mutated(await assetAdminUseCases.register(command)); }
    catch (cause) { return failed(cause); }
    finally { setSaving(false); }
  }, [failed, mutated]);

  const update = useCallback(async (id: string, command: AssetUpdateCommand) => {
    setSaving(true); setError(null);
    try { return await mutated(await assetAdminUseCases.update(id, command)); }
    catch (cause) { return failed(cause, id); }
    finally { setSaving(false); }
  }, [failed, mutated]);

  const changeStatus = useCallback(async (current: AssetAdmin, targetStatus: AssetManualStatus) => {
    setSaving(true); setError(null);
    try { return await mutated(await assetAdminUseCases.changeStatus(current.id, targetStatus, current.version)); }
    catch (cause) { return failed(cause, current.id); }
    finally { setSaving(false); }
  }, [failed, mutated]);

  return { query, assets, totalElements, detail, loading, detailLoading, saving, error,
    setQuery, open, register, update, changeStatus, reload: () => load(query),
    closeDetail: () => setDetail(null), clearError: () => setError(null) };
}
