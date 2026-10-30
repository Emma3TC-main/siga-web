export interface Evidence {
  id: string;
  ownerType: 'MOVEMENT';
  ownerId: string;
  originalFilename: string;
  contentType: 'application/pdf' | 'image/jpeg' | 'image/png';
  sizeBytes: number;
  sha256: string;
  uploadedByUserId: string;
  status: 'AVAILABLE';
  metadata: Record<string, unknown>;
  uploadedAt: string;
  updatedAt: string;
}

export interface EvidencePage {
  content: Evidence[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
