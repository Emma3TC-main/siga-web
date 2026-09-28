import type { Category } from '../../../../domain/entities/Category';
import type { Location } from '../../../../domain/entities/Location';
import { Button, Badge, Input, DownloadIcon, EyeIcon } from '../../../components/ui';
import { REPORTS } from '../constants';

export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  category: string;
  location: string;
  costCenter: string;
}

interface ReportsCatalogProps {
  filters: ReportFilters;
  onFiltersChange: (updater: (f: ReportFilters) => ReportFilters) => void;
  categories: Category[];
  locations: Location[];
  onSelectReport: (id: string) => void;
}

export function ReportsCatalog({ filters, onFiltersChange, categories, locations, onSelectReport }: ReportsCatalogProps) {
  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Filters bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Input label="" type="date" value={filters.dateFrom} onChange={e => onFiltersChange(f => ({ ...f, dateFrom: e.target.value }))} className="h-8 text-xs w-36" />
        <Input label="" type="date" value={filters.dateTo} onChange={e => onFiltersChange(f => ({ ...f, dateTo: e.target.value }))} className="h-8 text-xs w-36" />
        <select value={filters.category} onChange={e => onFiltersChange(f => ({ ...f, category: e.target.value }))} className="siga-select w-44 h-8 text-xs">
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filters.location} onChange={e => onFiltersChange(f => ({ ...f, location: e.target.value }))} className="siga-select w-44 h-8 text-xs">
          <option value="">Todas las ubicaciones</option>
          {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map(report => (
          <div key={report.id} className="siga-card p-5 cursor-pointer hover:border-[#3B7597] hover:shadow-md transition-all" onClick={() => onSelectReport(report.id)}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{report.icon}</span>
              {report.badge && <Badge variant={report.badge === 'Urgente' ? 'error' : report.badge === 'Operativo' ? 'warning' : 'primary'}>{report.badge}</Badge>}
            </div>
            <h3 className="font-semibold text-[#093C5D] text-sm mb-1">{report.name}</h3>
            <p className="text-xs text-gray-400 mb-3">{report.description}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={<EyeIcon size={12} />} className="flex-1" onClick={() => onSelectReport(report.id)}>Ver reporte</Button>
              <Button variant="ghost" size="sm" icon={<DownloadIcon size={12} />}>Exportar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
