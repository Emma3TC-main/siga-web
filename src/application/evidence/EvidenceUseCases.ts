import type { EvidenceRepository } from '../../domain/repositories/EvidenceRepository';

export class EvidenceUseCases {
  constructor(private readonly repository: EvidenceRepository) {}

  listMovement(ownerId: string, page = 0, size = 20) {
    return this.repository.listByMovement(ownerId, page, size);
  }

  uploadMovement(ownerId: string, file: File, idempotencyKey: string, metadata?: Record<string, unknown>) {
    return this.repository.uploadMovement(ownerId, file, idempotencyKey, metadata);
  }

  download(id: string) {
    return this.repository.download(id);
  }
}
