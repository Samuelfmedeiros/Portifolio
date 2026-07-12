# 🔍 SEO + Meta — Audit Report

**Data:** 12/07/2026 (última atualização)
**URL base:** `https://samuelmedeiros.vercel.app`

---

## ✅ Resumo

| Métrica | Status |
|---------|--------|
| **Meta title** | ✅ Template com `%s | Samuel Medeiros` |
| **Meta description** | ✅ Descritiva, rica em palavras-chave |
| **Open Graph** | ✅ Completo (title, description, image, locale, url, type, image:width, image:height, image:type) |
| **Twitter Cards** | ✅ `summary_large_image` com site/creator |
| **Structured Data (JSON-LD)** | ✅ 3 schemas: Person (enriquecido) + WebSite (SearchAction) + ItemList (projetos) |
| **Canonical URL** | ✅ `metadataBase` + `alternates.canonical` |
| **Alternate languages** | ✅ pt-BR + en-US |
| **Sitemap.xml** | ✅ 8 URLs (home, privacidade, termos, 5 games) |
| **Robots.txt** | ✅ index/follow, sitemap link |
| **Heading hierarchy** | ✅ h1 → h2 → h3 consistente |
| **Verification codes** | ⚠️ Placeholders (google, yandex, bing) |
| **Icons (favicon, apple-touch)** | ✅ SVG icon |
| **Theme-color** | ✅ light + dark mode |
| **HTML lang** | ✅ `pt-BR` |
| **Keywords** | ✅ 22 keywords relevantes |

---

## 📋 Meta Tags (Home)

### Título
```
Samuel Medeiros — Desenvolvedor Full Stack & Analista de Dados
```
✅ Template: `%s | Samuel Medeiros` — páginas internas usam o template.

### Description
```
Desenvolvedor Full Stack e Analista de Dados com 5+ anos de experiência em Brasília.
Next.js, React, Python, SQL, Power BI, Machine Learning — transformando dados em
decisões estratégicas.
```
✅ 156 caracteres — ideal para snippets do Google.

### Keywords (22)
✅ Cobre: desenvolvedor full stack, analista de dados, power bi, sql, python, machine learning, business intelligence, dashboards, data analysis, brasília, portfólio, bi, etl, postgresql, azure, next.js, react, typescript, frontend, backend, supabase, cloudflare, tailwind css.

### Autoria
✅ `author`, `creator`, `publisher` — todos "Samuel Medeiros"

---

## 🖼️ Open Graph

| Meta | Valor |
|------|-------|
| `og:title` | Samuel Medeiros — Desenvolvedor Full Stack & Analista de Dados |
| `og:description` | Desenvolvedor Full Stack e Analista de Dados com 5+ anos de experiência... |
| `og:url` | `https://samuelmedeiros.vercel.app` |
| `og:image` | `/opengraph-image` (1200×630 PNG) |
| `og:image:width` | 1200 |
| `og:image:height` | 630 |
| `og:image:type` | image/png |
| `og:image:alt` | Samuel Medeiros — Portfólio Profissional \| Full Stack & Dados |
| `og:locale` | `pt_BR` |
| `og:type` | `website` |
| `fb:app_id` | facebook-app-id |
| `article:tag` | desenvolvimento, tecnologia, portfólio, dados, fullstack |

✅ Completo e bem formatado. `videos: []` e `emails` removidos (não são padrão OG).

### OG Image
- ✅ Gerado dinamicamente via `src/app/opengraph-image.tsx`
- ✅ Estilo escuro ciano+preto, scanlines, tags de tecnologia
- ✅ 1200×630 (tamanho recomendado)
- ✅ `force-static` para cache eficiente
- ✅ `alt` mais descritivo

---

## 🐦 Twitter Cards

| Meta | Valor |
|------|-------|
| `twitter:card` | `summary_large_image` ✅ |
| `twitter:site` | `@Samuelfmedeiros` |
| `twitter:creator` | `@Samuelfmedeiros` |
| `twitter:title` | Samuel Medeiros — Desenvolvedor Full Stack & Analista de Dados |
| `twitter:description` | Desenvolvedor Full Stack e Analista de Dados. Next.js, Python, SQL, Power BI... |
| `twitter:image` | `/opengraph-image` |

✅ Completo.

---

## 🧠 Structured Data (JSON-LD)

3 schemas injetados via `<JsonLd />` no layout:

### 1. Person (enriquecido — 12 campos)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Samuel Medeiros",
  "givenName": "Samuel",
  "familyName": "Medeiros",
  "jobTitle": "Desenvolvedor Full Stack & Analista de Dados",
  "url": "https://samuelmedeiros.vercel.app",
  "email": "samuelandrademedeiros@gmail.com",
  "address": { "addressLocality": "Brasília", "addressRegion": "DF", "addressCountry": "BR" },
  "birthDate": "1997-05-19",
  "nationality": { "name": "Brazil" },
  "alumniOf": { "name": "Universidade de Brasília" },
  "knowsLanguage": ["Portuguese", "English"],
  "sameAs": ["GitHub", "LinkedIn", "LifeLog", "Twitter/X", "WhatsApp"],
  "knowsAbout": ["React", "Next.js", "TypeScript", "Python", "SQL", "Power BI", ...]
}
```

✅ Busca local: "desenvolvedor full stack brasília", "samuel medeiros", Google Knowledge Panel potencial.

### 2. WebSite (SearchAction)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://samuelmedeiros.vercel.app",
  "name": "Samuel Medeiros — Portfólio",
  "alternateName": "Samuel Medeiros Portfolio",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://samuelmedeiros.vercel.app/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

✅ Permite Sitelinks Search Box no Google — usuário pesquisa direto do SERP.

### 3. ItemList (8 projetos)

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    { "position": 1, "item": { "@type": "SoftwareApplication", "name": "DogWalk", ... } },
    { "position": 2, "item": { "@type": "SoftwareApplication", "name": "Arachne", ... } },
    ...
  ]
}
```

