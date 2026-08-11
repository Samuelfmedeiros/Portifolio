#!/usr/bin/env python3
"""Validação ATS-sim dos PDFs de CV gerados.

Checa: texto extraível, ordem de seções, keywords obrigatórias, ausência de
lixo (glifos órfãos), typos, e que PT/EN realmente diferem no conteúdo.
"""
import pathlib
import re
import subprocess

REPO = pathlib.Path.home() / "projetos/portifolio"
PUBLIC = REPO / "public"

PT = PUBLIC / "Samuel_Andrade_2026.pdf"
EN = PUBLIC / "Samuel_Andrade_Resume_2026.pdf"

FAILS = []


def check(name, ok, detail=""):
    status = "✅" if ok else "❌"
    print(f"{status} {name}" + (f" — {detail}" if detail else ""))
    if not ok:
        FAILS.append(name)


def text_of(pdf):
    out = subprocess.run(["pdftotext", str(pdf), "-"], capture_output=True, text=True)
    return out.stdout


def main():
    pt = text_of(PT)
    en = text_of(EN)

    # 1. Arquivos distintos
    check("PT e EN são arquivos DIFERENTES", PT.read_bytes() != EN.read_bytes(),
          f"MD5 PT={hashlib_md5(PT)}, EN={hashlib_md5(EN)}")

    # 2. Texto real extraível (não vazio, não é imagem)
    check("PT tem texto extraível", len(pt.strip()) > 400, f"{len(pt.strip())} chars")
    check("EN tem texto extraível", len(en.strip()) > 400, f"{len(en.strip())} chars")

    # 3. Ordem das seções (parse linear)
    def section_order(t, secs):
        idx = [t.find(s) for s in secs]
        return all(i >= 0 for i in idx) and idx == sorted(idx)

    pt_secs = ["Objetivo", "Resumo Profissional", "Experiências Profissionais",
               "Formação Acadêmica", "Competências Técnicas"]
    en_secs = ["Objective", "Professional Summary", "Work Experience",
               "Education", "Technical Skills"]
    check("PT: seções na ordem correta", section_order(pt, pt_secs), str(pt_secs))
    check("EN: seções na ordem correta", section_order(en, en_secs), str(en_secs))

    # 4. Keywords obrigatórias (triagem de IA/ATS)
    pt_kw = ["Power BI", "SQL", "Python", "TensorFlow", "PyTorch", "Hadoop", "Spark",
             "Git", "GitHub", "GitLab", "CI/CD", "Linux", "Microsoft Azure",
             "PostgreSQL", "SQL Server", "Power Query", "DAX", "ETL", "JSON", "XML",
             "Machine Learning", "Ciência de Dados", "IESB"]
    en_kw = ["Power BI", "SQL", "Python", "TensorFlow", "PyTorch", "Hadoop", "Spark",
             "Git", "GitHub", "GitLab", "CI/CD", "Linux", "Microsoft Azure",
             "PostgreSQL", "SQL Server", "Power Query", "DAX", "ETL", "JSON", "XML",
             "Machine Learning", "Data Science", "IESB"]
    missing_pt = [k for k in pt_kw if k not in pt]
    missing_en = [k for k in en_kw if k not in en]
    check("PT: todas as keywords presentes", not missing_pt, f"faltam: {missing_pt}")
    check("EN: todas as keywords presentes", not missing_en, f"faltam: {missing_en}")

    # 5. Lixo: linhas com glifo bullet órfão (sem texto)
    orphan = re.findall(r"^\s*[•●]\s*$", pt, re.M) + re.findall(r"^\s*[•●]\s*$", en, re.M)
    check("Sem glifos bullet órfãos", not orphan, f"{len(orphan)} ocorrências")

    # 6. Bullets inline: "• texto" na mesma linha
    inline_pt = len(re.findall(r"^• [A-Z]", pt, re.M))
    inline_en = len(re.findall(r"^• [A-Z]", en, re.M))
    check("PT: bullets inline (• texto)", inline_pt >= 18, f"{inline_pt} bullets")
    check("EN: bullets inline (• texto)", inline_en >= 18, f"{inline_en} bullets")

    # 7. Typos do original corrigidos
    check("PT: sem typo 'COMPETÊCIAS'", "COMPETÊCIAS" not in pt)
    check("EN: sem typo 'COMPETÊCIAS'", "COMPETÊCIAS" not in en)

    # 8. Idioma correto em cada arquivo (amostra)
    check("PT: conteúdo em português", "Experiências Profissionais" in pt and "Work Experience" not in pt)
    check("EN: conteúdo em inglês", "Work Experience" in en and "Experiências Profissionais" not in en)

    # 9. Contato completo em ambos
    for name, t in (("PT", pt), ("EN", en)):
        ok = ("samuelandrademedeiros@gmail.com" in t and "linkedin.com/in/samuelandrademedeiros" in t
              and "99119-1722" in t and "Samuel Andrade Fonseca de Medeiros" in t)
        check(f"{name}: contato completo (nome/email/linkedin/telefone)", ok)

    # 10. 1 página
    for name, p in (("PT", PT), ("EN", EN)):
        info = subprocess.run(["pdfinfo", str(p)], capture_output=True, text=True).stdout
        pages = re.search(r"Pages:\s+(\d+)", info)
        check(f"{name}: 1 página", pages and pages.group(1) == "1",
              info.splitlines()[0] if info else "")

    print()
    if FAILS:
        print(f"❌ {len(FAILS)} falha(s): {FAILS}")
        raise SystemExit(1)
    print("✅ VALIDAÇÃO ATS COMPLETA — 0 falhas")


def hashlib_md5(p):
    import hashlib
    return hashlib.md5(p.read_bytes()).hexdigest()[:8]


if __name__ == "__main__":
    main()
