import { createContext, useContext, useReducer, useCallback, useMemo, type ReactNode } from 'react';
import type { AppState, User, Toast } from '../../types';
import { DEFAULT_SYSTEM_CONFIG } from '../../types';
import { hasPermission } from '../../domain/rules/permissionRules';
import { DEMO_EVIDENCES } from '../../data/demo';
import { useCatalog } from './CatalogContext';
import { useOperations } from './OperationsContext';
import { getErrorMessage } from '../../shared/errors/getErrorMessage';

/**
 * Estado que aún gestiona este reducer: sesión, navegación y avisos.
 * Datos maestros y operación del almacén viven en sus providers y se componen en `state`.
 */
type CoreState = Omit<
  AppState,
  'products' | 'categories' | 'units' | 'suppliers' | 'locations' | 'costCenters' | 'responsibles'
  | 'users' | 'stock' | 'movements' | 'authorizations' | 'alerts' | 'auditLog' | 'physicalCounts'
>;

type Action =
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_ROUTE'; route: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_NETWORK'; online: boolean }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string };

const initialState: CoreState = {
  currentUser: null,
  evidences: DEMO_EVIDENCES,
  offlineDrafts: [],
  systemConfig: DEFAULT_SYSTEM_CONFIG,
  toasts: [],
  activeRoute: '/login',
  sidebarCollapsed: false,
  mobileView: false,
  networkOnline: true,
};

function appReducer(state: CoreState, action: Action): CoreState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.user, activeRoute: '/dashboard' };

    case 'LOGOUT':
      return { ...state, currentUser: null, activeRoute: '/login' };

    case 'SET_ROUTE':
      return { ...state, activeRoute: action.route };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'SET_NETWORK':
      return { ...state, networkOnline: action.online };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  navigate: (route: string) => void;
  toggleSidebar: () => void;
  setNetworkOnline: (online: boolean) => void;
  /** Muestra un aviso; se descarta a los 4 s salvo que `autoDismiss` sea `false`. */
  showToast: (type: Toast['type'], message: string, autoDismiss?: boolean) => void;
  markAlertRead: (id: string) => void;
  canAccess: (module: string, action?: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [coreState, dispatch] = useReducer(appReducer, initialState);
  const { products, categories, units, suppliers, locations, costCenters, responsibles } = useCatalog();
  const { stock, movements, authorizations, alerts, auditLog, physicalCounts, users, markAlertRead: markRead } = useOperations();
  const state = useMemo<AppState>(
    () => ({ ...coreState, products, categories, units, suppliers, locations, costCenters, responsibles, users, stock, movements, authorizations, alerts, auditLog, physicalCounts }),
    [coreState, products, categories, units, suppliers, locations, costCenters, responsibles, users, stock, movements, authorizations, alerts, auditLog, physicalCounts],
  );

  const login = useCallback((user: User) => dispatch({ type: 'LOGIN', user }), []);
  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
  const navigate = useCallback((route: string) => dispatch({ type: 'SET_ROUTE', route }), []);
  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setNetworkOnline = useCallback((online: boolean) => dispatch({ type: 'SET_NETWORK', online }), []);

  const showToast = useCallback((type: Toast['type'], message: string, autoDismiss = true) => {
    const id = `toast-${Date.now()}`;
    dispatch({ type: 'ADD_TOAST', toast: { id, type, message } });
    if (autoDismiss) setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 4000);
  }, []);

  /** Las acciones sin espera de la UI no pueden lanzar: si fallan, se avisa con un toast. */
  const reportFailure = useCallback((task: Promise<unknown>) => {
    task.catch((error: unknown) => showToast('error', getErrorMessage(error)));
  }, [showToast]);

  const markAlertRead = useCallback((id: string) => reportFailure(markRead(id)), [markRead, reportFailure]);

  const canAccess = useCallback(
    (module: string, action = 'view') => hasPermission(state.currentUser?.role, module, action),
    [state.currentUser],
  );

  return (
    <AppContext.Provider value={{ state, login, logout, navigate, toggleSidebar, setNetworkOnline, showToast, markAlertRead, canAccess }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
