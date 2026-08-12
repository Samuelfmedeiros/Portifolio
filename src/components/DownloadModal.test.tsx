import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DownloadModal } from "./DownloadModal";

// Mocks
vi.mock("@/lib/i18n", () => ({
  useLanguage: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    locale: "pt",
  }),
}));

vi.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({ track: vi.fn() }),
}));

vi.mock("@/lib/supabase", () => ({
  submitCVDownload: vi.fn(),
}));

vi.mock("@/lib/umami", () => ({
  loadUmamiScript: vi.fn(),
}));

// useFocusTrap real roda rAF/focus no jsdom — mock para determinismo
vi.mock("@/hooks/useFocusTrap", () => ({
  useFocusTrap: () => {},
}));

describe("DownloadModal", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Fetch mock default: sucesso com blob
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(["pdf"], { type: "application/pdf" }),
    }) as unknown as typeof fetch;
    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("não renderiza nada quando fechado", () => {
    render(<DownloadModal open={false} onClose={onClose} />);
    expect(screen.queryByText(/cv.title/)).not.toBeInTheDocument();
  });

  it("renderiza campos name/email/consent quando aberto", () => {
    render(<DownloadModal open onClose={onClose} />);
    expect(screen.getByPlaceholderText("cv.name.placeholder")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("cv.email.placeholder")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("botão de download fica desabilitado sem consentimento", () => {
    render(<DownloadModal open onClose={onClose} />);
    const btn = screen.getByRole("button", { name: /cv.btn.download/ });
    expect(btn).toBeDisabled();
  });

  it("habilita o botão após marcar consentimento", () => {
    render(<DownloadModal open onClose={onClose} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("button", { name: /cv.btn.download/ })).toBeEnabled();
  });

  it("não chama fetch se clicar sem consentimento", () => {
    render(<DownloadModal open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /cv.btn.download/ }));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("submete com consentimento e dispara download (nome+email)", async () => {
    // Espiona o click do anchor — o componente remove o <a> do DOM na hora
    let clickedAnchor: HTMLAnchorElement | null = null;
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      clickedAnchor = this;
    });

    render(<DownloadModal open onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText("cv.name.placeholder"), {
      target: { value: "Samuel" },
    });
    fireEvent.change(screen.getByPlaceholderText("cv.email.placeholder"), {
      target: { value: "samuel@email.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /cv.btn.download/ }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/download-cv",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    const [, init] = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      name: "Samuel",
      email: "samuel@email.com",
      consent: true,
      locale: "pt",
    });

    // Download click disparado no anchor correto
    await waitFor(() => {
      expect(clickedAnchor).not.toBeNull();
    });
    expect(clickedAnchor!.download).toBe("Samuel_Andrade_2026.pdf");
  });

  it("mostra estado de sucesso e fecha após 1.5s", async () => {
    vi.useFakeTimers();
    render(<DownloadModal open onClose={onClose} />);
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /cv.btn.download/ }));

    // Flush das microtasks do fetch (fetch → blob são 2 camadas de promise)
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(0);
    expect(screen.getByText(/Download iniciado/)).toBeInTheDocument();

    vi.advanceTimersByTime(1600);
    expect(onClose).toHaveBeenCalled();
  });

  it("mostra erro quando a API falha", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Falha no servidor" }),
    }) as unknown as typeof fetch;

    render(<DownloadModal open onClose={onClose} />);
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /cv.btn.download/ }));

    await waitFor(() => {
      expect(screen.getByText("Falha no servidor")).toBeInTheDocument();
    });
  });

  it("fecha pelo botão X (aria-label)", () => {
    render(<DownloadModal open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /cv.close|Fechar/ }));
    expect(onClose).toHaveBeenCalled();
  });
});
