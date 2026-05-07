# 🛰️ Mission Control — Plano de Reconstrução Completa

> **Para Hermes:** Use subagent-driven-development para implementar task-by-task.

**Meta:** Transformar o protótipo embrionário em um portfólio profissional completo, polido e deployável.

**Arquitetura:** Next.js 16 App Router + Tailwind 4 + Framer Motion + Supabase. Componentes "use client" apenas onde necessário. Server Components para data fetching. CSS custom properties para temas.

**Status atual:** 12 componentes com 29 testes passando, CI ativo, Supabase integrado, responsivo mobile.

---

## 📋 Diagnóstico — O que falta

| Área | Problema |
|------|----------|
| **Seções** | Falta About/Core Engine, Skills com ícones reais, Footer pobre |
| **Terminal** | Sem histórico de comandos (↑↓), sem autocomplete, sem ascii art |
| **Projetos** | Client-side fetch sem cache, sem estado de erro, sem Server Component |
| **MiniGame** | Jogo de adivinhação simples demais — "mini-game de lógica" precisa ser melhor |
| **UX** | Sem smooth scroll, sem loading skeletons, sem error boundary |
| **SEO** | Sem sitemap.xml, robots.txt, structured data (JSON-LD), og:image |
| **Acessibilidade** | Faltam aria-labels, focus management, skip-to-content |
| **Analytics** | Tabela analytics existe mas sem tracking implementado |
| **Performance** | 120 div stars no DOM; ContactForm sem rate limit; sem lazy loading |
| **Deploy** | Vercel "limited", sem domínio customizado |

---

## 🗺️ Fases

```
FASE 1: Fundação Sólida          (6 tasks)
FASE 2: Seções Completas         (8 tasks)
FASE 3: Terminal Premium         (5 tasks)
FASE 4: Polish & Performance     (7 tasks)
FASE 5: SEO & Deploy             (6 tasks)
```

---

## FASE 1 — Fundação Sólida

### Task 1: Criar estrutura de tipos centralizada

**Objetivo:** Centralizar todas as interfaces TypeScript em um arquivo `types.ts`

**Arquivos:**
- Criar: `src/lib/types.ts`
- Modificar: `src/components/ProjectHangar.tsx`, `src/lib/supabase.ts`, `src/components/Terminal.tsx`

**Passos:**

**Step 1:** Criar `src/lib/types.ts` com todas as interfaces do projeto:
```typescript
// src/lib/types.ts
export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  created_at: string;
}

export interface Command {
  cmd: string;
  output: string;
}

export interface Message {
  id: number;
  created_at: string;
  name: string;
  email: string;
  content: string;
}

export interface PageView {
  id: number;
  page_path: string;
  view_count: number;
  last_access: string;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export type Theme = "dark" | "light";
export type Widget = "clock" | "calculator" | "game" | null;
export type FormStatus = "idle" | "sending" | "sent" | "error";
```

**Step 2:** Atualizar imports em `ProjectHangar.tsx`, `supabase.ts`, `Terminal.tsx` para usar tipos de `@/lib/types`

**Step 3:** Rodar `pnpm type-check` — deve passar sem erros

**Step 4:** Commit: `refactor: extrair tipos para lib/types.ts`

---

### Task 2: Adicionar Error Boundary

**Objetivo:** Capturar erros em runtime com fallback visual estilizado

**Arquivos:**
- Criar: `src/components/ErrorBoundary.tsx`
- Modificar: `src/app/layout.tsx`

