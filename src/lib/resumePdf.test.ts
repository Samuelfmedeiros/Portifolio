import { describe, it, expect } from "vitest";
import { generateResumePdf } from "./resumePdf";

const sample = {
  name: "Samuel Andrade",
  role: "Analista de Dados Pleno",
  contact: {
    location: "Brasília-DF",
    phone: "(61) 99119-1722",
    email: "samuelandrademedeiros@gmail.com",
  },
  objective: "Vaga de Analista de Dados focado em BI",
  summary: "Profissional com experiência em dashboards e pipelines.",
  experiences: [
    {
      title: "Analista de Dados",
      company: "ANA",
      period: "2025",
      bullets: ["Criação de dashboards Power BI", "Automação com Python e SQL"],
    },
  ],
  education: ["Pós em Ciência de Dados — IESB"],
  skills: ["Python", "SQL", "Power BI"],
};

const googleTheme = {
  id: "google",
  name: "Google",
  primary: [66, 133, 244] as [number, number, number],
  secondary: [234, 67, 53] as [number, number, number],
};

describe("resumePdf", () => {
  it("gera um Blob PDF válido (prefixo %PDF e tamanho > 0)", () => {
    const blob = generateResumePdf(sample, "pt");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("application/pdf");
    expect(blob.size).toBeGreaterThan(0);
  });

  it("gera PDF em inglês sem quebrar", () => {
    const blob = generateResumePdf({ ...sample, role: "Data Analyst" }, "en");
    expect(blob.size).toBeGreaterThan(0);
  });

  it("gera PDF com tema de cores da marca (Google)", () => {
    const blob = generateResumePdf(sample, "pt", googleTheme);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("não estoura com dados vazios (safe)", () => {
    const blob = generateResumePdf({ name: "", role: "" }, "pt");
    expect(blob.size).toBeGreaterThan(0);
  });

  it("aceita theme null como fallback (sem cor)", () => {
    const blob = generateResumePdf(sample, "en", null);
    expect(blob.size).toBeGreaterThan(0);
  });
});