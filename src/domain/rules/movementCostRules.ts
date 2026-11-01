/** Parses a user-entered cost while preserving explicit zero and absence as different values. */
export function parseExplicitUnitCost(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}
