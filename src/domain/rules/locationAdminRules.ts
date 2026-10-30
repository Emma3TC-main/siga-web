import type { LocationAdmin } from '../entities/LocationAdmin';

export function getAdminLocationDescendantIds(
  id: string,
  locations: readonly LocationAdmin[],
): Set<string> {
  const children = new Map<string, string[]>();
  for (const location of locations) {
    if (!location.parentId) continue;
    const current = children.get(location.parentId) ?? [];
    current.push(location.id);
    children.set(location.parentId, current);
  }

  const descendants = new Set<string>();
  const pending = [...(children.get(id) ?? [])];
  while (pending.length > 0 && descendants.size <= locations.length) {
    const candidate = pending.pop()!;
    if (candidate === id || descendants.has(candidate)) continue;
    descendants.add(candidate);
    pending.push(...(children.get(candidate) ?? []));
  }
  return descendants;
}

export function deriveAdminLocationDepth(
  location: LocationAdmin,
  locations: readonly LocationAdmin[],
): number {
  const byId = new Map(locations.map(item => [item.id, item]));
  const visited = new Set<string>([location.id]);
  let parentId = location.parentId;
  let depth = 0;
  while (parentId && depth < locations.length) {
    if (visited.has(parentId)) return depth;
    visited.add(parentId);
    const parent = byId.get(parentId);
    if (!parent) return depth;
    depth += 1;
    parentId = parent.parentId;
  }
  return depth;
}

export function orderAdminLocations(locations: readonly LocationAdmin[]): LocationAdmin[] {
  const byParent = new Map<string | null, LocationAdmin[]>();
  const ids = new Set(locations.map(location => location.id));
  for (const location of locations) {
    const parent = location.parentId && ids.has(location.parentId) ? location.parentId : null;
    const current = byParent.get(parent) ?? [];
    current.push(location);
    byParent.set(parent, current);
  }
  for (const siblings of byParent.values()) siblings.sort((a, b) => a.code.localeCompare(b.code));

  const result: LocationAdmin[] = [];
  const visited = new Set<string>();
  const visit = (location: LocationAdmin) => {
    if (visited.has(location.id)) return;
    visited.add(location.id);
    result.push(location);
    for (const child of byParent.get(location.id) ?? []) visit(child);
  };
  for (const root of byParent.get(null) ?? []) visit(root);
  for (const location of [...locations].sort((a, b) => a.code.localeCompare(b.code))) visit(location);
  return result;
}
