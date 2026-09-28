import { useApp } from '../../state/AppContext';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { AlertIcon, Button, PageHeader, PlusIcon } from '../../components/ui';
import { MODE_MODULE_NAME, type MovementMode } from './multi-detail/constants';
import { useMultiDetailForm } from './multi-detail/hooks/useMultiDetailForm';
import { MovementsList } from './multi-detail/components/MovementsList';
import { MovementFormModal } from './multi-detail/components/MovementFormModal';
import { MovementDetailModal } from './multi-detail/components/MovementDetailModal';
import { MovementSuccessModal } from './multi-detail/components/MovementSuccessModal';

export default function MultiDetailMovement({ mode }: { mode: MovementMode }) {
  const { navigate, canAccess } = useApp();
  const form = useMultiDetailForm(mode);
  const { config, movements, openForm, selected, setSelected, success, setSuccess } = form;

  const moduleName = MODE_MODULE_NAME[mode];
  const canCreate = canAccess(moduleName, 'create');

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={config.title}
        description={`${movements.length} registros · cabecera + N detalles`}
        breadcrumbs={getBreadcrumbs(moduleName, navigate)}
        actions={canCreate ? <Button size="sm" icon={<PlusIcon size={14} />} onClick={openForm}>{mode === 'adjustment' ? 'Nuevo' : 'Nueva'} {config.singular}</Button> : undefined}
      />

      {!canCreate && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          Su rol tiene acceso de consulta. La creación y confirmación están restringidas por la matriz de permisos.
        </div>
      )}
      {mode === 'adjustment' && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2 text-sm text-amber-800">
          <AlertIcon size={16} className="mt-0.5 flex-shrink-0" />
          <span><strong>Módulo restringido.</strong> Todo ajuste requiere evidencia cuando es negativo, autorización y confirmación MFA.</span>
        </div>
      )}

      <MovementsList movements={movements} config={config} canCreate={canCreate} onView={setSelected} onCreate={openForm} />

      <MovementFormModal mode={mode} form={form} />

      <MovementDetailModal movement={selected} onClose={() => setSelected(null)} />

      <MovementSuccessModal movement={success} title={config.title} onClose={() => setSuccess(null)} />
    </div>
  );
}
