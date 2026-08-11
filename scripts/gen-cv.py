#!/usr/bin/env python3
"""Gera PDFs ATS-friendly do CV (PT/EN) a partir dos markdown em docs/cv/.

Fluxo: markdown -> HTML com CSS inline -> soffice headless -> PDF em public/.
Regras ATS: texto real extraível, 1 coluna, sem tabelas, bullets INLINE ("• texto"
na mesma linha — glifo separado quebra parse), Calibri/Arial.
Uso: python3 scripts/gen-cv.py
"""
import pathlib
import subprocess

REPO = pathlib.Path.home() / "projetos/portifolio"
SRC = REPO / "docs" / "cv"
OUT = REPO / "public"

CSS = """\
@page { size: A4; margin: 0.9cm; }
body { font-family: Calibri, Arial, sans-serif; font-size: 9.8pt; color: #1a1a1a; margin: 0; }
h1, h2, h3, p, li, div, blockquote { font-family: Calibri, Arial, sans-serif !important; }
h1 { font-size: 14pt; margin: 0 0 2pt 0; }
p.role { font-size: 10.5pt; color: #333; margin: 0 0 4pt 0; }
p.contact { font-size: 9pt; margin: 0 0 4pt 0; }
h2 { font-size: 10.5pt; border-bottom: 1pt solid #2b2b2b; padding-bottom: 1pt; margin: 5pt 0 2.5pt 0; }
h3 { font-size: 9.8pt; margin: 3pt 0 1pt 0; }
p { margin: 1.5pt 0; }
p.bullet { margin: 0.5pt 0; }
a { color: #1a1a1a; text-decoration: none; }
"""


def md_to_html_fragment(md_text: str) -> str:
    """Parser markdown-lite com controle total (sem pandoc).

    Garante que bullets viram parágrafos com "• " inline (texto extraível na
    mesma linha), evitando o glifo separado que o LibreOffice gera em <ul>.
    """
    html = []
    for raw in md_text.splitlines():
        line = raw.rstrip()
        if not line.strip():
            continue
        if line.startswith("# "):
            html.append(f"<h1>{line[2:].strip()}</h1>")
        elif line.startswith("## "):
            html.append(f"<h2>{line[3:].strip()}</h2>")
        elif line.startswith("### "):
            html.append(f"<h3>{line[4:].strip()}</h3>")
        elif line.startswith("> "):
            html.append(f'<p class="role">{line[2:].strip()}</p>')
        elif line.startswith("- "):
            html.append(f'<p class="bullet">• {line[2:].strip()}</p>')
        else:
            html.append(f"<p>{line.strip()}</p>")
    return "\n".join(html)


def gen(lang: str, filename: str) -> pathlib.Path:
    md_path = SRC / f"{lang}.md"
    if not md_path.exists():
        raise SystemExit(f"Faltando {md_path}")
    body = md_to_html_fragment(md_path.read_text(encoding="utf-8"))
    doc = (
        "<!DOCTYPE html><html><head><meta charset='utf-8'>"
        f"<style>{CSS}</style></head><body>{body}</body></html>"
    )
    html_path = SRC / f"{lang}.html"
    html_path.write_text(doc, encoding="utf-8")
    subprocess.run(
        ["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(SRC), str(html_path)],
        check=True, capture_output=True, timeout=120,
    )
    pdf = SRC / f"{lang}.pdf"
    dest = OUT / filename
    pdf.replace(dest)
    print(f"OK {lang} -> {dest} ({dest.stat().st_size} bytes)")
    return dest


if __name__ == "__main__":
    gen("pt", "Samuel_Andrade_2026.pdf")
    gen("en", "Samuel_Andrade_Resume_2026.pdf")
    print("DONE")
