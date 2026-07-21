"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Report to external service
    try {
      fetch("/api/contact-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "error_boundary",
          error: error.message,
          stack: error.stack?.slice(0, 500),
          componentStack: info.componentStack?.slice(0, 500),
        }),
      }).catch(() => {});
    } catch {
      // fire-and-forget, não quebra o app
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
          <div className="glass p-8 rounded-xl max-w-md text-center border-[var(--border)]">
            <h2 className="text-2xl font-mono text-red-400 mb-4">⚠ SISTEMA INSTÁVEL</h2>
            <p className="text-sm font-mono text-[var(--text-secondary)] mb-2">
              Uma falha crítica foi detectada:
            </p>
            <pre className="text-xs font-mono text-red-400/70 bg-black/30 rounded p-3 mb-6 max-h-32 overflow-auto">
              {this.state.error?.message || "Erro desconhecido"}
            </pre>
            <button
              onClick={this.handleReset}
              className="glass px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10 border-[var(--border)] transition-colors"
            >
              REINICIAR SISTEMA
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