**Step 1:** Criar `ErrorBoundary.tsx`:
```tsx
"use client";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
          <div className="glass p-8 max-w-md text-center">
            <h2 className="text-2xl font-mono text-red-400 mb-4">⚠ SISTEMA INSTÁVEL</h2>
            <p className="text-sm font-mono text-[var(--text-secondary)] mb-4">
              {this.state.error?.message || "Erro desconhecido"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="glass px-4 py-2 font-mono text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10"
            >
              REINICIAR SISTEMA
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**Step 2:** Envolver `{children}` em `layout.tsx` com `<ErrorBoundary>`

**Step 3:** Commit: `feat: adicionar error boundary`

---

### Task 3: Adicionar Loading Skeleton

**Objetivo:** Mostrar skeleton durante carregamento inicial e transições

**Arquivos:**
- Criar: `src/components/Skeleton.tsx`
- Criar: `src/app/loading.tsx`

**Step 1:** Criar `Skeleton.tsx` — componente com animação pulse:
```tsx
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[var(--border)] rounded ${className}`} />
  );
}
```

**Step 2:** Criar `src/app/loading.tsx` — tela de loading completa com glass cards skeletons

**Step 3:** Commit: `feat: adicionar loading skeleton`

---

### Task 4: Implementar smooth scroll

