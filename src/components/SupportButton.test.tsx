import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SupportButton } from "./SupportButton";

vi.mock("@/lib/i18n", () => ({
  useLanguage: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));

vi.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({ track: vi.fn() }),
}));

vi.mock("@/lib/monetization", () => ({
  BMC_CONFIG: { enabled: true, url: "https://www.buymeacoffee.com/samuel", username: "samuel" },
}));

describe("SupportButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // clipboard mock
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("renderiza o botão Apoiar", () => {
    render(<SupportButton />);
    expect(screen.getByRole("button", { name: /Apoiar/ })).toBeInTheDocument();
  });

  it("abre o modal com QR code e chave Pix ao clicar", async () => {
    render(<SupportButton />);
    fireEvent.click(screen.getByRole("button", { name: /Apoiar/ }));

    // AnimatePresence monta o modal de forma assíncrona (mock i18n → fallback)
    await waitFor(() => {
      expect(screen.getByText(/Apoie este projeto/)).toBeInTheDocument();
    });
    // Chave Pix visível
    expect(screen.getByText("samuelandrademedeiros@gmail.com")).toBeInTheDocument();
    // QR code com payload pix encodado
    const qr = screen.getByRole("img", { name: /Pix QR Code/i });
    expect(qr).toHaveAttribute("src", expect.stringContaining("api.qrserver.com"));
    expect(qr).toHaveAttribute("src", expect.stringContaining("BR.GOV.BCB.PIX"));
  });

  it("copia a chave Pix e mostra feedback de copiado", async () => {
    render(<SupportButton />);
    fireEvent.click(screen.getByRole("button", { name: /Apoiar/ }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Copiar chave/ })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /Copiar chave/ }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("samuelandrademedeiros@gmail.com");
    });
  });

  it("fallback de copiar via execCommand quando clipboard indisponível", async () => {
    Object.assign(navigator, { clipboard: undefined });
    document.execCommand = vi.fn(() => true);

    render(<SupportButton />);
    fireEvent.click(screen.getByRole("button", { name: /Apoiar/ }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Copiar chave/ })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /Copiar chave/ }));

    await waitFor(() => {
      expect(document.execCommand).toHaveBeenCalledWith("copy");
    });
  });

  it("fecha o modal ao clicar no overlay", async () => {
    render(<SupportButton />);
    fireEvent.click(screen.getByRole("button", { name: /Apoiar/ }));

    await waitFor(() => {
      expect(screen.getByText(/Apoie este projeto/)).toBeInTheDocument();
    });
    // Overlay do modal — cuidado: ".absolute.inset-0" genérico pega o span do botão Apoiar
    const overlay = document.querySelector('[class*="bg-black/70"]');
    expect(overlay).not.toBeNull();
    fireEvent.click(overlay!);
    await waitFor(() => {
      expect(screen.queryByText(/Apoie este projeto/)).not.toBeInTheDocument();
    });
  });
});
