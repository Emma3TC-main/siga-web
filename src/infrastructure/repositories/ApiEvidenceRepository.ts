import { ApiClient } from '../http/ApiClient';
import type { Evidence, EvidencePage } from '../../domain/entities/Evidence';
import type { EvidenceRepository } from '../../domain/repositories/EvidenceRepository';

export class ApiEvidenceRepository implements EvidenceRepository {
  private readonly api = new ApiClient();
  private static readonly PATH = '/api/v1/evidences';

  listByMovement(ownerId: string, page = 0, size = 20): Promise<EvidencePage> {
    const query = new URLSearchParams({ ownerType: 'MOVEMENT', ownerId, page: String(page), size: String(size) });
    return this.api.get<EvidencePage>(`${ApiEvidenceRepository.PATH}?${query}`);
  }

  uploadMovement(ownerId: string, file: File, idempotencyKey: string, metadata?: Record<string, unknown>): Promise<Evidence> {
    const form = new FormData();
    form.set('ownerType', 'MOVEMENT');
    form.set('ownerId', ownerId);
    form.set('file', file);
    if (metadata && Object.keys(metadata).length > 0) form.set('metadata', JSON.stringify(metadata));
    return this.api.postForm<Evidence>(ApiEvidenceRepository.PATH, form, { 'Idempotency-Key': idempotencyKey });
  }

  download(id: string): Promise<{ blob: Blob; filename: string }> {
    return this.api.download(`${ApiEvidenceRepository.PATH}/${id}/content`);
  }
}
