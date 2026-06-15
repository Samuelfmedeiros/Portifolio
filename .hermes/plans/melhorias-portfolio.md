# Portifolio Samuel — Melhorias

## Prioridade (execução imediata)

### 1. ✅ Splash removido
- `src/components/_old/` deletado
- Nenhuma referência restante

### 2. 🔧 Jornada (Timeline)
**Problema:** React warnings `whileInView`/`whileHover` em elementos não-motion
**O que fazer:** Verificar se todos os elementos com props de animação são `<motion.div>`/`<motion.a>`

### 3. 🔧 Cards de Projetos (ProjectHangar)
**Problemas visuais:**
- Gradientes genéricos, sem personalidade
- Cards sem destaque visual no hover
- Header dos cards (120px) com fallback fraco (só nome)
- Affiliates "powered by" poluindo o card

### 4. 🔧 Parallax Claro/Escuro
**Problema:** Light mode = canvas vazio (só `clearRect`)
**O que fazer:**
- Estrelas visíveis no light mode (mais sutis)
- Nebulosas translúcidas no light mode
- Grid de profundidade (L0) adaptado pros 2 temas
- Transição suave entre temas

---

## Ordem de Execução

```
Fase 1 — Base
  [ ] Arrumar jornada (warnings)
  [ ] Melhorar cards projetos (visual)
  [ ] Deploy no staging (capivara.seu.pet)

Fase 2 — Parallax
  [ ] Estrelas visíveis no light mode
  [ ] Nebulosas sutis pro light mode
  [ ] Grid adaptável
  [ ] Transição suave dark ↔ light

Fase 3 — Teste e Deploy
  [ ] Testar no staging
  [ ] Ajustar conforme feedback
  [ ] Deploy produção (:3001)
```
