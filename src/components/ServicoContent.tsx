"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { LazyContactForm } from "./LazyContactForm";

/**
 * Conteúdo da página /servico — automação com IA.
 *
 * Separado do page.tsx (server) porque a página precisa exportar `metadata`
 * (title/description/canonical/OG) e o texto é bilíngue: o dicionário só é
 * acessível via hook, e hook exige componente client. Layout segue o resto do
 * site: `glass` + variáveis CSS do tema (claro/creme por padrão, dark no toggle).
 */

const PROBLEMS = [
  { key: "servico.problem.1.title", desc: "servico.problem.1.desc" },
  { key: "servico.problem.2.title", desc: "servico.problem.2.desc" },
  { key: "servico.problem.3.title", desc: "servico.problem.3.desc" },
] as const;

const STEPS = [
  { key: "servico.how.1.title", desc: "servico.how.1.desc" },
  { key: "servico.how.2.title", desc: "servico.how.2.desc" },
  { key: "servico.how.3.title", desc: "servico.how.3.desc" },
  { key: "servico.how.4.title", desc: "servico.how.4.desc" },
] as const;

const INCLUDES = [
  { key: "servico.includes.1.title", desc: "servico.includes.1.desc" },
  { key: "servico.includes.2.title", desc: "servico.includes.2.desc" },
  { key: "servico.includes.3.title", desc: "servico.includes.3.desc" },
  { key: "servico.includes.4.title", desc: "servico.includes.4.desc" },
] as const;

