import { useCallback, useEffect, useState } from 'react';
import { roleAdminUseCases } from '../../app/compositionRoot';
import type {
  AdminPermission,
  AdminRole,
  CreateAdminRoleCommand,
} from '../../domain/entities/AdminRole';

export function useAdminRoles() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rolesError, setRolesError] = useState<unknown>(null);
  const [permissionsError, setPermissionsError] = useState<unknown>(null);

  const loadRoles = useCallback(async () => {
    setRolesLoading(true);
    setRolesError(null);
    try {
      const next = await roleAdminUseCases.listRoles();
      setRoles(next);
      return next;
    } catch (cause) {
      setRolesError(cause);
      throw cause;
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const loadPermissions = useCallback(async () => {
    setPermissionsLoading(true);
    setPermissionsError(null);
    try {
      const next = await roleAdminUseCases.listPermissions();
      setPermissions(next);
      return next;
    } catch (cause) {
      setPermissionsError(cause);
      throw cause;
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRoles().catch(() => undefined);
    void loadPermissions().catch(() => undefined);
  }, [loadPermissions, loadRoles]);

  const loadLatestRole = useCallback(async (roleId: string) => {
    const latestRoles = await loadRoles();
    const latest = latestRoles.find(role => role.id === roleId);
    if (!latest) throw new Error('ROLE_NOT_FOUND');
    return latest;
  }, [loadRoles]);

  const createRole = useCallback(async (command: CreateAdminRoleCommand) => {
    setSaving(true);
    try {
      const created = await roleAdminUseCases.createRole(command);
      try {
        await loadRoles();
      } catch {
        // The write already succeeded. Keep the read error visible without
        // misreporting the role creation as failed or replaying the mutation.
      }
      return created;
    } finally {
      setSaving(false);
    }
  }, [loadRoles]);

  const replaceRolePermissions = useCallback(async (roleId: string, permissionIds: string[]) => {
    setSaving(true);
    try {
      const updated = await roleAdminUseCases.replaceRolePermissions(roleId, permissionIds);
      try {
        await loadRoles();
      } catch {
        // Identity committed the replacement. A failed refresh is a separate
        // read failure and must never trigger a silent mutation retry.
      }
      return updated;
    } finally {
      setSaving(false);
    }
  }, [loadRoles]);

  return {
    roles,
    permissions,
    rolesLoading,
    permissionsLoading,
    saving,
    rolesError,
    permissionsError,
    loadRoles,
    loadPermissions,
    loadLatestRole,
    createRole,
    replaceRolePermissions,
  };
}
