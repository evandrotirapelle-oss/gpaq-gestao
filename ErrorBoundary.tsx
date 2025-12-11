import React, { Component, ReactNode, ErrorInfo } from 'react';

// Define o que o componente recebe (filhos)
interface Props {
  children: ReactNode;
}

// Define o formato do State
interface State {
  hasError: boolean;
  error?: Error;
}

// 👇 A MÁGICA ESTÁ NESTA LINHA ABAIXO.
// Se você não tiver "extends Component<Props, State>", os erros NÃO vão sumir.
class ErrorBoundary extends Component<Props, State> {
  
  constructor(props: Props) {
    super(props);
    // Inicializa o state
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para mostrar a UI alternativa na próxima renderização
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Loga o erro no console
    console.error("Erro capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Interface de erro (Fallback UI)
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600">Ops! Algo deu errado.</h1>
          <p className="mt-2 text-gray-700">Não foi possível carregar esta parte do aplicativo.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    // Se não tiver erro, renderiza o app normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;