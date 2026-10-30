import type { Evidence, EvidencePage } from '../entities/Evidence';

export interface EvidenceRepository {
  listByMovement(ownerId: string, page?: number, size?: number): Promise<EvidencePage>;
  uploadMovement(ownerId: string, file: File, idempotencyKey: string, metadata?: Record<string, unknown>): Promise<Evidence>;
  download(id: string): Promise<{ blob: Blob; filename: string }>;
}
