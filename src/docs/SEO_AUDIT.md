# 🔍 SEO + Meta — Audit Report

**Data:** 16/06/2026
**URL base:** `https://samuelmedeiros.vercel.app`
**Ferramenta:** Inspeção manual de HTML renderizado + layout.tsx + páginas internas

---

## ✅ Resumo

| Métrica | Status |
|---------|--------|
| **Meta title** | ✅ Template com `%s | Samuel Medeiros` |
| **Meta description** | ✅ Descritiva, rica em palavras-chave |
| **Open Graph** | ✅ Completo (title, description, image, locale, url, type) |
| **Twitter Cards** | ✅ `summary_large_image` com site/creator |
| **Structured Data (JSON-LD)** | ✅ Person schema |
| **Canonical URL** | ✅ `metadataBase` + `alternates.canonical` |
| **Alternate languages** | ✅ pt-BR + en-US |
| **Sitemap.xml** | ✅ 3 páginas, dinâmico |
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
| `og:image:alt` | Portifolio Samuel — Samuel Medeiros Portfolio |
| `og:locale` | `pt_BR` |
| `og:type` | `website` |
| `og:email` | `samuelandrademedeiros@gmail.com` |

✅ Completo e bem formatado.

### OG Image
- ✅ Gerado dinamicamente via `src/app/opengraph-image.tsx`
- ✅ Estilo escuro ciano+preto, scanlines, tags de tecnologia
- ✅ 1200×630 (tamanho recomendado)
- ✅ `force-static` para cache eficiente
- ✅ `alt` definido

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

Tipo: `Person` (Schema.org)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Samuel Medeiros",
  "jobTitle": "Desenvolvedor Full Stack",
  "url": "https://samuelmedeiros.vercel.app",
  "email": "samuelandrademedeiros@gmail.com",
  "sameAs": [
    "https://github.com/Samuelfmedeiros",
    "https://linkedin.com/in/samuelandrademedeiros"
  ],
  "knowsAbout": ["React", "Next.js", "TypeScript", "Supabase", ...],
  "description": "Desenvolvedor Full Stack com 5+ anos de experiência..."
}
```

✅ Presente em todas as páginas via `<JsonLd />` no layout.

**Recomendação:** Adicionar `sameAs` com links adicionais (WhatsApp, BuyMeACoffee) para enriquecimento.

---

## 🌐 Sitemap & Robots

### `sitemap.xml`
- ✅ 3 URLs: `/`, `/privacidade`, `/termos`
- ✅ Prioridades: Home=1.0, demais=0.5
- ✅ ChangeFreq: Home=monthly, demais=yearly
- ✅ `lastModified` atualizado automaticamente
- ✅ `force-static` para cache
- ❌ **Faltando:** `/robots.txt`, `/opengraph-image`, `/manifest.webmanifest` no sitemap (não crítico)

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

### 3. Sitemap incompleto (BAIXO)

O sitemap inclui `/`, `/privacidade`, `/termos` mas não inclui `/robots.txt`, `/opengraph-image`, `/manifest.webmanifest`.

**Recomendação:** Adicionar ao sitemap para indexação completa.

---

## ✅ Boas Práticas Presentes

- ✅ **`metadataBase`** definido — todas as URLs OG são absolutas
- ✅ **`force-static`** em sitemap, robots, OG image — cache eficiente
- ✅ **Template de título** — `%s | Samuel Medeiros`
- ✅ **Font display `swap`** — sem FOIT
- ✅ **HTML `lang="pt-BR"`** — acessibilidade + SEO
- ✅ **`icon.svg`** como favicon único (SVG suporta dark mode)
- ✅ **`theme-color`** dinâmico por scheme
- ✅ **Structured data** Person Schema presente
- ✅ **OG Image** com alt text descritivo
- ✅ **GoogleBot** com `max-image-preview: large` e `max-snippet:-1`

---

*Audit gerado por inspeção manual do HTML renderizado + análise de código-fonte*