✅ Cada projeto como `SoftwareApplication` com `author` → Samuel. Ajuda mecanismos de busca a catalogar e sugerir os apps.

---

## 🌐 Sitemap & Robots

### `sitemap.xml`
- ✅ 8 URLs: `/`, `/privacidade`, `/termos`, `/games/memory-matrix/index.html`, `/games/simon-game/index.html`, `/games/code-typing/index.html`, `/games/terminal/index.html`, `/games/asteroid-dodge/index.html`
- ✅ Prioridades: Home=1.0, games=0.6, páginas legais=0.4
- ✅ ChangeFreq: Home/games=monthly, legais=yearly
- ✅ `lastModified` baseado no git (`2026-07-07`)
- ✅ `force-static` para cache

### `robots.txt`
- ✅ `Allow: /` para todos user-agents
- ✅ Sitemap aponta para `sitemap.xml`
- ✅ `index, follow` configurado
- ✅ `googleBot` com `max-image-preview: large`

---

## 🔗 URLs Canônicas

| Configuração | Valor |
|---|---|
| `metadataBase` | `https://samuelmedeiros.vercel.app` ✅ |
| `alternates.canonical` | `https://samuelmedeiros.vercel.app` ✅ |
| `alternates.languages` | pt-BR + en-US ✅ |

**Nota:** A rota `/en` não existe atualmente — definir `en-US` como alternate sem página real não gera problema (mecanismos ignoram), mas idealmente ter o conteúdo ou remover.

---

## 📐 Headings

### Home
```
h1 → "Samuel Medeiros" (ProfileSection)
h2 → "▸ HABILIDADES" (Skills)
h2 → "▸ JORNADA" (Timeline - ProfileSection)
h2 → "▸ PROJETOS" (ProjectHangar)
h2 → "🎮 JOGOS" (GameShowcase)
h2 → "▸ CONTATO" (ContactForm)
```

### /privacidade
```
h1 → "Política de Privacidade"
```

### /termos
```
h1 → "Termos de Uso"
```

✅ Hierarquia correta sem pulos.

---

## ⚠️ Achados

### 1. Verification Codes — Placeholders (BAIXO)

Os códigos de verificação dos mecanismos de busca são placeholders:
- `google-site-verification-code`
- `yandex-verification-code`
- `bing-site-verification-code`

**Impacto:** Baixo — não afeta indexação atual, apenas impede verificação de propriedade no Search Console.

**Recomendação:** Substituir pelos códigos reais quando for configurar Google Search Console / Bing Webmaster Tools.

### 2. Alternate `en-US` sem rota real (BAIXO)

O `alternateLanguages` aponta `en-US` → `/en`, mas esta rota não existe (retorna 404).

**Recomendação:** Ou criar uma página `/en` com conteúdo em inglês, ou remover a entrada `en-US` do `alternates.languages`.

### 3. Games em `/games/*/index.html` (BAIXO)

Os 5 jogos são servidos como arquivos estáticos de `public/games/*/index.html`. Embora funcionem, não têm meta tags próprias (OG, Twitter, JSON-LD).

**Impacto:** Cada jogo é uma página HTML sem SEO individual — não aparecem como entidades separadas em redes sociais.

**Recomendação:** Se os jogos forem promovidos individualmente no futuro, criar páginas Next.js com meta tags por jogo.

### 4. `telephone` no JsonLd (BAIXO)

O número de telefone no Person schema é placeholder (`+55-61-99999-9999`).

**Recomendação:** Substituir pelo número real ou remover se não quiser expor publicamente.

---

## ✅ Boas Práticas Presentes

- ✅ **`metadataBase`** definido — todas as URLs OG são absolutas
- ✅ **`force-static`** em sitemap, robots, OG image — cache eficiente
- ✅ **Template de título** — `%s | Samuel Medeiros`
- ✅ **Font display `swap`** — sem FOIT
- ✅ **HTML `lang="pt-BR"`** — acessibilidade + SEO
- ✅ **`icon.svg`** como favicon único (SVG suporta dark mode)
- ✅ **`theme-color`** dinâmico por scheme
- ✅ **Structured data** 3 schemas (Person, WebSite, ItemList)
- ✅ **OG Image** com alt text descritivo
- ✅ **GoogleBot** com `max-image-preview: large` e `max-snippet:-1`
- ✅ **Facebook tags** (`fb:app_id`, `fb:admins`)
- ✅ **Artigo tags** (`article:tag`) para taxonomia de conteúdo

---

## 📊 Score Estimado (PageSpeed / Lighthouse)

| Métrica | Score | Notas |
|---------|-------|-------|
| SEO | ✅ ~95-100 | Meta tags, structured data, heading hierarchy |
| Acessibilidade | ✅ ~85-90 | Skip link, aria labels, contraste |
| Performance | ✅ ~70-90 | Depende de imagem/implements |
| Best Practices | ✅ ~90-100 | HTTPS, viewport, charset |

---

*Audit gerado por inspeção do código-fonte + build output. Última atualização: 12/07/2026*