**Objetivo:** Navegação suave ao clicar nos links da Navbar (já usa #ids)

**Arquivos:**
- Modificar: `src/app/globals.css` — adicionar `scroll-behavior: smooth`
- Modificar: `src/components/Navbar.tsx` — garantir que href com # funcione corretamente

**Step 1:** Adicionar ao `globals.css`:
```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* navbar offset */
}
```

**Step 2:** Commit: `feat: smooth scroll + offset navbar`

---

### Task 5: Implementar page view analytics

**Objetivo:** Rastrear visualizações de página no Supabase (tabela `analytics`)

**Arquivos:**
- Criar: `src/components/AnalyticsTracker.tsx`
- Modificar: `src/app/layout.tsx`

**Step 1:** Criar `AnalyticsTracker.tsx` — componente client-side que faz upsert na tabela analytics:
```tsx
"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function AnalyticsTracker() {
  useEffect(() => {
    const path = window.location.pathname;
    supabase.rpc("increment_page_view", { page: path }).then(({ error }) => {
      if (error) console.debug("Analytics:", error.message);
    });
  }, []);
  return null;
}
```

**Step 2:** Criar função RPC no Supabase via SQL (adicionar ao `supabase-rls.sql`):
```sql
CREATE OR REPLACE FUNCTION increment_page_view(page text)
RETURNS void AS $$
BEGIN
  INSERT INTO analytics (page_path, view_count, last_access)
  VALUES (page, 1, NOW())
  ON CONFLICT (page_path)
  DO UPDATE SET view_count = analytics.view_count + 1, last_access = NOW();
END;
$$ LANGUAGE plpgsql;
```

**Step 3:** Adicionar `<AnalyticsTracker />` no `layout.tsx`

**Step 4:** Commit: `feat: page view analytics via Supabase RPC`

---

### Task 6: Rate limit no ContactForm

**Objetivo:** Prevenir spam no formulário de contato

**Arquivos:**
- Modificar: `src/components/ContactForm.tsx`

**Step 1:** Adicionar cooldown de 30 segundos entre envios:
```tsx
const [lastSent, setLastSent] = useState<number>(0);

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  const now = Date.now();
  if (now - lastSent < 30_000) {
    setStatus("error");
    return;
  }
  setLastSent(now);
  // ... restante do código
}
```

**Step 2:** Adicionar validação de email format:
```tsx
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) { /* mostrar erro */ }
```

**Step 3:** Commit: `feat: rate limit + email validation no ContactForm`

---

## FASE 2 — Seções Completas

### Task 7: Seção About Me / Core Engine

**Objetivo:** Nova seção destacando hardware, IA local, e trajetória profissional

**Arquivos:**
- Criar: `src/components/CoreEngine.tsx`
- Criar: `src/components/CoreEngine.test.tsx`
- Modificar: `src/app/page.tsx`

**Step 1:** Criar `CoreEngine.tsx` com:
- Grid de 3 cards: Hardware (RTX 3060), Stack IA (Ollama, LLMs locais), Trajetória
- Usar `GlassCard` como wrapper
- Ícones: Cpu, HardDrive, BrainCircuit do Lucide

**Step 2:** Criar teste básico verificando renderização

**Step 3:** Adicionar `<CoreEngine />` em `page.tsx` entre `HeroSection` e `ProjectHangar`

**Step 4:** Commit: `feat: seção Core Engine (About Me)`

---

### Task 8: Seção Skills com grid visual

**Objetivo:** Substituir pills simples da Hero por uma seção dedicada com ícones e níveis

**Arquivos:**
- Criar: `src/components/SkillsGrid.tsx`
- Criar: `src/components/SkillsGrid.test.tsx`
- Modificar: `src/app/page.tsx`

Habilidades com ícones Lucide:
- BI (BarChart3), SQL (Database), Python (Code2), ML (Brain), Next.js (Globe), LLMs (Bot), Docker (Container), Git (GitBranch)

**Step 1:** Criar `SkillsGrid.tsx` com grid responsivo de skill cards

**Step 2:** Adicionar `<SkillsGrid />` em `page.tsx` após `CoreEngine`

**Step 3:** Commit: `feat: skills grid com ícones`

---

### Task 9: ProjectHangar como Server Component + cache

**Objetivo:** Buscar dados do GitHub no servidor com ISR para performance

**Arquivos:**
- Criar: `src/lib/github.ts` — função server-side para fetch com cache
- Modificar: `src/components/ProjectHangar.tsx` — receber dados como props, remover fetch client-side

**Step 1:** Criar `src/lib/github.ts`:
```typescript
import { Repo } from "./types";

export async function getRepos(): Promise<Repo[]> {
  const res = await fetch(
    "https://api.github.com/users/Samuelfmedeiros/repos?per_page=20&sort=updated",
    { next: { revalidate: 3600 } } // ISR: 1 hora
  );
  if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
  const data = await res.json();
  return data.filter((r: Repo) => !r.name.includes("test"));
}
```

**Step 2:** Refatorar `ProjectHangar.tsx` para ser Server Component que recebe `repos` como prop. Versionar com `"use client"` wrapper para animações via `motion`.

**Step 3:** Atualizar `page.tsx` para fetch dados do GitHub via `getRepos()` e passar para `ProjectHangar`

**Step 4:** Commit: `feat: ProjectHangar server-side com ISR`

---

### Task 10: Estado de loading/error no ProjectHangar

**Objetivo:** Suspense boundary e fallback visual para fetch de projetos

**Arquivos:**
- Modificar: `src/app/page.tsx`
- Criar: `src/components/HangarSkeleton.tsx`

**Step 1:** Criar `HangarSkeleton.tsx` — grid de 6 cards skeleton com animação pulse

**Step 2:** Envolver `ProjectHangar` em `<Suspense fallback={<HangarSkeleton />}>` no `page.tsx`

**Step 3:** Commit: `feat: suspense + skeleton no ProjectHangar`

---

### Task 11: Footer expandido

**Objetivo:** Footer mais rico com links, status de build, e assinatura estilo terminal

**Arquivos:**
- Criar: `src/components/Footer.tsx`
- Modificar: `src/app/layout.tsx` (remover footer inline)

**Step 1:** Criar `Footer.tsx` com:
- Status indicator (CI badge dinâmico)
- Links: GitHub, LinkedIn, Email
- Copyright com ano atual
- Frase "ALL SYSTEMS NOMINAL"

**Step 2:** Substituir footer inline em `layout.tsx` por `<Footer />`

**Step 3:** Commit: `feat: footer expandido`

---

### Task 12: Página 404 personalizada

**Objetivo:** Página "SIGNAL LOST" estilizada para rotas não encontradas

**Arquivos:**
- Criar: `src/app/not-found.tsx`

**Step 1:** Criar `not-found.tsx`:
```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="glass p-12 text-center max-w-md">
        <h1 className="text-8xl font-mono text-[var(--accent)] mb-4">404</h1>
        <p className="text-xl font-mono text-[var(--text-secondary)] mb-2">SINAL PERDIDO</p>
        <p className="text-sm font-mono text-[var(--text-secondary)]/60 mb-8">
          A transmissão foi interrompida ou a rota não existe
        </p>
        <Link href="/" className="glass px-6 py-3 font-mono text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10">
          ← RETORNAR À BASE
        </Link>
      </div>
    </div>
  );
}
```

**Step 2:** Commit: `feat: página 404 personalizada`

---

## FASE 3 — Terminal Premium

### Task 13: Histórico de comandos com ↑↓

**Objetivo:** Navegar pelo histórico de comandos com setas do teclado

**Arquivos:**
- Modificar: `src/components/Terminal.tsx`

**Step 1:** Adicionar state `historyIndex` e array `commandHistory`:
```tsx
const [historyIndex, setHistoryIndex] = useState(-1);
const commandHistoryRef = useRef<string[]>([]);

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    // navegar para comando anterior no histórico
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    // navegar para próximo
  } else if (e.key === "Enter" && input.trim()) {
    commandHistoryRef.current.push(input);
    setHistoryIndex(-1);
    // executar comando...
  }
};
```

**Step 2:** Atualizar testes do Terminal para cobrir navegação com setas

**Step 3:** Commit: `feat: terminal command history ↑↓`

---

### Task 14: Autocomplete com Tab

**Objetivo:** Auto-completar comandos conhecidos ao pressionar Tab

**Arquivos:**
- Modificar: `src/components/Terminal.tsx`

**Step 1:** Adicionar lista de comandos e handler Tab:
```tsx
const COMMANDS = ["help", "whoami", "ls projects", "skills", "contact", "clear", "date"];

// No handleKeyDown:
if (e.key === "Tab") {
  e.preventDefault();
  const match = COMMANDS.find(c => c.startsWith(input.trim().toLowerCase()));
  if (match) setInput(match);
}
```

**Step 2:** Commit: `feat: terminal autocomplete (Tab)`

---

### Task 15: ASCII art no banner inicial

**Objetivo:** Banner ASCII "MISSION CONTROL" no primeiro output do terminal

**Arquivos:**
- Modificar: `src/components/Terminal.tsx`

**Step 1:** Adicionar banner ASCII ao `useState` inicial:
```tsx
const BANNER = `
███╗   ███╗██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗
████╗ ████║██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║
██╔████╔██║██║███████╗███████╗██║██║   ██║██╔██╗ ██║
██║╚██╔╝██║██║╚════██║╚════██║██║██║   ██║██║╚██╗██║
██║ ╚═╝ ██║██║███████║███████║██║╚██████╔╝██║ ╚████║
╚═╝     ╚═╝╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
  CONTROL TERMINAL v2.0 ◆ Samuel Andrade
`;
```

**Step 2:** Commit: `feat: ASCII banner no terminal`

---

### Task 16: Comando `neofetch` com specs do sistema

**Objetivo:** Adicionar comando `neofetch` que mostra especificações ao estilo Linux

**Arquivos:**
- Modificar: `src/components/Terminal.tsx`

**Step 1:** Adicionar case `neofetch`:
```
case "neofetch":
  output = `         ▄▄▄▄▄▄▄▄      OS: MISSION CONTROL v2.0
      ▄████████████▄   HOST: Vercel Edge Network
    ▄████████████████▄  KERNEL: Next.js 16.2.5
   ██████████████████   UPTIME: ${/* calcular */} 
  ████████████████████  SHELL: zsh (emulated)
  ████████████████████  CPU: AMD Ryzen + RTX 3060 (12GB)
  ███████▀    ▀███████  MEMORY: 32GB DDR4
  ██████▀      ▀██████  STORAGE: 1TB NVMe SSD
   █████▄    ▄█████    LLM: Ollama (Mistral, Llama 3)
    ▀████████████▀     EDITOR: Cursor / VS Code`;
  break;
```

**Step 2:** Commit: `feat: comando neofetch`

---

### Task 17: Comando `matrix` com efeito visual simples

**Objetivo:** Adicionar comando `matrix` que gera chuva de caracteres no terminal

**Arquivos:**
- Modificar: `src/components/Terminal.tsx`

**Step 1:** Gerar ~20 linhas de caracteres aleatórios verdes:
```tsx
case "matrix":
  const chars = "ｦｧｨｩｪｫｬｭｮｯｱｲｳｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";
  output = Array.from({ length: 15 }, () =>
    Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  ).join("\n");
  break;
```

**Step 2:** Commit: `feat: comando matrix`

---

## FASE 4 — Polish & Performance

### Task 18: MiniGame melhorado — Jogo da Memória (sequência)

**Objetivo:** Substituir jogo de adivinhação por algo mais "lógica"

**Arquivos:**
- Modificar: `src/components/MiniGame.tsx`
- Modificar: `src/components/MiniGame.test.tsx`

**Step 1:** Criar jogo de sequência (Simon Says simplificado):
- Mostrar sequência de 3-5 números que piscam
- Usuário repete a sequência
- Aumenta dificuldade a cada acerto
- Score tracking

**Step 2:** Atualizar testes

**Step 3:** Commit: `feat: minigame sequência lógica`

---

### Task 19: ParallaxBackground otimizado com Canvas

**Objetivo:** Substituir 120 divs por um único canvas para melhor performance

**Arquivos:**
- Modificar: `src/components/ParallaxBackground.tsx`

**Step 1:** Refatorar para usar `<canvas>` + `requestAnimationFrame`:
```tsx
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  // desenhar estrelas via canvas
  const animate = () => { /* draw loop */ };
  requestAnimationFrame(animate);
}, []);
```

**Step 2:** Commit: `perf: parallax via Canvas (remove 120 divs)`

---

### Task 20: Lazy loading para seções abaixo da dobra

**Objetivo:** Carregar UtilityDeck e ContactForm apenas quando visíveis

**Arquivos:**
- Modificar: `src/app/page.tsx`

**Step 1:** Criar wrapper `LazySection` usando `next/dynamic`:
```tsx
import dynamic from "next/dynamic";

const UtilityDeck = dynamic(() => import("@/components/UtilityDeck").then(m => ({ default: m.UtilityDeck })), {
  loading: () => <SkeletonSection />,
});
```

**Step 2:** Commit: `perf: lazy load seções abaixo da dobra`

---

### Task 21: Acessibilidade (aria-labels, focus, skip-link)

**Objetivo:** WCAG básico — navegação por teclado e screen readers

**Arquivos:**
- Modificar: `src/components/Navbar.tsx` — aria-labels
- Criar: `src/components/SkipLink.tsx`
- Modificar: `src/app/layout.tsx` — skip-link no topo

**Step 1:** Adicionar `<SkipLink />` como primeiro elemento do body:
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only ...">
  Pular para conteúdo
</a>
```

**Step 2:** Adicionar `aria-label` nos botões e links interativos

**Step 3:** Commit: `a11y: skip-link + aria-labels`

---

### Task 22: Tema persistido em localStorage (já deve ter, verificar)

**Objetivo:** Garantir que ThemeProvider salva e restaura preferência

**Arquivos:**
- Verificar: `src/components/ThemeProvider.tsx`

**Step 1:** Confirmar que `localStorage.setItem("theme", ...)` existe

**Step 2:** Se não existir, implementar

**Step 3:** Commit: `feat: persistir tema no localStorage`

---

### Task 23: Animações de entrada refinadas

**Objetivo:** Revisar e unificar animações Framer Motion em todas as seções

**Arquivos:**
- Modificar: `src/components/CoreEngine.tsx`, `SkillsGrid.tsx`, etc.

**Step 1:** Adicionar `whileInView` com stagger children nas seções novas

**Step 2:** Garantir `viewport={{ once: true, margin: "-100px" }}` para não reanimar

**Step 3:** Commit: `feat: animações whileInView stagger`

---

### Task 24: Testes para novos componentes

**Objetivo:** Cobrir CoreEngine, SkillsGrid, Footer, not-found com testes

**Arquivos:**
- Criar: `src/components/CoreEngine.test.tsx`
- Criar: `src/components/SkillsGrid.test.tsx`
- Criar: `src/components/Footer.test.tsx`

**Step 1:** Criar testes básicos de renderização para cada componente novo

**Step 2:** Rodar `pnpm test:run` — garantir que todos passam

**Step 3:** Commit: `test: novos componentes CoreEngine, SkillsGrid, Footer`

---

## FASE 5 — SEO & Deploy

### Task 25: SEO — sitemap.xml + robots.txt

**Objetivo:** Gerar sitemap e robots.txt automaticamente

**Arquivos:**
- Criar: `src/app/sitemap.ts`
- Criar: `src/app/robots.ts`

**Step 1:** Criar `sitemap.ts` (Next.js convention):
```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://samuelandrade.dev", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ];
}
```

**Step 2:** Criar `robots.ts`:
```typescript
import { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://samuelandrade.dev/sitemap.xml" };
}
```

**Step 3:** Commit: `seo: sitemap + robots.txt`

---

### Task 26: SEO — JSON-LD Structured Data

**Objetivo:** Adicionar schema.org Person para SEO

**Arquivos:**
- Criar: `src/components/JsonLd.tsx`
- Modificar: `src/app/layout.tsx`

**Step 1:** Criar componente que renderiza `<script type="application/ld+json">`:
```tsx
export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Samuel Andrade",
    "jobTitle": "Analista de Dados e Produto",
    "url": "https://samuelandrade.dev",
    "sameAs": ["https://github.com/Samuelfmedeiros", "https://linkedin.com/in/samuelandrade"],
    "knowsAbout": ["Data Analysis", "Business Intelligence", "SQL", "Python", "Machine Learning", "Next.js"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
```

**Step 2:** Adicionar `<JsonLd />` no `<head>` do layout

**Step 3:** Commit: `seo: json-ld structured data`

---

### Task 27: SEO — OG Image dinâmica

**Objetivo:** Gerar imagem de preview para compartilhamento em redes sociais

**Arquivos:**
- Criar: `src/app/og-image.png` (ou usar `src/app/opengraph-image.tsx`)

**Step 1:** Usar `next/og` ImageResponse para gerar SVG/PNG programaticamente:
```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ background: "#000", color: "#22d3ee", /* ... */ }}>
        MISSION CONTROL • Samuel Andrade
      </div>
    ),
    { ...size }
  );
}
```

**Step 2:** Commit: `seo: og:image dinâmico`

---

### Task 28: Configurar Vercel deploy manualmente

**Objetivo:** Deploy funcionando no Vercel

**Passos manuais (Samuel faz):**
1. Logar em vercel.com com `samuelandrademedeiros@gmail.com`
2. Importar repo `Samuelfmedeiros/mission-control`
3. Configurar env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

**Hermes:** Atualizar README com URL do deploy e instruções

---

### Task 29: Configurar domínio customizado

**Objetivo:** Apontar domínio para o projeto

**Domínio sugerido:** `samuelandrade.dev` (ou similar disponível)

**Passos:**
1. Verificar disponibilidade no registro.br ou Namecheap
2. Comprar domínio (~R$ 40/ano)
3. Configurar DNS no Vercel (CNAME/A record)

---

### Task 30: GitHub Actions — adicionar badge dinâmico no README

**Objetivo:** Mostrar status real do build no README

**Arquivos:**
- Modificar: `README.md` — badge já existe, verificar se funciona

---

## 📊 Resumo Final

| Fase | Tasks | Estimativa |
|------|-------|-----------|
| FASE 1: Fundação | 1-6 | 30 min |
| FASE 2: Seções | 7-12 | 45 min |
| FASE 3: Terminal | 13-17 | 30 min |
| FASE 4: Polish | 18-24 | 40 min |
| FASE 5: SEO/Deploy | 25-30 | 30 min |
| **TOTAL** | **30 tasks** | **~3h** |

---

**Pronto para executar. Usar `subagent-driven-development` — fresh subagent por fase com two-stage review.**
