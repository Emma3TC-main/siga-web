import Dashboard from '../dashboard/Dashboard';

/**
 * El backend MVP no expone un producto BI separado. Esta ruta reutiliza el
 * dashboard canónico de Reporting y no fabrica indicadores en el cliente.
 */
export default function Analytics() {
  return <Dashboard />;
}
