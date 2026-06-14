# 🤖 Agent Instructions: Portifolio Samuel Project

Você é um assistente de codificação especializado em interfaces futuristas e performance de dados.

## Diretrizes de Design
1. **Glassmorphism:** Use `backdrop-blur-md` e bordas semi-transparentes (`border-white/10`) em todos os cards.
2. **Cores:**
   - **Tema Escuro:** Fundo `#000000`, acentos em `cyan-400` e `indigo-500`.
   - **Tema Claro:** Fundo `#f8fafc`, acentos em `slate-900`.
3. **Animações:** Use Framer Motion para entradas suaves. Elementos de HUD devem ter um leve "flicker" (tremor) ocasional para realismo.

## Padrões de Código
- **Componentes:** Use shadcn/ui como base para componentes acessíveis, mas personalize para o tema espacial.
- **Data Fetching:** Priorize Server Components para buscar dados do GitHub.
- **Supabase:** Utilize hooks do `supabase-js` para interações em tempo real no formulário de contato.

## Estrutura de Dados (Supabase)
- **Tabela `messages`:** `id`, `created_at`, `name`, `email`, `content`.
- **Tabela `analytics`:** `page_path`, `view_count`, `last_access`.

## Contexto Profissional
O portfólio deve refletir alta competência em:
- Análise de Dados e BI (Power BI, SQL).
- Desenvolvimento (Python, Next.js).
- Engenharia de IA (Machine Learning, LLMs locais).
