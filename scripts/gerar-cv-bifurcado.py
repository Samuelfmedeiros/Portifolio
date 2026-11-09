#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""gerar-cv-bifurcado.py — gera os 4 PDFs do curriculo (2 versoes x PT/EN).

Por que existe (pedido do Samuel, 08/11/2026 — diagnostico do AI Studio):
    O curriculo unico ("Analista de Dados & Desenvolvedor Full Stack") faz o
    recrutador descartar em 6 segundos porque nao sabe para qual vaga o candidato
    esta se aplicando. A cura e' BIFURCAR: uma versao 100% Dados/BI e uma 100%
    Full Stack, cada uma com vocabulario alinhado ao ATS da vaga alvo.

Saida (em public/):
    Samuel_Andrade_2026.pdf            -> Dados & BI (PT)
    Samuel_Andrade_Resume_2026.pdf     -> Dados & BI (EN)
    Samuel_Andrade_Dados_2026.pdf      -> Dados & BI (PT, nome explicito)
    Samuel_Andrade_Resume_Dados_2026.pdf
    Samuel_Andrade_FullStack_2026.pdf
    Samuel_Andrade_Resume_FullStack_2026.pdf

Uso: python3 scripts/gerar-cv-bifurcado.py
"""
import os
import subprocess  # nosec B404 — so usa caminho absoluto fixo, sem shell e sem input do usuario
import sys
import textwrap

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(REPO, "public")
BUILD = os.path.join(REPO, "scripts", "_cv_build")
WEASY = "/home/samuel/.local/bin/weasyprint"

CSS = """
@page { size: A4; margin: 11mm 13mm; }
* { box-sizing: border-box; }
body { font-family: "DejaVu Sans", Arial, sans-serif; font-size: 8.9pt;
       line-height: 1.34; color: #1a1a1a; margin: 0; }
h1 { font-size: 17pt; margin: 0 0 2px; letter-spacing: -0.4px; color: #0d1117; }
.role { font-size: 9.8pt; font-weight: 700; color: #0b6b5e; margin-bottom: 4px; }
.contact { font-size: 8.2pt; color: #444; margin-bottom: 2px; }
.links { font-size: 8pt; color: #0b6b5e; margin-bottom: 8px; }
.rule { border-bottom: 2px solid #0b6b5e; margin: 7px 0 9px; }
h2 { font-size: 8.9pt; text-transform: uppercase; letter-spacing: 1.1px;
     color: #0b6b5e; margin: 10px 0 4px; padding-bottom: 1px;
     border-bottom: 1px solid #d5d5d5; }
.job { margin-bottom: 7px; }
.jobhead { display: flex; justify-content: space-between; align-items: baseline; }
.empresa { font-weight: 700; font-size: 9.2pt; color: #0d1117; }
.cargo { font-size: 8.7pt; color: #333; font-style: italic; }
.periodo { font-size: 8.1pt; color: #666; white-space: nowrap; padding-left: 10px; }
ul { margin: 2px 0 0 0; padding-left: 14px; }
li { margin-bottom: 2px; text-align: justify; }
.resumo { text-align: justify; margin: 0 0 3px; }
.skills { font-size: 8.7pt; }
.skills b { color: #0d1117; }
.formacao { font-size: 8.8pt; }
.formacao li { margin-bottom: 1px; }
.tag { display: inline-block; background: #eef7f5; color: #0b6b5e;
       border: 1px solid #b8ddd6; border-radius: 3px; padding: 1px 6px;
       font-size: 8.2pt; margin: 0 3px 3px 0; }
"""


def h(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def doc(nome, role, contato, links, resumo, jobs, formacao, skills, labels):
    parts = [
        f"<h1>{h(nome)}</h1>",
        f'<div class="role">{h(role)}</div>',
        f'<div class="contact">{h(contato)}</div>',
        f'<div class="links">{h(links)}</div>',
        f"<h2>{labels['resumo']}</h2>",
        f'<p class="resumo">{h(resumo)}</p>',
        f"<h2>{labels['exp']}</h2>",
    ]
    for empresa, cargo, periodo, bullets in jobs:
        parts.append('<div class="job">')
        parts.append(
            f'<div class="jobhead"><span class="empresa">{h(empresa)}</span>'
            f'<span class="periodo">{h(periodo)}</span></div>'
        )
        if cargo:
            parts.append(f'<div class="cargo">{h(cargo)}</div>')
        parts.append("<ul>")
        for b in bullets:
            parts.append(f"<li>{h(b)}</li>")
        parts.append("</ul></div>")

    parts.append(f"<h2>{labels['form']}</h2><ul class='formacao'>")
    for f in formacao:
        parts.append(f"<li>{h(f)}</li>")
    parts.append("</ul>")

    parts.append(f"<h2>{labels['skills']}</h2><div class='skills'>")
    for grupo, itens in skills:
        parts.append(f"<p style='margin:0 0 3px'><b>{h(grupo)}:</b> {h(', '.join(itens))}</p>")
    parts.append("</div>")
    return f"<!DOCTYPE html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{''.join(parts)}</body></html>"


NOME = "Samuel Andrade Fonseca de Medeiros"
CONTATO_PT = "Brasília-DF · (61) 99119-1722 · samuelandrademedeiros@gmail.com"
CONTATO_EN = "Brasília, Brazil · +55 61 99119-1722 · samuelandrademedeiros@gmail.com"
LINKS = "linkedin.com/in/samuelandrademedeiros · github.com/Samuelfmedeiros · samuelmedeiros.vercel.app"
LINKS_EN = "linkedin.com/in/samuelandrademedeiros · github.com/Samuelfmedeiros · samuelmedeiros.vercel.app/en"

LABELS_PT = {"resumo": "Resumo Profissional", "exp": "Experiência Profissional",
             "form": "Formação Acadêmica", "skills": "Competências Técnicas"}
LABELS_EN = {"resumo": "Professional Summary", "exp": "Professional Experience",
             "form": "Education", "skills": "Technical Skills"}

# ----------------------------- DADOS & BI -----------------------------
DADOS_PT = doc(
    NOME,
    "Analista de Dados & Business Intelligence | Power BI, SQL, Python ETL & Analytics",
    CONTATO_PT, LINKS,
    "Analista de Dados com histórico comprovado na criação de dashboards estratégicos em "
    "Power BI, pipelines automatizados de ETL com Python e consultas otimizadas em PostgreSQL "
    "e SQL Server. Experiência na Agência Nacional de Águas (ANA) desenvolvendo indicadores "
    "executivos para sistemas hídricos complexos e automatizando rotinas que reduziram o tempo "
    "de consolidação de relatórios. Pós-graduando em Ciência de Dados e Big Data Analytics "
    "(IESB). Focado em transformar dados brutos em decisão de negócio e métricas acionáveis.",
    [
        ("Agência Nacional de Águas e Saneamento Básico (ANA)", "Analista de Dados", "2025", [
            "Desenvolveu 6 dashboards estratégicos no Power BI com DAX avançado e modelagem "
            "dimensional (star schema), monitorando indicadores críticos de bacias e "
            "reservatórios para equipes gestoras e tomadores de decisão.",
            "Automatizou pipelines de extração, tratamento e carga (ETL) em Python "
            "(pandas/requests) e SQL, reduzindo em cerca de 70% o tempo operacional de "
            "consolidação semanal dos dados hídricos.",
            "Otimizou consultas e views em bancos relacionais (PostgreSQL e SQL Server), "
            "diminuindo o tempo de resposta de relatórios de minutos para segundos.",
            "Traduziu requisitos de analistas ambientais e gestores públicos em indicadores "
            "de performance (KPIs) para as áreas finalísticas da agência.",
        ]),
        ("Projetos e Consultoria em Dados & Analytics", "Analista de Dados & BI (autônomo)", "2024 – Atual", [
            "Construiu pipelines de extração e web scraping em Python integrados a bancos "
            "relacionais, higienizando mais de 50.000 registros para análise comparativa.",
            "Implementou camada de busca semântica e análise automatizada de documentos com "
            "Python e vetores semânticos (RAG), encurtando consultas em bases textuais não "
            "estruturadas.",
            "Desenvolveu relatórios analíticos conectando fontes heterogêneas (APIs REST, "
            "Excel, JSON e bancos SQL) com atualização automática por pipelines agendados.",
        ]),
        ("Global Hitss", "Analista de Operações de TI & Monitoramento (N1)", "2024 – 2025", [
            "Monitorou indicadores de saúde de infraestrutura, bancos e servidores em nuvem "
            "(Microsoft Azure), antecipando indisponibilidades de serviços corporativos.",
            "Documentou e geriu incidentes seguindo práticas ITIL, mantendo resolução em "
            "conformidade com SLA acima de 95% para mais de 500 usuários corporativos.",
            "Produziu relatórios de volumetria de chamados e tendências de reincidência "
            "para a liderança técnica.",
        ]),
    ],
    [
        "Pós-graduação em Ciência de Dados e Big Data Analytics — Centro Universitário IESB (em andamento)",
        "Graduação em Análise e Desenvolvimento de Sistemas — Centro Universitário IESB",
    ],
    [
        ("Business Intelligence", ["Power BI", "DAX avançado", "Power Query (M)",
                                   "Modelagem dimensional (star schema)", "Dashboards executivos", "KPIs de negócio"]),
        ("Bancos e Manipulação de Dados", ["SQL avançado", "PostgreSQL", "SQL Server", "SQLite",
                                           "Views e queries otimizadas", "Modelagem relacional"]),
        ("Engenharia de Dados", ["Python (pandas, numpy, requests)", "Pipelines de ETL",
                                 "Web scraping", "Integração de APIs REST", "Automação de rotinas"]),
        ("Ambiente", ["Git/GitHub", "Docker", "Linux", "Excel avançado", "Metodologias ágeis"]),
    ],
    LABELS_PT,
)

DADOS_EN = doc(
    NOME,
    "Data Analyst & Business Intelligence | Power BI, SQL, Python ETL & Analytics",
    CONTATO_EN, LINKS_EN,
    "Data Analyst with a proven record of building strategic Power BI dashboards, automated "
    "ETL pipelines in Python, and tuned queries across PostgreSQL and SQL Server. Worked at "
    "the Brazilian National Water Agency (ANA) delivering executive indicators for complex "
    "water systems and automating routines that cut report consolidation time. Graduate "
    "student in Data Science and Big Data Analytics (IESB). Focused on turning raw data into "
    "business decisions and actionable metrics.",
    [
        ("Brazilian National Water Agency (ANA)", "Data Analyst", "2025", [
            "Built 6 strategic Power BI dashboards with advanced DAX and dimensional modeling "
            "(star schema) covering critical basin and reservoir indicators for management "
            "teams and decision makers.",
            "Automated extraction, transformation and load (ETL) pipelines in Python "
            "(pandas/requests) and SQL, cutting weekly water-data consolidation effort by "
            "roughly 70%.",
            "Optimized queries and views across relational databases (PostgreSQL and SQL "
            "Server), bringing report response times from minutes down to seconds.",
            "Translated requirements from environmental analysts and public managers into "
            "performance indicators (KPIs) for the agency's operational teams.",
        ]),
        ("Data & Analytics Projects and Consulting", "Data & BI Analyst (freelance)", "2024 – Present", [
            "Built extraction and web scraping pipelines in Python wired into relational "
            "databases, cleaning more than 50,000 records for comparative analysis.",
            "Implemented a semantic search and document analysis layer in Python with "
            "embeddings (RAG), shortening queries over unstructured text bases.",
            "Delivered analytical reports joining heterogeneous sources (REST APIs, Excel, "
            "JSON and SQL databases) with automatic refresh through scheduled pipelines.",
        ]),
        ("Global Hitss", "IT Operations & Monitoring Analyst (L1)", "2024 – 2025", [
            "Monitored infrastructure, database and cloud server health (Microsoft Azure), "
            "catching anomalies before corporate service outages.",
            "Documented and managed incidents following ITIL practices, holding SLA "
            "compliance above 95% for more than 500 corporate users.",
            "Produced ticket volume and recurring-issue trend reports for technical leadership.",
        ]),
    ],
    [
        "M.S. in Data Science and Big Data Analytics — IESB University Center (in progress)",
        "B.S. in Systems Analysis and Development — IESB University Center",
    ],
    [
        ("Business Intelligence", ["Power BI", "Advanced DAX", "Power Query (M)",
                                   "Dimensional modeling (star schema)", "Executive dashboards", "Business KPIs"]),
        ("Databases & Data Handling", ["Advanced SQL", "PostgreSQL", "SQL Server", "SQLite",
                                       "Optimized views and queries", "Relational modeling"]),
        ("Data Engineering", ["Python (pandas, numpy, requests)", "ETL pipelines",
                              "Web scraping", "REST API integration", "Routine automation"]),
        ("Environment", ["Git/GitHub", "Docker", "Linux", "Advanced Excel", "Agile methods"]),
    ],
    LABELS_EN,
)

# ----------------------------- FULL STACK -----------------------------
FULL_PT = doc(
    NOME,
    "Desenvolvedor Full Stack | React, Next.js, TypeScript, Python FastAPI & Cloud",
    CONTATO_PT, LINKS,
    "Desenvolvedor de Software com experiência na construção de aplicações web de ponta a "
    "ponta, APIs RESTful em Python (FastAPI) e Node.js, e interfaces responsivas com React, "
    "Next.js e TypeScript. Cinco produtos em produção, incluindo marketplace com pagamentos "
    "multi-conta via Stripe Connect, autenticação segura (JWT/2FA) e mais de 2.000 testes "
    "automatizados com Playwright, Vitest e pytest. Vivência com Docker, Cloudflare e "
    "pipelines de CI/CD.",
    [
        ("PataPass & Ecossistema de Produtos Web (seu.pet)", "Engenheiro Full Stack & Fundador técnico", "2024 – Atual", [
            "Arquitetou e colocou em produção o marketplace PataPass (seu.pet), conectando "
            "tutores a passeadores com geolocalização via OpenStreetMap e streaming de rotas "
            "em tempo real.",
            "Desenvolveu o backend FastAPI com WebSockets para rastreamento de passeios, com "
            "mais de 310.000 segundos de uptime sem incidentes.",
            "Implementou gateway de pagamentos com split de recebíveis via Stripe Connect e "
            "Mercado Pago, com conciliação por webhooks assíncronos.",
            "Construiu o Arachne (arachne.seu.pet), plataforma de extração com busca semântica "
            "(RAG) e servidor MCP com 9 ferramentas de busca, extração e transcrição.",
            "Configurou infraestrutura Cloudflare com Zero Trust (mTLS/Access) protegendo o "
            "painel administrativo, cache de borda, Turnstile e CI/CD via GitHub Actions.",
            "Estruturou suítes de testes unitários e E2E com Playwright, Vitest e pytest, "
            "acumulando mais de 2.000 testes sobre autenticação, pagamento e GPS.",
        ]),
        ("Agência Nacional de Águas e Saneamento Básico (ANA)", "Desenvolvedor de Automação & Dados", "2025", [
            "Construiu rotinas em Python para consumo de APIs governamentais e transformação "
            "assíncrona de grandes bases de dados hídricos.",
            "Modelou e otimizou esquemas PostgreSQL com índices e queries afinadas para alta "
            "volumetria.",
            "Desenvolveu ferramentas de script para automação de tratamento de arquivos "
            "JSON e XML.",
        ]),
        ("Global Hitss", "Técnico de Suporte a Sistemas e Redes", "2024 – 2025", [
            "Sustentou ambientes corporativos, geriu acessos em Microsoft Azure / Active "
            "Directory e resolveu incidentes técnicos sob SLA.",
            "Escreveu scripts utilitários que aceleraram o diagnóstico de falhas recorrentes "
            "de conectividade.",
        ]),
    ],
    [
        "Graduação em Análise e Desenvolvimento de Sistemas — Centro Universitário IESB",
        "Pós-graduação em Ciência de Dados e Big Data Analytics — Centro Universitário IESB (em andamento)",
    ],
    [
        ("Frontend", ["React", "Next.js (App Router)", "TypeScript", "JavaScript (ES6+)",
                      "Tailwind CSS", "HTML5/CSS3"]),
        ("Backend & APIs", ["Python (FastAPI)", "Node.js", "APIs RESTful",
                            "PostgreSQL", "Autenticação JWT/2FA", "Stripe Connect"]),
        ("Qualidade & DevOps", ["Playwright (E2E)", "Vitest", "pytest", "Docker",
                                "CI/CD (GitHub Actions)", "Cloudflare (Pages, Tunnel, R2, D1)"]),
        ("Ambiente", ["Linux", "Git", "WebSockets", "Observabilidade"]),
    ],
    LABELS_PT,
)

FULL_EN = doc(
    NOME,
    "Full Stack Developer | React, Next.js, TypeScript, Python FastAPI & Cloud",
    CONTATO_EN, LINKS_EN,
    "Software Developer experienced in building end-to-end web applications, RESTful APIs in "
    "Python (FastAPI) and Node.js, and responsive interfaces with React, Next.js and "
    "TypeScript. Five products in production, including a marketplace with multi-account "
    "payments through Stripe Connect, secure authentication (JWT/2FA) and more than 2,000 "
    "automated tests with Playwright, Vitest and pytest. Hands-on with Docker, Cloudflare and "
    "CI/CD pipelines.",
    [
        ("PataPass & Web Product Ecosystem (seu.pet)", "Full Stack Engineer & Technical Founder", "2024 – Present", [
            "Architected and shipped the PataPass marketplace (seu.pet), connecting pet owners "
            "to walkers with geolocation via OpenStreetMap and real-time route streaming.",
            "Built the FastAPI backend with WebSockets for walk tracking, sustaining more than "
            "310,000 seconds of uptime without incidents.",
            "Implemented a payment gateway with receivable splits through Stripe Connect and "
            "Mercado Pago, reconciled by asynchronous webhooks.",
            "Built Arachne (arachne.seu.pet), an extraction platform with semantic search (RAG) "
            "and an MCP server exposing 9 search, scrape and transcription tools.",
            "Configured Cloudflare infrastructure with Zero Trust (mTLS/Access) protecting the "
            "admin panel, edge caching, Turnstile and CI/CD through GitHub Actions.",
            "Structured unit and E2E suites with Playwright, Vitest and pytest, accumulating "
            "more than 2,000 tests over authentication, payments and GPS.",
        ]),
        ("Brazilian National Water Agency (ANA)", "Automation & Data Developer", "2025", [
            "Built Python routines to consume government APIs and asynchronously transform "
            "large water datasets.",
            "Modeled and tuned PostgreSQL schemas with indexes and queries for high volume.",
            "Wrote scripting tools to automate JSON and XML file processing.",
        ]),
        ("Global Hitss", "Systems & Network Support Technician", "2024 – 2025", [
            "Sustained corporate environments, managed Microsoft Azure / Active Directory "
            "access and resolved technical incidents under SLA.",
            "Wrote utility scripts that sped up diagnosis of recurring connectivity failures.",
        ]),
    ],
    [
        "B.S. in Systems Analysis and Development — IESB University Center",
        "M.S. in Data Science and Big Data Analytics — IESB University Center (in progress)",
    ],
    [
        ("Frontend", ["React", "Next.js (App Router)", "TypeScript", "JavaScript (ES6+)",
                      "Tailwind CSS", "HTML5/CSS3"]),
        ("Backend & APIs", ["Python (FastAPI)", "Node.js", "RESTful APIs",
                            "PostgreSQL", "JWT/2FA authentication", "Stripe Connect"]),
        ("Quality & DevOps", ["Playwright (E2E)", "Vitest", "pytest", "Docker",
                              "CI/CD (GitHub Actions)", "Cloudflare (Pages, Tunnel, R2, D1)"]),
        ("Environment", ["Linux", "Git", "WebSockets", "Observability"]),
    ],
    LABELS_EN,
)

TARGETS = [
    ("Samuel_Andrade_Dados_2026.pdf", DADOS_PT),
    ("Samuel_Andrade_Resume_Dados_2026.pdf", DADOS_EN),
    ("Samuel_Andrade_FullStack_2026.pdf", FULL_PT),
    ("Samuel_Andrade_Resume_FullStack_2026.pdf", FULL_EN),
]


def main():
    os.makedirs(BUILD, exist_ok=True)
    ok = 0
    for nome, html in TARGETS:
        src = os.path.join(BUILD, nome.replace(".pdf", ".html"))
        dst = os.path.join(PUBLIC, nome)
        with open(src, "w", encoding="utf-8") as f:
            f.write(html)
        # nosec B603 — subprocess com lista fixa (sem shell, sem input externo):
        # o binario e' constante e o caminho vem de os.path, nunca de argv.
        r = subprocess.run([WEASY, src, dst], capture_output=True, text=True, shell=False)  # nosec B603
        if r.returncode != 0:
            print(f"FALHOU {nome}: {(r.stderr or '')[-300:]}")
            continue
        kb = os.path.getsize(dst) / 1024
        print(f"OK {nome:46} {kb:6.1f} KB")
        ok += 1
    print(f"\n{ok}/{len(TARGETS)} PDFs gerados em {PUBLIC}")
    return 0 if ok == len(TARGETS) else 1


if __name__ == "__main__":
    sys.exit(main())
