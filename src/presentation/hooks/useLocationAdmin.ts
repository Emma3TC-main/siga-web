import { useCallback, useEffect, useState } from 'react';
import { locationAdminUseCases } from '../../app/compositionRoot';
import type {
  LocationActiveFilter,
  LocationAdmin,
  LocationCreateCommand,
  LocationUpdateCommand,
} from '../../domain/entities/LocationAdmin';
import { NotFoundError } from '../../domain/errors';
import { ApiError } from '../../infrastructure/http/ApiClient';

export interface LocationAdminError {
  code: string | null;
  message: string;
}

export function useLocationAdmin() {
  const [filter, setFilterState] = useState<LocationActiveFilter>('all');
  const [locations, setLocations] = useState<LocationAdmin[]>([]);
  const [hierarchyLocations, setHierarchyLocations] = useState<LocationAdmin[]>([]);
  const [detail, setDetail] = useState<LocationAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<LocationAdminError | null>(null);

  const loadLocations = useCallback(async (requestedFilter: LocationActiveFilter) => {
    setLoading(true);
    setError(null);
    try {
      const visible = await locationAdminUseCases.listLocations(requestedFilter);
      const hierarchy = requestedFilter === 'all'
        ? visible
        : await locationAdminUseCases.listLocations('all');
      setLocations(visible);
      setHierarchyLocations(hierarchy);
    } catch (cause) {
      setError(toLocationAdminError(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadLocations(filter); }, [filter, loadLocations]);

  const setFilter = useCallback((value: LocationActiveFilter) => setFilterState(value), []);

  const openLocation = useCallback(async (id: string) => {
    setDetailLoading(true);
    setError(null);
    setDetail(null);
    try {
      const [latest, hierarchy] = await Promise.all([
        locationAdminUseCases.getLocation(id),
        locationAdminUseCases.listLocations('all'),
      ]);
      setDetail(latest);
      setHierarchyLocations(hierarchy);
      return latest;
    } catch (cause) {
      setError(toLocationAdminError(cause));
      return null;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const refreshAfterMutation = useCallback(async (updated: LocationAdmin) => {
    setDetail(updated);
    await loadLocations(filter);
    return updated;
  }, [filter, loadLocations]);

  const handleMutationFailure = useCallback(async (cause: unknown, id?: string) => {
    const commandError = toLocationAdminError(cause);
    if (commandError.code === 'VERSION_CONFLICT' && id) {
      commandError.message = 'La ubicación fue actualizada por otro usuario. Se recargó la versión más reciente; revisa antes de reintentar.';
      try {
        const latest = await locationAdminUseCases.getLocation(id);
        setDetail(latest);
        setHierarchyLocations(await locationAdminUseCases.listLocations('all'));
      } catch {
        // Keep the concurrency error as the primary result.
      }
    }
    setError(commandError);
    return null;
  }, []);

  const createLocation = useCallback(async (command: LocationCreateCommand) => {
    setSaving(true);
    setError(null);
    try { return await refreshAfterMutation(await locationAdminUseCases.createLocation(command)); }
    catch (cause) { return handleMutationFailure(cause); }
    finally { setSaving(false); }
  }, [handleMutationFailure, refreshAfterMutation]);

  const updateLocation = useCallback(async (id: string, command: LocationUpdateCommand) => {
    setSaving(true);
    setError(null);
    try { return await refreshAfterMutation(await locationAdminUseCases.updateLocation(id, command)); }
    catch (cause) { return handleMutationFailure(cause, id); }
    finally { setSaving(false); }
  }, [handleMutationFailure, refreshAfterMutation]);

  const setLocationActive = useCallback(async (current: LocationAdmin, active: boolean) => {
    setSaving(true);
    setError(null);
    try {
      const updated = active
        ? await locationAdminUseCases.reactivateLocation(current.id, current.version)
        : await locationAdminUseCases.deactivateLocation(current.id, current.version);
      return await refreshAfterMutation(updated);
    } catch (cause) {
      return handleMutationFailure(cause, current.id);
    } finally {
      setSaving(false);
    }
  }, [handleMutationFailure, refreshAfterMutation]);

  return {
    filter, locations, hierarchyLocations, detail, loading, detailLoading, saving, error,
    setFilter, loadLocations, openLocation, createLocation, updateLocation, setLocationActive,
    closeDetail: () => setDetail(null), clearError: () => setError(null),
  };
}

function toLocationAdminError(cause: unknown): LocationAdminError {
  if (cause instanceof ApiError) {
    const code = typeof cause.data?.code === 'string' ? cause.data.code : null;
    const messages: Record<string, string> = {
      VALIDATION_ERROR: 'Revisa los datos obligatorios y sus formatos.',
      AUTH_INVALID: 'La sesión ya no es válida. Vuelve a iniciar sesión.',
      AUTH_FORBIDDEN: 'No tienes el permiso LOCATION_MANAGE para administrar ubicaciones.',
      LOCATION_NOT_FOUND: 'La ubicación ya no está disponible.',
      DATA_CONFLICT: 'El código ya pertenece a otra ubicación.',
      VERSION_CONFLICT: 'La ubicación fue actualizada por otro usuario.',
      LOCATION_HIERARCHY_CONFLICT: 'La jerarquía propuesta no es válida o el padre está inactivo.',
      LOCATION_HAS_ACTIVE_DESCENDANTS: 'Desactiva primero las ubicaciones descendientes activas.',
      LOCATION_HAS_STOCK: 'No se puede desactivar porque la ubicación o su subárbol tienen stock positivo.',
      LOCATION_IN_USE: 'No se puede desactivar porque existe un conteo físico abierto en su subárbol.',
      LOCATION_INACTIVE: 'La ubicación está inactiva y no admite esta modificación.',
    };
    return { code, message: code && messages[code] ? messages[code] : cause.message };
  }
  if (cause instanceof NotFoundError) return { code: 'LOCATION_NOT_FOUND', message: 'La ubicación ya no está disponible.' };
  return { code: null, message: cause instanceof Error ? cause.message : 'No se pudo completar la operación.' };
}
