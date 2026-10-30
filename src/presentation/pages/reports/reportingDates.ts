export type DashboardRange = 'CURRENT_MONTH' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'LAST_6_MONTHS';

function limaDateParts(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function addCalendarDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function toLimaBoundary(date: string): string {
  return new Date(`${date}T00:00:00-05:00`).toISOString();
}

export function defaultReportDates(): { dateFrom: string; dateTo: string } {
  const today = limaDateParts();
  return { dateFrom: addCalendarDays(today, -29), dateTo: addCalendarDays(today, 1) };
}

export function dashboardPeriod(range: DashboardRange): { from: string; to: string; bucket: 'DAY' | 'MONTH' } {
  const today = limaDateParts();
  const to = addCalendarDays(today, 1);
  if (range === 'LAST_6_MONTHS') {
    const [year, month] = today.split('-').map(Number);
    const firstMonth = new Date(Date.UTC(year, month - 6, 1)).toISOString().slice(0, 10);
    return { from: toLimaBoundary(firstMonth), to: toLimaBoundary(to), bucket: 'MONTH' };
  }
  if (range === 'CURRENT_MONTH') {
    return { from: toLimaBoundary(`${today.slice(0, 7)}-01`), to: toLimaBoundary(to), bucket: 'DAY' };
  }
  const days = range === 'LAST_7_DAYS' ? 6 : 29;
  return { from: toLimaBoundary(addCalendarDays(today, -days)), to: toLimaBoundary(to), bucket: 'DAY' };
}

export function formatDataUpdatedAt(value: string | null): string {
  if (!value) return 'Sin datos sincronizados';
  return `Datos actualizados: ${new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Lima',
  }).format(new Date(value))}`;
}
