import type {
  AddUnexpectedPhysicalCountLineInput,
  CancelPhysicalCountInput,
  CapturePhysicalCountLineInput,
  ClosePhysicalCountInput,
  CreatePhysicalCountInput,
} from '../../domain/entities/PhysicalCount';
import type { PhysicalCountRepository } from '../../domain/repositories/PhysicalCountRepository';

export class PhysicalCountUseCases {
  constructor(private readonly repository: PhysicalCountRepository) {}

  listCounts(page = 0, size = 20) { return this.repository.listCounts(page, size); }
  createCount(input: CreatePhysicalCountInput, key: string) { return this.repository.createCount(input, key); }
  getCount(id: string) { return this.repository.getCount(id); }
  captureLine(input: CapturePhysicalCountLineInput) { return this.repository.captureLine(input); }
  addUnexpectedLine(input: AddUnexpectedPhysicalCountLineInput, key: string) {
    return this.repository.addUnexpectedLine(input, key);
  }
  closeCount(input: ClosePhysicalCountInput, key: string) { return this.repository.closeCount(input, key); }
  cancelCount(input: CancelPhysicalCountInput, key: string) { return this.repository.cancelCount(input, key); }
}
