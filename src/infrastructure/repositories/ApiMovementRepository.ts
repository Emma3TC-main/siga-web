import { ApiClient } from '../http/ApiClient';
import type { Movement, MovementLine, MovementType, MovementStatus } from '../../domain/entities/Movement';
import type { MovementRepository } from '../../domain/repositories/MovementRepository';
import type { UnitRepository } from '../../domain/repositories/UnitRepository';
import { MovementEvidenceRequiredError, NotFoundError } from '../../domain/errors';
import { ApiError } from '../http/ApiClient';

interface BackendMovementResponse {
  id: string;
  movementCode: string;
  movementType: string;
  status: string;
  registeredByUserId: string;
  requestedByUserId: string | null;
  costCenterCode: string | null;
  costCenterNameSnapshot: string | null;
  supplierId: string | null;
  supplierNameSnapshot: string | null;
  supplierTaxIdSnapshot: string | null;
  sensitive: boolean;
  sensitivityReason: string | null;
  details: BackendMovementDetailResponse[];
  createdAt: string;
  submittedAt: string | null;
  confirmedAt: string | null;
}

interface BackendMovementDetailResponse {
  id: string;
  lineNumber: number;
  productId: string;
  enteredQuantity: number;
  unitCode: string;
  conversionFactor: number;
  stockQuantity: number;
  originLocationId: string | null;
  destinationLocationId: string | null;
  lotId: string | null;
  assetId: string | null;
  originalCurrency: string | null;
  originalUnitCost: number | null;
  exchangeRate: number | null;
  exchangeRateDate: string | null;
  exchangeRateSource: string | null;
}

interface MovementPage {
  content: BackendMovementResponse[];
  page: number;
  size: number;
  totalElements: number;
}

export class ApiMovementRepository implements MovementRepository {
  private static readonly PATH = '/api/v1/movements';
  private apiClient = new ApiClient();
  readonly isAuthoritative = true;

  constructor(private readonly units: UnitRepository) {}

  async getAll(): Promise<Movement[]> {
    const data = await this.apiClient.get<MovementPage>(`${ApiMovementRepository.PATH}?page=0&size=100`);
    return data.content.map((dto: BackendMovementResponse) => this.mapToDomain(dto));
  }

