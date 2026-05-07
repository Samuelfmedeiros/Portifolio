import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="glass p-12 rounded-xl text-center max-w-md border-[var(--border)]">
        <h1 className="text-8xl font-mono font-bold text-[var(--accent)] mb-4">404</h1>
        <p className="text-xl font-mono text-[var(--text-secondary)] mb-2">
          SINAL PERDIDO
        </p>
        <p className="text-sm font-mono text-[var(--text-secondary)]/60 mb-8">
          A transmissão foi interrompida ou a rota não existe neste quadrante.
        </p>
        <Link
          href="/"
          className="inline-block glass px-6 py-3 rounded-lg font-mono text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10 border-[var(--border)] transition-colors"
        >
          ← RETORNAR À BASE
        </Link>
      </div>
    </div>
  );
}
