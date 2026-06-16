# Portifolio Samuel — Plano de Melhorias (Fase 2)

## Prioridade

### 1. ✅ Velocidade e Responsividade Mobile
- [x] Parallax canvas desligado/leve em mobile (< 768px)
- [x] `loading="lazy"` nas imagens dos project cards
- [x] `touch-action: manipulation` nos botões (remove delay 300ms)
- [x] Reduzir Framer Motion transforms em mobile

### 2. 🔄 Parallax — Cockpit Wake (Entrada refinada)
- [x] Background layers com `initial={{ opacity: 0 }}` + `animate` sequencial (0.5s L0, 0.6s L1)
- [ ] Hero stagger mantido, mas parallax "acorda" primeiro
- [ ] Transição mais suave entre layers

### 3. Parallax Light/Dark — Refinamento
- [ ] Nebulosas pastel mais suaves no light mode
- [ ] Grid de profundidade adaptável ao tema
- [ ] Estrelas visíveis mas sutis no light mode
