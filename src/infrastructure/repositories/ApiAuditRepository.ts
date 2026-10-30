import { ApiClient } from '../http/ApiClient';
import type { AuditEvent, NewAuditEvent } from '../../domain/entities/AuditEvent';
import type { AuditPage, AuditQueryFilters, AuditRepository } from '../../domain/repositories/AuditRepository';

interface BackendAuditEventResponse {
  id: string;
  eventType: string;
  actorId: string | null;
  aggregateType: string | null;
  aggregateId: string | null;
  action: string;
  result: string;
  correlationId: string | null;
  details: Record<string, unknown>;
  occurredAt: string;
}

interface BackendAuditPageResponse {
  content: BackendAuditEventResponse[];
  page: number;
  size: number;
  totalElements: number;
}

export class ApiAuditRepository implements AuditRepository {
  private static readonly PATH = '/api/v1/audit-events';
  private apiClient = new ApiClient();

  async getAll(): Promise<AuditEvent[]> {
    const data = await this.search({ page: 0, size: 20 });
    return data.content;
  }

  async search(filters?: AuditQueryFilters): Promise<AuditPage> {
    const params = new URLSearchParams();

    const page = filters?.page ?? 0;
    const size = filters?.size ?? 20;
    params.set('page', String(page));
    params.set('size', String(size));

    if (filters?.actorId) params.set('actorId', filters.actorId);
    if (filters?.aggregateType) params.set('aggregateType', filters.aggregateType);
    if (filters?.aggregateId) params.set('aggregateId', filters.aggregateId);
    if (filters?.correlationId) params.set('correlationId', filters.correlationId);
    if (filters?.from) params.set('from', filters.from);
    if (filters?.to) params.set('to', filters.to);

    const queryString = params.toString();
    const url = queryString ? `${ApiAuditRepository.PATH}?${queryString}` : ApiAuditRepository.PATH;

    const data = await this.apiClient.get<BackendAuditPageResponse>(url);

    return {
      content: (data.content ?? []).map(dto => this.mapToDomain(dto)),
      page: data.page ?? 0,
      size: data.size ?? size,
      totalElements: data.totalElements ?? 0,
    };
  }

  async add(_event: NewAuditEvent): Promise<AuditEvent> {
    throw new Error('AUDIT_APPEND_ONLY: El registro de auditoría es inmutable y administrado por el backend.');
  }

  private mapToDomain(dto: BackendAuditEventResponse): AuditEvent {
    const rawResult = (dto.result ?? '').toLowerCase();
    const result = rawResult || 'unknown';

    const movementCode = dto.details?.movementCode as string | undefined;
    const objectDesc = dto.aggregateId
      ? `${dto.aggregateType ?? 'Movimiento'} ${dto.aggregateId}`
      : movementCode ?? '—';

    const description = dto.action || dto.eventType || '—';

    return {
      id: dto.id,
      date: formatDate(dto.occurredAt),
      time: formatTime(dto.occurredAt),
      userId: dto.actorId ?? '',
      action: dto.action,
      module: dto.aggregateType ?? dto.eventType ?? 'Auditoría',
      object: objectDesc,
      result,
      ip: '—', // Absent in backend, graceful fallback without faking
      description,
      details: dto.details ?? {},
      eventType: dto.eventType,
      actorId: dto.actorId,
      aggregateType: dto.aggregateType,
      aggregateId: dto.aggregateId,
      correlationId: dto.correlationId,
      occurredAt: dto.occurredAt,
    };
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-PE');
  } catch {
    return iso;
  }
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('es-PE');
  } catch {
    return '';
  }
}