const SITES = [
  "seu.pet",
  "focinho.seu.pet",
  "safmarket",
  "portifolio.seu.pet",
  "lifelog.seu.pet",
  "arachne.seu.pet",
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
      {children}
    </p>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-[var(--accent)]"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export function ServicoContent() {
  const { t } = useLanguage();

  return (
    <main id="servico" className="min-h-screen bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
        >
          ← {t("servico.back", "Voltar ao início")}
        </Link>

        {/* 1. Headline */}
        <section aria-labelledby="servico-hero" className="mb-14 md:mb-20">
          <Eyebrow>{t("servico.hero.label", "Serviço")}</Eyebrow>
          <h1
            id="servico-hero"
            className="max-w-3xl text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl"
          >
            {t(
              "servico.hero.title",
              "Eu instalo uma automação com IA que roda sozinha no seu negócio em 48h.",
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            {t(
              "servico.hero.subtitle",
              "Diagnóstico em 1 dia, automação rodando em 48h, ajuste por 30 dias.",
            )}
          </p>
          <a
            href="#contato"
            className="mt-7 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
            style={{
              // Contraste medido (Lighthouse 19/11): accent puro + texto escuro = 3.19
              // (reprova AA). Mistura 50% do accent com o ink do tema mantém a cor da
              // marca e sobe o contraste para 11.9 (claro) / 5.9 (escuro) com texto branco.
              background: "color-mix(in srgb, var(--accent) 50%, #0a0a12)",
            }}
          >
            {t("servico.hero.cta", "Diagnóstico de 20 min, sem custo")}
          </a>
        </section>

        {/* 2. Problema */}
        <section aria-labelledby="servico-problema" className="mb-14 md:mb-20">
          <Eyebrow>{t("servico.problem.label", "O problema")}</Eyebrow>
          <h2
            id="servico-problema"
            className="mb-6 text-xl font-bold text-[var(--text-primary)] md:text-2xl"
          >
            {t("servico.problem.title", "O que trava o dia de quem toca o negócio")}
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {PROBLEMS.map((item) => (
              <li
                key={item.key}
                className="glass rounded-xl border border-[var(--border)] p-5"
              >
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {t(item.key)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {t(item.desc)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Como funciona */}
        <section aria-labelledby="servico-como" className="mb-14 md:mb-20">
          <Eyebrow>{t("servico.how.label", "Como funciona")}</Eyebrow>
          <h2
            id="servico-como"
            className="mb-6 text-xl font-bold text-[var(--text-primary)] md:text-2xl"
          >
            {t("servico.how.title", "Quatro passos, do diagnóstico à entrega")}
          </h2>
          <ol className="grid gap-4 md:grid-cols-2">
            {STEPS.map((step, i) => (
              <li
                key={step.key}
                className="glass flex gap-4 rounded-xl border border-[var(--border)] p-5"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-sm font-bold text-[var(--accent)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    {t(step.key)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {t(step.desc)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. O que está incluído */}
        <section aria-labelledby="servico-inclui" className="mb-14 md:mb-20">
          <Eyebrow>{t("servico.includes.label", "Incluído")}</Eyebrow>
          <h2
            id="servico-inclui"
            className="mb-6 text-xl font-bold text-[var(--text-primary)] md:text-2xl"
          >
            {t("servico.includes.title", "O que você recebe")}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {INCLUDES.map((item) => (
              <li key={item.key} className="flex gap-3">
                <CheckIcon />
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    {t(item.key)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {t(item.desc)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Prova */}
        <section aria-labelledby="servico-prova" className="mb-14 md:mb-20">
          <Eyebrow>{t("servico.proof.label", "Prova")}</Eyebrow>
          <h2
            id="servico-prova"
            className="mb-6 text-xl font-bold text-[var(--text-primary)] md:text-2xl"
          >
            {t("servico.proof.title", "O que já está no ar")}
          </h2>
          <div className="glass rounded-xl border border-[var(--border)] p-5 md:p-6">
            <ul className="grid gap-2 font-mono text-sm text-[var(--text-secondary)] sm:grid-cols-2 md:grid-cols-3">
              {SITES.map((site) => (
                <li key={site} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-[var(--accent)]">
                    ·
                  </span>
                  {site}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {t(
                "servico.proof.note",
                "Servidor próprio rodando cerca de 1.900 tarefas por dia. Números medidos, sem adjetivo.",
              )}
            </p>
          </div>
        </section>

        {/* 6. Preço */}
        <section aria-labelledby="servico-preco" className="mb-14 md:mb-20">
          <Eyebrow>{t("servico.price.label", "Preço")}</Eyebrow>
          <h2
            id="servico-preco"
            className="mb-6 text-xl font-bold text-[var(--text-primary)] md:text-2xl"
          >
            {t("servico.price.title", "Valores fechados")}
          </h2>
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                {t("servico.price.title", "Valores fechados")}
              </caption>
              <tbody>
                <tr className="border-b border-[var(--border)]">
                  <th scope="row" className="px-5 py-4 font-medium text-[var(--text-primary)]">
                    {t("servico.price.setup", "Implantação")}
                  </th>
                  <td className="px-5 py-4 text-right font-mono text-[var(--text-primary)]">
                    R$ 1.900
                  </td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <th scope="row" className="px-5 py-4 font-medium text-[var(--text-primary)]">
                    {t("servico.price.maintenance", "Manutenção (opcional)")}
                  </th>
                  <td className="px-5 py-4 text-right font-mono text-[var(--text-primary)]">
                    R$ 490/mês
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-5 py-4 font-medium text-[var(--text-primary)]">
                    {t("servico.price.floor", "Piso (uma integração só)")}
                  </th>
                  <td className="px-5 py-4 text-right font-mono text-[var(--text-primary)]">
                    R$ 900
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            {t(
              "servico.price.note",
              "Diagnóstico em 1 dia, entrega em 48h e 30 dias de ajuste incluídos.",
            )}
          </p>
        </section>

        {/* 7. CTA — formulário existente do portfólio */}
        <section id="contato" aria-labelledby="servico-cta" className="scroll-mt-24">
          <Eyebrow>{t("servico.cta.label", "Próximo passo")}</Eyebrow>
          <h2
            id="servico-cta"
            className="mb-2 text-xl font-bold text-[var(--text-primary)] md:text-2xl"
          >
            {t("servico.cta.title", "Diagnóstico de 20 min, sem custo")}
          </h2>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t(
              "servico.cta.subtitle",
              "Conte qual processo consome mais tempo hoje. Se a automação não fizer sentido para o seu caso, eu digo na hora.",
            )}
          </p>
          <LazyContactForm />
        </section>
      </div>
    </main>
  );
}
