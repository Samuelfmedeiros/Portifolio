export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--bg-primary)] focus:text-[var(--accent)] focus:px-4 focus:py-2 focus:rounded focus:border focus:border-[var(--accent)] focus:font-mono focus:text-sm"
    >
      Pular para conteúdo
    </a>
  );
}
