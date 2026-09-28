import { useApp } from './presentation/state/AppContext';
import Layout from './presentation/components/layout/Layout';
import ForbiddenPage from './presentation/components/feedback/ForbiddenPage';
import {
  getRouteById,
  getRouteByPath,
  getRouteComponent,
  UNKNOWN_ROUTE_FALLBACK,
} from './presentation/navigation/routeRegistry';

export default function App() {
  const { state, canAccess } = useApp();
  const route = state.activeRoute;

  if (!state.currentUser || route === getRouteById('login').path) {
    const LoginComponent = getRouteById('login').component;
    return LoginComponent ? <LoginComponent /> : null;
  }

  const guard = (moduleName: string, page: React.ReactNode) => canAccess(moduleName) ? page : <ForbiddenPage moduleName={moduleName} />;

  const page = (() => {
    const definition = getRouteByPath(route);
    if (definition?.renderable) {
      const RouteComponent = getRouteComponent(definition, state.currentUser.role);
      if (RouteComponent) {
        const rendered = <RouteComponent />;
        return definition.guard === 'module' && definition.requiredModule
          ? guard(definition.requiredModule, rendered)
          : rendered;
      }
    }

    const FallbackComponent = UNKNOWN_ROUTE_FALLBACK.component;
    return <FallbackComponent />;
  })();

  return <Layout>{page}</Layout>;
}
