import { useCallback, useEffect, useState } from 'react';
import { userAdminUseCases } from '../../app/compositionRoot';
import type { AdminRole } from '../../domain/entities/AdminRole';
import type {
  AdminUser,
  AdminUserPage,
  CreateAdminUserCommand,
  UpdateAdminUserCommand,
} from '../../domain/entities/AdminUser';

const PAGE_SIZE = 20;
const EMPTY_PAGE: AdminUserPage = { content: [], page: 0, size: PAGE_SIZE, totalElements: 0 };

export function useAdminUsers(loadRoleCatalog: boolean) {
  const [result, setResult] = useState<AdminUserPage>(EMPTY_PAGE);
  const [detail, setDetail] = useState<AdminUser | null>(null);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [roleError, setRoleError] = useState<unknown>(null);

  const loadPage = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const next = await userAdminUseCases.listUsers(page, PAGE_SIZE);
      setResult(next);
      return next;
    } catch (cause) {
      setError(cause);
      throw cause;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPage(0).catch(() => undefined);
  }, [loadPage]);

  useEffect(() => {
    if (!loadRoleCatalog) {
      setRoles([]);
      setRoleError(null);
      return;
    }
    let cancelled = false;
    setRoleError(null);
    userAdminUseCases.listRoles()
      .then(next => { if (!cancelled) setRoles(next); })
      .catch(cause => { if (!cancelled) setRoleError(cause); });
    return () => { cancelled = true; };
  }, [loadRoleCatalog]);

  const openUser = useCallback(async (id: string) => {
    setDetailLoading(true);
    setDetail(null);
    setError(null);
    try {
      const user = await userAdminUseCases.getUser(id);
      setDetail(user);
      return user;
    } catch (cause) {
      setError(cause);
      throw cause;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const createUser = useCallback(async (command: CreateAdminUserCommand) => {
    setSaving(true);
    setError(null);
    try {
      const created = await userAdminUseCases.createUser(command);
      await loadPage(result.page);
      return created;
    } catch (cause) {
      setError(cause);
      throw cause;
    } finally {
      setSaving(false);
    }
  }, [loadPage, result.page]);

  const updateUser = useCallback(async (id: string, command: UpdateAdminUserCommand) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await userAdminUseCases.updateUser(id, command);
      setDetail(updated);
      await loadPage(result.page);
      return updated;
    } catch (cause) {
      setError(cause);
      throw cause;
    } finally {
      setSaving(false);
    }
  }, [loadPage, result.page]);

  const replaceUserRoles = useCallback(async (id: string, roleIds: string[]) => {
    setSaving(true);
    setError(null);
    try {
      await userAdminUseCases.replaceUserRoles(id, roleIds);
      const authoritative = await userAdminUseCases.getUser(id);
      setDetail(authoritative);
      await loadPage(result.page);
      return authoritative;
    } catch (cause) {
      setError(cause);
      throw cause;
    } finally {
      setSaving(false);
    }
  }, [loadPage, result.page]);

  return {
    users: result.content,
    page: result.page,
    size: result.size,
    totalElements: result.totalElements,
    detail,
    roles,
    loading,
    detailLoading,
    saving,
    error,
    roleError,
    loadPage,
    openUser,
    closeDetail: () => setDetail(null),
    clearError: () => setError(null),
    createUser,
    updateUser,
    replaceUserRoles,
  };
}
