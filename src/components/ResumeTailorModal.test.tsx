import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ResumeTailorModal } from "./ResumeTailorModal";

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

vi.mock("@/hooks/useFocusTrap", () => ({
  useFocusTrap: () => {},
}));

describe("ResumeTailorModal", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function () {});
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        resume: {
          name: "Samuel Medeiros",
          role: "Analista de Dados Pleno",
          contact: { email: "samuelandrademedeiros@gmail.com" },
          experiences: [
            { title: "Dev Pleno", company: "Global Hitss", period: "2022–hoje", bullets: ["Resp. dados"] },
          ],
          education: ["Pós em Ciência de Dados — IESB"],
          skills: ["Python", "SQL"],
        },
      }),
    }) as unknown as typeof fetch;
    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function fillInput() {
    const ta = screen.getByPlaceholderText("resume.tailor.placeholder");
    fireEvent.change(ta, { target: { value: "Vaga de Analista de Dados Pleno no Google" } });
  }

  it("não renderiza nada quando fechado", () => {
    render(<ResumeTailorModal open={false} onClose={onClose} />);
    expect(screen.queryByText(/resume.tailor.title/)).not.toBeInTheDocument();
  });

  it("renderiza textarea + botão quando aberto", () => {
    render(<ResumeTailorModal open onClose={onClose} />);
    expect(screen.getByText("resume.tailor.title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("resume.tailor.placeholder")).toBeInTheDocument();
    expect(screen.getByText("resume.tailor.btn")).toBeInTheDocument();
  });

  it("botão desabilitado com input curto (< 5) e habilita com input suficiente", () => {
    render(<ResumeTailorModal open onClose={onClose} />);
    const btn = screen.getByRole("button", { name: "resume.tailor.btn" });
    expect(btn).toBeDisabled();

    fillInput();
    // React processa a mudança de estado de forma assíncrona
    expect(screen.getByRole("button", { name: "resume.tailor.btn" })).toBeEnabled();
  });

  it("chama a API, gera markdown e fecha com sucesso", async () => {
    vi.useFakeTimers();
    render(<ResumeTailorModal open onClose={onClose} />);
    fillInput();
    fireEvent.submit(screen.getByRole("button", { name: "resume.tailor.btn" }).closest("form")!);

    // Flush das microtasks (fetch → json → download)
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(0);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/resume-tailor",
      expect.objectContaining({ method: "POST" }),
    );
    // mock de t() retorna o fallback "Currículo gerado!"
    expect(screen.getByText("Currículo gerado!")).toBeInTheDocument();

    vi.advanceTimersByTime(1600);
    expect(onClose).toHaveBeenCalled();
  });

  it("mostra mensagem de erro quando a API falha", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Erro ao gerar currículo. Tente novamente." }),
    });
    render(<ResumeTailorModal open onClose={onClose} />);
    fillInput();
    fireEvent.submit(screen.getByRole("button", { name: "resume.tailor.btn" }).closest("form")!);

    await waitFor(() =>
      expect(screen.getByText("Erro ao gerar currículo. Tente novamente.")).toBeInTheDocument(),
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});