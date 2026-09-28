import { Button, Input, Modal, Select, Textarea } from '../../../../components/ui';
import type { Category } from '../../../../../domain/entities/Category';
import type { UnitOfMeasure } from '../../../../../domain/entities/UnitOfMeasure';
import type { ProductType } from '../../../../../domain/entities/Product';
import { PRODUCT_FLAGS, TYPE_LABELS, type ProductFormData } from '../constants';

export interface ProductFormModalProps {
  open: boolean;
  editMode: boolean;
  form: ProductFormData;
  categories: Category[];
  units: UnitOfMeasure[];
  loading: boolean;
  onClose: () => void;
  onFieldChange: (patch: Partial<ProductFormData>) => void;
  onSave: () => void;
}

export function ProductFormModal({ open, editMode, form, categories, units, loading, onClose, onFieldChange, onSave }: ProductFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={editMode ? 'Editar producto' : 'Nuevo producto'} size="xl"
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button variant="primary" onClick={onSave} loading={loading} disabled={!form.name.trim() || !form.sku.trim()}>{editMode ? 'Guardar' : 'Crear producto'}</Button></>}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre del producto" value={form.name} onChange={e => onFieldChange({ name: e.target.value })} placeholder="Ej. Plancha AR400 10mm" />
          <Input label="SKU / Código" value={form.sku} onChange={e => onFieldChange({ sku: e.target.value })} placeholder="MAT-001" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Tipo" value={form.type} onChange={e => onFieldChange({ type: e.target.value as ProductType })}>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
          <Select label="Categoría" value={form.categoryId} onChange={e => onFieldChange({ categoryId: e.target.value })}>
            <option value="">Seleccionar...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Select label="Unidad de medida" value={form.unitId} onChange={e => onFieldChange({ unitId: e.target.value })}>
            <option value="">Seleccionar...</option>
            {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.code})</option>)}
          </Select>
          <Input label="Stock mínimo" type="number" value={String(form.minStock)} onChange={e => onFieldChange({ minStock: Number(e.target.value) })} />
          <Input label="Punto de reorden" type="number" value={String(form.reorderPoint)} onChange={e => onFieldChange({ reorderPoint: Number(e.target.value) })} />
        </div>
        <Input label="Costo promedio inicial (S/)" type="number" value={String(form.avgCost)} onChange={e => onFieldChange({ avgCost: Number(e.target.value) })} />
        <Textarea label="Descripción" value={form.description} onChange={e => onFieldChange({ description: e.target.value })} placeholder="Especificaciones técnicas..." rows={2} />
        <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg">
          {PRODUCT_FLAGS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={form[key] as boolean}
                onChange={e => onFieldChange({ [key]: e.target.checked } as Partial<ProductFormData>)}
                className="rounded border-gray-300 text-[#093C5D] focus:ring-[#3B7597]" />
              {label}
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}
