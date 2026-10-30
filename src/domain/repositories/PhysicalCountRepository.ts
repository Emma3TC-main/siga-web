import type {
  AddUnexpectedPhysicalCountLineInput,
  CancelPhysicalCountInput,
  CapturePhysicalCountLineInput,
  ClosePhysicalCountInput,
  CreatePhysicalCountInput,
  PhysicalCount,
  PhysicalCountPage,
} from '../entities/PhysicalCount';

export interface PhysicalCountRepository {
  listCounts(page: number, size: number): Promise<PhysicalCountPage>;
  createCount(input: CreatePhysicalCountInput, idempotencyKey: string): Promise<PhysicalCount>;
  getCount(id: string): Promise<PhysicalCount>;
  captureLine(input: CapturePhysicalCountLineInput): Promise<PhysicalCount>;
  addUnexpectedLine(input: AddUnexpectedPhysicalCountLineInput, idempotencyKey: string): Promise<PhysicalCount>;
  closeCount(input: ClosePhysicalCountInput, idempotencyKey: string): Promise<PhysicalCount>;
  cancelCount(input: CancelPhysicalCountInput, idempotencyKey: string): Promise<PhysicalCount>;
}
