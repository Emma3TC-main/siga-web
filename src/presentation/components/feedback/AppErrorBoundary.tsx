import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, AlertIcon } from '../ui';

type Props = { children: ReactNode };
type State = { hasError: boolean; correlationId: string };

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, correlationId: '' };

  static getDerivedStateFromError(): State {
    return { hasError: true, correlationId: `SIGA-${Date.now().toString(36).toUpperCase()}` };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SIGA unexpected error', { error, info, correlationId: this.state.correlationId });
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <div className="min-h-full flex items-center justify-center p-6 bg-[#F4F6F8]"><div className="siga-card max-w-lg w-full p-8 text-center"><div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center"><AlertIcon size={28} /></div><h1 className="text-xl font-bold text-[#093C5D] mt-4">Ocurrió un error inesperado</h1><p className="text-sm text-gray-500 mt-2">No se aplicó ninguna operación sensible. Puede volver al inicio o compartir el identificador con soporte.</p><code className="block mt-4 p-2 rounded bg-gray-100 text-xs text-gray-600">correlationId: {this.state.correlationId}</code><Button className="mt-5" onClick={() => { this.setState({ hasError: false, correlationId: '' }); window.location.reload(); }}>Volver a cargar</Button></div></div>;
  }
}