  async getById(id: string): Promise<Movement | null> {
    try {
      const data = await this.apiClient.get<BackendMovementResponse>(`${ApiMovementRepository.PATH}/${id}`);
      return this.mapToDomain(data);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) return null;
      throw error;
    }
  }

  async add(movement: Movement): Promise<Movement> {
    const createReq = await this.mapToCreateRequest(movement);
    let currentDto = await this.apiClient.post<BackendMovementResponse>(`${ApiMovementRepository.PATH}`, createReq);

    if (movement.status === 'borrador') {
      return this.mapToDomain(currentDto);
    }

    try {
      currentDto = await this.submitDto(currentDto.id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409 && error.data?.code === 'EVIDENCE_REQUIRED') {
        throw new MovementEvidenceRequiredError(this.mapToDomain(currentDto));
      }
      throw error;
    }

    if (currentDto.status === 'DRAFT') {
      const idempotencyKey = crypto.randomUUID();
      currentDto = await this.apiClient.post<BackendMovementResponse>(
        `${ApiMovementRepository.PATH}/${currentDto.id}/confirm`,
        {},
        { headers: { 'Idempotency-Key': idempotencyKey } }
      );
    }

    return this.mapToDomain(currentDto);
  }

  async submit(id: string): Promise<Movement> {
    return this.mapToDomain(await this.submitDto(id));
  }

  async update(movement: Movement): Promise<Movement> {
    // Used by ResolveAuthorization (approve/reject) and ConfirmMovement (step-up confirm)
    if (movement.status === 'rechazado') {
      await this.apiClient.post(`${ApiMovementRepository.PATH}/${movement.id}/reject`, {
        reason: movement.rejectionReason || 'Rechazado desde Web',
      });
      const data = await this.apiClient.get<BackendMovementResponse>(`${ApiMovementRepository.PATH}/${movement.id}`);
      return this.mapToDomain(data);
    }

    if (movement.status === 'autorizado') {
      // Actually backend expects AuthorizeDecision for approval
      await this.apiClient.post(`${ApiMovementRepository.PATH}/${movement.id}/authorize`, {
        reason: 'Autorizado desde Web',
      });
      const data = await this.apiClient.get<BackendMovementResponse>(`${ApiMovementRepository.PATH}/${movement.id}`);
      return this.mapToDomain(data);
    }

    if (movement.status === 'confirmado') {
      const idempotencyKey = crypto.randomUUID();
      const data = await this.apiClient.post<BackendMovementResponse>(
        `${ApiMovementRepository.PATH}/${movement.id}/confirm`,
        {},
        { headers: { 'Idempotency-Key': idempotencyKey } }
      );
      return this.mapToDomain(data);
    }

    if (movement.status === 'cancelado') {
      await this.apiClient.post(`${ApiMovementRepository.PATH}/${movement.id}/cancel`, {});
      const data = await this.apiClient.get<BackendMovementResponse>(`${ApiMovementRepository.PATH}/${movement.id}`);
      return this.mapToDomain(data);
    }

    return movement;
  }

  private requireUUID(id: string | undefined | null, field: string): string | null {
    if (!id) return null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error(`BLOCKED_BY_CANONICAL_MASTER_DATA: La operación requiere datos maestros canónicos para '${field}' (UUID), pero el valor actual proviene de DEMO (${id}).`);
    }
    return id;
  }

  private submitDto(id: string): Promise<BackendMovementResponse> {
    return this.apiClient.post<BackendMovementResponse>(
      `${ApiMovementRepository.PATH}/${id}/submit`,
      {}
    );
  }

  private requireCanonicalTraceabilityId(
    id: string | undefined,
    source: 'canonical' | 'demo' | undefined,
    kind: 'LOT' | 'ASSET',
  ): string | null {
    if (!id) return null;
    if (source !== 'canonical') {
      throw new Error(
        `BLOCKED_BY_${kind}: La trazabilidad debe seleccionarse desde la fuente canónica; no se enviará un valor manual o DEMO.`
      );
    }
    return this.requireUUID(id, kind === 'LOT' ? 'Lot' : 'Asset');
  }

  private async mapToCreateRequest(movement: Movement): Promise<any> {
    const allUnits = await this.units.getAll();
    const typeMap: Record<MovementType, string> = {
      'entrada': 'ENTRY',
      'salida': 'EXIT',
      'transferencia': 'TRANSFER',
      'ajuste_positivo': 'ADJUST_POSITIVE',
      'ajuste_negativo': 'ADJUST_NEGATIVE',
      'conteo': 'ADJUST_POSITIVE' // Fallback
    };
    return {
      movementType: typeMap[movement.type] || 'ENTRY',
      // No hay fuente canónica de responsables en REMOTE; el campo es opcional y no se propaga desde DEMO.
      requestedByUserId: null,
      // CostCenters sigue sin fuente canónica REMOTE; no persistir códigos provenientes del repositorio DEMO.
      costCenterCode: null,
      costCenterNameSnapshot: null,
      supplierId: this.requireUUID(movement.supplierId, 'Supplier'),
      referenceDocType: movement.documentType || null,
      referenceDocNumber: movement.documentNumber || null,
      reason: movement.motive || null,
      notes: movement.observations || null,
      details: (movement.lines || []).map(line => {
        const lotId = this.requireCanonicalTraceabilityId(line.batch, line.lotSource, 'LOT');
        const assetId = this.requireCanonicalTraceabilityId(line.serial, line.assetSource, 'ASSET');
        const unitId = this.requireUUID(line.unitId, 'Unit');
        const unit = allUnits.find(candidate => candidate.id === unitId);
        const originalUnitCost =
          movement.type === 'entrada' || movement.type === 'ajuste_positivo'
            ? line.unitCost ?? null
            : null;
        if (!unit?.code?.trim()) {
          throw new Error(
            `BLOCKED_BY_CANONICAL_MASTER_DATA: No existe una unidad canónica con id '${line.unitId}' y código válido.`
          );
        }
        return {
          productId: this.requireUUID(line.productId, 'Product') || line.productId,
          enteredQuantity: line.quantity,
          unitCode: unit.code,
          originLocationId: this.requireUUID(line.fromLocationId, 'Origin Location'),
          destinationLocationId: this.requireUUID(line.toLocationId, 'Destination Location'),
          lotId,
          assetId,
          originalCurrency: originalUnitCost === null ? null : 'PEN',
          originalUnitCost,
          exchangeRate: null,
          exchangeRateDate: null,
          exchangeRateSource: null,
        };
      }),
    };
  }

  private mapToDomain(dto: BackendMovementResponse): Movement {
    const typeMap: Record<string, MovementType> = {
      ENTRY: 'entrada',
      EXIT: 'salida',
      TRANSFER: 'transferencia',
      ADJUST_POSITIVE: 'ajuste_positivo',
      ADJUST_NEGATIVE: 'ajuste_negativo',
    };
    const statusMap: Record<string, MovementStatus> = {
      DRAFT: 'borrador',
      PENDING_AUTHORIZATION: 'pendiente_autorizacion',
      AUTHORIZED: 'autorizado',
      CONFIRMED: 'confirmado',
      REJECTED: 'rechazado',
      CANCELLED: 'cancelado',
    };

    const lines: MovementLine[] = dto.details.map(d => ({
      id: d.id,
      productId: d.productId,
      quantity: d.enteredQuantity,
      unitId: d.unitCode,
      fromLocationId: d.originLocationId || undefined,
      toLocationId: d.destinationLocationId || undefined,
      batch: d.lotId || undefined,
      serial: d.assetId || undefined,
      lotSource: d.lotId ? 'canonical' : undefined,
      assetSource: d.assetId ? 'canonical' : undefined,
      unitCost: d.originalUnitCost || undefined,
      totalCost: (d.enteredQuantity && d.originalUnitCost) ? (d.enteredQuantity * d.originalUnitCost) : undefined,
    }));

    return {
      id: dto.id,
      type: typeMap[dto.movementType] || 'entrada',
      status: statusMap[dto.status] || 'borrador',
      productId: lines[0]?.productId || '',
      quantity: lines.reduce((acc, l) => acc + l.quantity, 0),
      unitId: lines[0]?.unitId || '',
      documentNumber: dto.movementCode,
      costCenterId: dto.costCenterCode || undefined,
      registeredBy: dto.registeredByUserId,
      requesterId: dto.requestedByUserId || undefined,
      createdAt: dto.createdAt,
      confirmedAt: dto.confirmedAt || undefined,
      isSensitive: dto.sensitive,
      supplierId: dto.supplierId || undefined,
      lines,
    };
  }
}
