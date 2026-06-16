# Portifolio Samuel — Plano de Melhorias (Fase 2)

## Prioridade

### 1. Velocidade e Responsividade Mobile
**O que fazer:**
- [ ] Parallax canvas desligado/leve em mobile (< 768px)
- [ ] `loading="lazy"` nas imagens dos project cards
- [ ] `touch-action: manipulation` nos botões (remove delay 300ms)
- [ ] Reduzir Framer Motion transforms em mobile

### 2. Parallax — Cockpit Wake (Entrada refinada)
**O que fazer:**
- [ ] Background layers com `initial={{ opacity: 0 }}` + `animate` sequencial (0.4s cada)
- [ ] Hero stagger mantido, mas parallax "acorda" primeiro
- [ ] Transição mais suave entre layers

### 3. Parallax Light/Dark — Refinamento
**O que fazer:**
- [ ] Nebulosas pastel mais suaves no light mode
- [ ] Grid de profundidade adaptável ao tema
- [ ] Estrelas visíveis mas sutis no light mode
