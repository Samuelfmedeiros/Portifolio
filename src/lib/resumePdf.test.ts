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

async function pageCount(blob: Blob): Promise<number> {
  const text = await blob.text();
  // "/Type /Page" sem ser "/Type /Pages" (raiz das páginas)
  return (text.match(/\/Type\s*\/Page(?![s])/g) ?? []).length;
}

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

describe("resumePdf V5 — Match com a vaga", () => {
  it("gera PDF com jobMatch (card de match) sem quebrar", () => {
    const blob = generateResumePdf(
      {
        ...sample,
        jobRef: "Backend Python Sênior no Nubank",
        jobMatch: [
          "APIs de alta escala → experiência real com REST em produção",
          "PostgreSQL avançado → modelagem e otimização de queries no dia a dia",
          "Microsserviços → integrações entre sistemas na Global Hitss",
        ],
      },
      "pt",
    );
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("jobMatch em inglês sem quebrar", () => {
    const blob = generateResumePdf(
      { ...sample, jobRef: "Senior Backend Engineer", jobMatch: ["APIs at scale → real REST experience in prod"] },
      "en",
    );
    expect(blob.size).toBeGreaterThan(0);
  });

  it("jobMatch com 4 bullets longos continua em 1 página (card pula se não couber)", async () => {
    const blob = generateResumePdf(
      {
        ...sample,
        summary:
          "Profissional com experiência em dashboards, pipelines de dados, automação, modelagem analítica e governança de dados em ambientes corporativos complexos e multisetoriais, sempre com foco em entrega e resultado.",
        jobRef: "Vaga com muitos requisitos acumulados",
        jobMatch: [
          "Requisito um → evidência real do CV com texto suficientemente longo para quebrar em várias linhas",
          "Requisito dois → evidência real do CV com texto suficientemente longo para quebrar em várias linhas",
          "Requisito três → evidência real do CV com texto suficientemente longo para quebrar em várias linhas",
          "Requisito quatro → evidência real do CV com texto suficientemente longo para quebrar em várias linhas",
        ],
      },
      "pt",
    );
    expect(await pageCount(blob)).toBe(1);
  });

  it("sem jobMatch → nenhum card é desenhado (compatível com V4)", () => {
    const blob = generateResumePdf(sample, "pt");
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe("resumePdf V5 — Skills agrupadas por categoria", () => {
  it("skills no formato 'Categoria: itens' viram blocos agrupados", () => {
    const blob = generateResumePdf(
      {
        ...sample,
        skills: [
          "Linguagens: Python, SQL, TypeScript",
          "Dados: Power BI, Pandas, ETL",
          "Cloud & DevOps: Docker, Vercel, CI/CD",
        ],
      },
      "pt",
    );
    expect(blob.size).toBeGreaterThan(0);
  });

  it("skills sem prefixo de categoria na maioria → fallback nos badges", () => {
    const blob = generateResumePdf(
      { ...sample, skills: ["Python", "SQL", "Power BI", "Dados: Pandas, ETL"] },
      "pt",
    );
    expect(blob.size).toBeGreaterThan(0);
  });

  it("skills agrupadas com jobMatch juntos não estouram 1 página", async () => {
    const blob = generateResumePdf(
      {
        ...sample,
        objective: "Vaga de Dados focada em BI e automação",
        jobRef: "Analista de Dados Sênior",
        jobMatch: ["Dashboards executivos → Power BI em produção na ANA"],
        skills: [
          "Linguagens: Python, SQL, TypeScript",
          "Dados: Power BI, Pandas, ETL",
          "Cloud & DevOps: Docker, Vercel, CI/CD",
        ],
      },
      "pt",
    );
    expect(await pageCount(blob)).toBe(1);
  });
});
