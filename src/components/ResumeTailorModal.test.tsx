import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

// Base do CV — controlada p/ o buildDiff comparar base × tailored
vi.mock("@/lib/resumeData", () => ({
  getResumeData: () => ({
    name: "Samuel Medeiros",
    role: "Analista de Dados Pleno",
    objective: "Objetivo base do CV",
    summary: "Resumo base do CV",
    contact: { email: "samuelandrademedeiros@gmail.com" },
    experiences: [
      { title: "Dev Pleno", company: "Global Hitss", period: "2022–hoje", bullets: ["Resp. dados"] },
    ],
    education: ["Pós em Ciência de Dados — IESB"],
    skills: ["Python", "SQL"],
  }),
}));

const TAILORED = {
  resume: {
    name: "Samuel Medeiros",
    role: "Desenvolvedor Backend Python Sênior",
    contact: { email: "samuelandrademedeiros@gmail.com" },
    objective: "Objetivo reescrito para a vaga",
    summary: "Resumo reescrito para a vaga",
    experiences: [
      { title: "Dev Pleno", company: "Global Hitss", period: "2022–hoje", bullets: ["APIs REST escaláveis em produção"] },
    ],
    education: ["Pós em Ciência de Dados — IESB"],
    skills: ["Linguagens: Python, SQL"],
    highlights: ["Python", "FastAPI"],
    jobMatch: ["APIs de alta escala → experiência real com REST em produção"],
  },
  brand: null,
  jobRef: "Backend Python Sênior no Nubank",
};

describe("ResumeTailorModal", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function () {});
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => TAILORED,
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
    fireEvent.change(ta, { target: { value: "Vaga de Backend Python no Nubank" } });
  }

  function submit() {
    fireEvent.submit(screen.getByRole("button", { name: "resume.tailor.btn" }).closest("form")!);
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
    expect(screen.getByRole("button", { name: "resume.tailor.btn" })).toBeEnabled();
  });

  it("V5: painel 'o que a IA mudou' com antes → depois, match e baixar novamente (modal NÃO fecha sozinho)", async () => {
    render(<ResumeTailorModal open onClose={onClose} />);
    fillInput();
    submit();

    await waitFor(() =>
      expect(screen.getByText("O que a IA mudou")).toBeInTheDocument(),
    );

    // Diff do cargo: antes (base) → depois (tailored)
    expect(screen.getByText("Analista de Dados Pleno")).toBeInTheDocument();
    expect(screen.getByText("Desenvolvedor Backend Python Sênior")).toBeInTheDocument();

    // Match com a vaga (jobMatch gerado pela API)
    expect(
      screen.getByText("APIs de alta escala → experiência real com REST em produção"),
    ).toBeInTheDocument();

    // Palavras-chave da vaga (highlights)
    expect(screen.getByText("FastAPI")).toBeInTheDocument();

    // Modal permanece aberto — fechamento é manual agora
    expect(onClose).not.toHaveBeenCalled();

    // Baixa novamente SEM chamar a API de novo
    fireEvent.click(screen.getByRole("button", { name: "Baixar novamente" }));
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("V5: resposta sem jobMatch/highlights → painel renderiza sem crash e sem seções vazias", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...TAILORED,
        resume: { ...TAILORED.resume, jobMatch: undefined, highlights: undefined },
      }),
    });
    render(<ResumeTailorModal open onClose={onClose} />);
    fillInput();
    submit();

    await waitFor(() =>
      expect(screen.getByText("O que a IA mudou")).toBeInTheDocument(),
    );
    expect(screen.queryByText("Match com a vaga")).not.toBeInTheDocument();
    expect(screen.queryByText("Palavras-chave da vaga")).not.toBeInTheDocument();
  });

  it("fluxo standard (input não-vaga) baixa o CV do site e fecha sozinho", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ standard: true, locale: "pt" }) })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(["%PDF-1.4"], { type: "application/pdf" }),
      });
    render(<ResumeTailorModal open onClose={onClose} />);
    fillInput();
    submit();

    await waitFor(() =>
      expect(screen.getByText("Currículo gerado!")).toBeInTheDocument(),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/resume-tailor",
      expect.objectContaining({ method: "POST" }),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/download-cv",
      expect.objectContaining({ method: "POST" }),
    );

    // Fecha sozinho após 1600ms (fluxo standard não tem diff pra mostrar)
    expect(onClose).not.toHaveBeenCalled();
    await waitFor(() => expect(onClose).toHaveBeenCalled(), { timeout: 3000 });
  });

  it("mostra mensagem de erro quando a API falha", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Erro ao gerar currículo. Tente novamente." }),
    });
    render(<ResumeTailorModal open onClose={onClose} />);
    fillInput();
    submit();

    await waitFor(() =>
      expect(screen.getByText("Erro ao gerar currículo. Tente novamente.")).toBeInTheDocument(),
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});
