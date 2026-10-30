import type { User } from '../../domain/entities/User';

export const ADMIN_FRESH_AUTH_SECONDS = 300;

export type AdminMutationPreflight =
  | { allowed: true }
  | { allowed: false; reason: 'FORBIDDEN' | 'REAUTHENTICATION_REQUIRED' };

export function checkAdminMutationPreflight(
  user: User | null | undefined,
  requiredPermissions: readonly string[],
  nowEpochSeconds = Math.floor(Date.now() / 1000),
): AdminMutationPreflight {
  const permissions = user?.permissions ?? [];
  if (!user || requiredPermissions.some(permission => !permissions.includes(permission))) {
    return { allowed: false, reason: 'FORBIDDEN' };
  }

  if (typeof user.authTime !== 'number' || nowEpochSeconds - user.authTime > ADMIN_FRESH_AUTH_SECONDS) {
    return { allowed: false, reason: 'REAUTHENTICATION_REQUIRED' };
  }

  return { allowed: true };
}
