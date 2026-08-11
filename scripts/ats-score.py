#!/usr/bin/env python3
"""Simulador heurístico de nota ATS (0-100) para os PDFs do CV.

Pesos baseados nas guidelines Indeed (16/06/2026), Zety e MIT CAPD:
- Estrutura 1 coluna (sem tabelas/colunas detectáveis)      20 pts
- Texto real extraível                                       10 pts
- Ordem de seções padrão (parse linear)                      15 pts
- Keywords técnicas presentes                                 25 pts
- Contato completo no topo                                   10 pts
- 1 página                                                    10 pts
- Sem glifos órfãos / lixo de parse                            5 pts
- Fonte padrão ATS (Calibri/Arial/Times)                      5 pts
Meta (Zety): >= 80.
Uso: python3 scripts/ats-score.py
"""
import pathlib
import re
import subprocess

REPO = pathlib.Path.home() / "projetos/portifolio"
OUT = REPO / "public"
PDFS = [OUT / "Samuel_Andrade_2026.pdf", OUT / "Samuel_Andrade_Resume_2026.pdf"]

TECH_KW = [
    "Power BI", "SQL", "Python", "React", "Next.js", "TypeScript", "FastAPI",
    "TensorFlow", "PyTorch", "Hadoop", "Spark", "Docker", "Kubernetes",
    "Git", "GitHub", "GitLab", "CI/CD", "Linux", "PostgreSQL", "SQL Server",
    "Power Query", "DAX", "ETL", "JSON", "XML", "Machine Learning", "Data Science",
    "LLM", "RAG", "MCP", "Playwright", "Stripe", "Node.js", "Cloudflare",
    "Microsoft Azure", "Excel", "Pandas", "Web Scraping", "Automação", "Automation",
    "Dashboards", "REST", "API",
]


def text_of(pdf):
    return subprocess.run(["pdftotext", str(pdf), "-"], capture_output=True, text=True).stdout


def has_columns(t):
    """Detecta layout em colunas: linhas com 2+ blocos de texto distantes no eixo X."""
    layout = subprocess.run(["pdftotext", "-layout", str(0)], capture_output=True, text=True).stdout if False else ""
    # fallback simples: procurar padrão de 2 colunas no texto plano é difícil;
    # aqui checamos se há muita repetição de cabeçalho no mesmo y via -layout.
    return False


def main():
    scores = []
    for pdf in PDFS:
        t = text_of(pdf)
        total = 0.0

        # 1. Estrutura 1 coluna — heurística: sem tabelas/text boxes detectáveis
        #    (PDFs gerados via HTML simples; checamos ausência de xrefs de tabela)
        layout = subprocess.run(["pdftotext", "-layout", str(pdf), "-"],
                                capture_output=True, text=True).stdout
        # linhas com 2+ blocos separados por >10 espaços = suspeita de coluna
        col_suspects = [ln for ln in layout.splitlines() if re.search(r"\S {10,}\S", ln)]
        col_score = 20 if not col_suspects else max(0, 20 - len(col_suspects) * 4)
        total += col_score

        # 2. Texto extraível
        total += 10 if len(t.strip()) > 400 else 0

        # 3. Ordem de seções
        pt = "Objetivo" in t and "Experiências Profissionais" in t and "Formação Acadêmica" in t and "Competências Técnicas" in t
        en = "Objective" in t and "Work Experience" in t and "Education" in t and "Technical Skills" in t
        total += 15 if (pt or en) else 0

        # 4. Keywords técnicas
        found = sum(1 for k in TECH_KW if k.lower() in t.lower())
        total += 25 * (found / len(TECH_KW))

        # 5. Contato completo
        contact = all(s in t for s in ["samuelandrademedeiros@gmail.com", "linkedin.com/in/", "99119-1722"])
        total += 10 if contact else 0

        # 6. 1 página
        info = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout
        pages = re.search(r"Pages:\s+(\d+)", info)
        total += 10 if (pages and pages.group(1) == "1") else 0

        # 7. Glifos órfãos
        orphan = len(re.findall(r"^\s*[•●]\s*$", t, re.M))
        total += 5 if orphan == 0 else max(0, 5 - orphan)

        # 8. Fonte padrão
        fonts = subprocess.run(["pdffonts", str(pdf)], capture_output=True, text=True).stdout
        ok_fonts = ("Calibri" in fonts or "Arial" in fonts or "Times" in fonts
                    or "LiberationSans" in fonts)
        total += 5 if ok_fonts else 0

        layout2 = subprocess.run(["pdftotext", "-layout", str(pdf), "-"],
                                 capture_output=True, text=True).stdout
        col_suspects2 = [ln for ln in layout2.splitlines() if re.search(r"\S {10,}\S", ln)]
        one_page = bool(pages and pages.group(1) == "1")
        scores.append(total)
        print(f"{pdf.name}: nota {total:.1f}/100 | colunas suspeitas={len(col_suspects2)} | keywords {found}/{len(TECH_KW)} | 1 pagina={one_page}")

    avg = sum(scores) / len(scores)
    print(f"\nMÉDIA: {avg:.1f}/100 | META (Zety): >= 80")
    print("✅ APROVADO" if avg >= 80 else "⚠️ ABAIXO DA META")
    return 0 if avg >= 80 else 1


if __name__ == "__main__":
    raise SystemExit(main())
