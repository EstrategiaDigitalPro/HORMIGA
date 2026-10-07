import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-md mx-auto my-12 text-center bg-white rounded-2xl border border-red-200 shadow-sm space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#202522]">Ocurrió un inconveniente al cargar esta vista</h2>
          <p className="text-xs text-[#68716B]">
            Puedes recargar la pantalla para continuar sin perder tus datos.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#176B45] text-white text-xs font-semibold rounded-xl hover:bg-[#125537] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recargar pantalla</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
