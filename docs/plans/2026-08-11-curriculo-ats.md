# Plano — Currículo ATS-friendly em produção (2026-08-11)

**Projeto:** Portifolio (v2 Next.js) — `~/projetos/portifolio`
**Status:** Aprovado via "Continue" (12:07) | Executando Fases 1–3 agora; Fase 4 (push+deploy) aguarda vídeo demo + aprovação

## Problema
Currículo falha em sistemas ATS / triagem de IA. Diagnóstico (11/08):
1. 🔴 `Samuel_Andrade_Resume_2026.pdf` (EN) = cópia byte-a-byte do PT (mesmo MD5) — quebra regra locale→idioma
2. ✅ Texto real extraível (Calibri embarcado, não imagem), 1 página A4
3. ⚠️ Typo "COMPETÊCIAS" (sem N) — keyword match erra
4. ⚠️ COMPETÊNCIAS em 2 colunas — parser de coluna única embaralha ordem
5. ⚠️ Bullets órfãos na Formação + glifos OpenSymbol
6. ⚠️ Bullets sem métricas/resultados — triagem de IA pontua pior
7. ⚠️ Sem seção de idiomas

## Fases
- **Fase 1 — Fontes de verdade:** `docs/cv/pt.md` + `docs/cv/en.md` versionados (corrige typo, bullets, 1 coluna, idiomas, EN real)
- **Fase 2 — PDFs:** gerar via LibreOffice CLI (produtor atual = Writer 26.2.4.2), 1 página A4, Calibri, sem colunas/tabelas
- **Fase 3 — Validação:** script ATS parse (pdftotext → ordem seções, zero lixo, skills-chave) + build + vitest + E2E download por locale
- **Fase 4 — Deploy:** commit+push → CI → **vídeo demo lento** → aprovação → `vercel --prod`

## Critérios de sucesso
- [ ] MD5 dos 2 PDFs DIFERENTES (EN ≠ PT)
- [ ] PT: texto 100% em português | EN: texto 100% em inglês
- [ ] 1 página A4 cada, texto extraível (pdftotext sem lixo)
- [ ] Seções na ordem esperada: Objetivo → Resumo → Experiências → Formação → Competências → Idiomas
- [ ] Typo corrigido (COMPETÊNCIAS), sem bullets órfãos
- [ ] Skills-chave presentes: Python, SQL, Power BI, DAX, ETL, PostgreSQL, Git, CI/CD, Machine Learning
- [ ] Build + vitest verdes
- [ ] E2E: download em locale EN baixa arquivo EN, locale PT baixa arquivo PT

## Segurança
- PDF sem macros/JS, metadados limpos, sem RG/CPF, <100KB
- Nomes de arquivo mantidos (`Samuel_Andrade_2026.pdf`, `Samuel_Andrade_Resume_2026.pdf`) — zero mudança em código de download

## Notas
- Push na master dispara deploy automático (deploy.yml) → push SÓ após aprovação com vídeo demo
- Nível de inglês: colocado "Intermediário" — Samuel confirma antes do deploy
- Métricas: bullets com impacto sem números inventados (não fabricar dados)
