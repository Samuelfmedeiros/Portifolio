# 🛰️ Mission Control | Samuel Andrade Portfolio

Este é um portal interativo de demonstração técnica, desenvolvido com uma estética de interface de comando espacial (Mission Control). O objetivo é centralizar projetos de análise de dados, automação e engenharia de software em um ambiente imersivo.

## 🚀 Tecnologias Utilizadas

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) (Temas Dark/Light)
- **Animações:** [Framer Motion](https://www.framer.com/motion/) (Efeitos de Parallax e HUD)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Backend:** [Supabase](https://supabase.com/) (Persistência de mensagens e logs)
- **Deploy:** [Vercel](https://vercel.com/)

## 🛠️ Módulos do Sistema

- **Hero HUD:** Telemetria de scroll com indicadores de sistema
- **Hangar de Projetos:** Cards dinâmicos via API do GitHub
- **Terminal Central:** CLI interativa com comandos personalizados
- **Utility Deck:** Relógio de missão, calculadora e mini-game de lógica
- **Transmissão:** Formulário de contato integrado ao Supabase

## 🎨 Temas

- **Night Vision:** Dark mode com preto puro + ciano neon
- **Daylight Ops:** Light mode cinza NASA + azul marinho

## 📋 Configuração Inicial

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Samuelfmedeiros/mission-control.git
   cd mission-control
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Variáveis de Ambiente:**
   Crie um arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://oswchwwmamjaxcvisfie.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
   ```

4. **Inicie o servidor:**
   ```bash
   pnpm dev
   ```

## 📡 Deploy

Configurado para deploy automático na Vercel.

## 📊 Estrutura Supabase

- `messages` — Mensagens do formulário de contato
- `analytics` — Métricas de páginas visitadas
