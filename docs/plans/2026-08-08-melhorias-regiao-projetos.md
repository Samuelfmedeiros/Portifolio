# Plano: Melhorias Região Projetos — 2026-08-08

## Status
Aguardando aprovação final (Samuel decidiu escopo via clarify)

## Decisões de Samuel
- Manter apenas os 4 projetos atuais (DogWalk, Arachne, Portifolio, lifelog) — sem Capivara/TatuEngine/LEVE LAVANDA
- Modal enriquecido: APROVADO
- Badge DESTAQUE: sem decisão → manter comportamento atual (todos DESTAQUE)
- Filtro por tag: core incluso

## Escopo
1. Ativar filtro por tag (Todos/Web/IA/Dados/DevOps) em ProjectHangar — renderizar barra, usar filteredRepos, disparar analytics project_filter
2. Enriquecer ProjectModal: imagem do projeto, links GitHub/Site, stats (stars/forks)
3. i18n lifelog PT/EN em profileData.ts (PROJECTS_PT/EN)
4. Consistência de links: remover hardcode do Portifolio (usar homepage quando tem demo)
5. NÃO adicionar projetos novos, NÃO gerar capas novas

## Diagnóstico (achados)
- Filtro morto: activeFilter/allTags/filteredRepos calculados mas grid usa repos.map (ProjectHangar.tsx:290-300)
- i18n keys de filtro existem (dictionary.ts:91-96) + evento project_filter (useAnalytics.ts:50) — órfãos
- Badge DESTAQUE em todos os cards (FEATURED_PROJECTS contém os 4 + 5 jogos)
- PROJECTS_PT/EN só cobre DogWalk, Arachne, Portifolio — lifelog sem i18n
- Link Portifolio hardcoded: html_url em vez de homepage

## Arquivos
- src/components/ProjectHangar.tsx
- src/components/ProjectModal.tsx
- src/lib/profileData.ts
- src/lib/dictionary.ts (se necessário)
- Testes: ProjectHangar.test.tsx (existe), ProjectModal.test.tsx (criar)

## Critério de sucesso
- Filtro funcional com analytics project_filter disparando
- Modal com imagem + links + stats
- EN/PT corretos pro lifelog
- Build limpo + testes passando + deploy CI
