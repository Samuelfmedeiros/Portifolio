"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { PalettePicker } from "./PalettePicker";
import { useLanguage } from "@/lib/i18n";

const NAV_ITEMS = [
  { href: "#profile", key: "nav.home", icon: "" },
  { href: "#jornada", key: "nav.journey", icon: "" },
  { href: "#projects", key: "nav.projects", icon: "" },
  { href: "#blog", key: "nav.blog", icon: "" },
  { href: "#contact", key: "nav.contact", icon: "" },
  { href: "#games", key: "nav.games", icon: "" },
];

import { useAnalytics } from "@/hooks/useAnalytics";
import type { SectionName } from "@/hooks/useAnalytics";

export const Navbar = memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const scrollRef = useRef<HTMLUListElement>(null);
  const { track } = useAnalytics();
  const { t } = useLanguage();

  const rafRef = useRef<number | null>(null);
  const navigatingRef = useRef(false);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Geração do clique: invalida settles de cliques anteriores (rapid clicks).
  const navGenRef = useRef(0);
  // Usuário tomou controle do scroll (wheel/touch/teclado) durante o pouso —
  // o settle NÃO deve puxar o scroll de volta pro alvo.
  const interruptedRef = useRef(false);
  const targetTopRef = useRef(0);
  // Referência ao <nav> para o scroll spy medir a altura real da barra fixa
  // (mobile tem duas fileiras: 96px; desktop 65px) sem chutar constante.
  const navRef = useRef<HTMLElement | null>(null);

  // Scroll detection — requestAnimationFrame throttle
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        rafRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Interrupção do usuário durante o pouso: wheel/touch/teclado = usuário
  // tomou controle do scroll. O settle (correção de drift) NÃO deve lutar
  // contra ele puxando o scroll de volta pro alvo.
  useEffect(() => {
    const onUserInterrupt = () => {
      interruptedRef.current = true;
    };
    window.addEventListener("wheel", onUserInterrupt, { passive: true });
    window.addEventListener("touchmove", onUserInterrupt, { passive: true });
    window.addEventListener("keydown", onUserInterrupt);
    return () => {
      window.removeEventListener("wheel", onUserInterrupt);
      window.removeEventListener("touchmove", onUserInterrupt);
      window.removeEventListener("keydown", onUserInterrupt);
    };
  }, []);

  // Scroll spy — a seção ativa é a ÚLTIMA cujo topo já cruzou a linha de
  // referência (topo + offset). Regra geométrica, não razão de visibilidade.
  //
  // 🔴 Regressão medida 08/11/2026 (relatada como "estou na sessão blog mas a
  // navbar marca a de cima"): a versão anterior escolhia pelo
  // `intersectionRatio`/maior área visível. Isso favorece seções ALTAS: com
  // #profile medindo 2966px e #blog 434px, ao chegar em #blog o ratio de
  // #profile ainda era maior e a navbar continuava marcando a seção anterior
  // (medido: em #blog a navbar marcava #contact; em #contact marcava #games —
  // trocava pelo motivo errado). Razão de área compara tamanhos diferentes;
  // posição de topo não.
  //
  // Também removido o gate `if (navigatingRef.current) return;`: ele deixava a
  // navbar travada na seção de origem quando o usuário clicava e o observer
  // pausava durante o scroll suave.
  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.href.replace("#", ""));
    let alive = true;
    let raf = 0;

    const computeActive = () => {
      if (!alive) return;
      // Linha de referência: logo abaixo da navbar fixa, para que a seção
      // "ativa" seja a que está de fato ocupando o topo da tela.
      // Fallback 64: em jsdom (e antes do 1º layout) a altura medida é 0, o
      // que jogaria a linha para y=24 e faria a seção mais alta vencer sempre.
      const measured = navRef.current?.getBoundingClientRect().height ?? 0;
      const navH = measured > 0 ? measured : 64;
      const probeY = navH + 24;
      const viewH = window.innerHeight;

      let active = ids[0];
      let bestTop = -Infinity;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Seção já começou (topo acima da linha) e ainda não terminou
        // (fundo abaixo do topo da viewport): é candidata.
        if (rect.top <= probeY && rect.bottom > probeY) {
          if (rect.top > bestTop) {
            bestTop = rect.top;
            active = id;
          }
        }
      }

      // Fim da página: quando o último trecho está visível e o scroll chegou no
      // limite, marca a última seção (senão "games" nunca acenderia, porque a
      // página acaba antes do topo dela cruzar a linha de referência).
      // Guarda obrigatória: só faz sentido quando a página REALMENTE rola
      // (scrollHeight > viewport). Sem ela, ambiente com scrollHeight 0 (jsdom,
      // página em branco) satisfazia a condição sempre e marcava a última seção.
      const scrollable = document.documentElement.scrollHeight - viewH;
      const atBottom = scrollable > 4 && window.scrollY >= scrollable - 4;
      if (atBottom) {
        for (let i = ids.length - 1; i >= 0; i--) {
          if (document.getElementById(ids[i])) { active = ids[i]; break; }
        }
      }

      setActiveSection((prev) => (prev === active ? prev : active));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        computeActive();
      });
    };

    computeActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Recalcula quando o layout muda (imagens/fonte carregando empurram seções)
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : null;
    if (ro) ro.observe(document.body);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro?.disconnect();
      if (navTimeoutRef.current !== null) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    // Nova geração de clique — invalida settles/listeners pendentes de
    // cliques anteriores (rapid clicks ou scrollend atrasado).
    const gen = ++navGenRef.current;
    interruptedRef.current = false;

    // Cancel any pending nav timeout from a previous rapid click
    if (navTimeoutRef.current !== null) {
      clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = null;
    }

    // Analitico do clique ANTES de qualquer ramificacao: o ramo `#hero`
    // (logo / nav.home) retorna cedo e perdia o evento — clicar no home
    // navegava sem registrar. Regressao fixada por Navbar.test.tsx
    const sectionId = href.replace("#", "");
    track({ type: "nav_click" as const, section: sectionId as SectionName });

    // Cancel in-progress smooth scroll so animations don't pile up
    window.scrollTo({ top: window.scrollY, behavior: "instant" });

    const target = document.querySelector(href);
    if (href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("profile");
      return;
    }
    if (target) {
      // offsetTop acumulado NÃO inclui transform (animação FadeInSection);
      // scroll-padding lido do CSS = fonte única do offset (mobile 112px / desktop 80px)
      const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80;
      let offsetTop = 0;
      let node: HTMLElement | null = target as HTMLElement;
      while (node) {
        offsetTop += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      const top = Math.max(0, offsetTop - scrollPadding);
      targetTopRef.current = top;
      setActiveSection(sectionId);
      navigatingRef.current = true;
      window.scrollTo({ top, behavior: "smooth" });

      // Re-mede após o layout assentar (animações/imagens podem empurrar o alvo):
      // espera o evento scrollend (fim real do scroll suave) e corrige o desvio
      // residual em até 3 tentativas. Guardas:
      //  - gen: clique antigo (rapid clicks / scrollend atrasado) — ignora
      //  - interruptedRef: usuário rolou/tocou/teclou durante o pouso — NÃO lutar
      //  - distância: usuário está longe do alvo (navegou pra outro ponto) — não é drift
      const settle = (attempt: number) => {
        if (navGenRef.current !== gen) return;
        navigatingRef.current = false;
        if (href === "#profile") return;
        const el = document.querySelector(href);
        if (!el) return;
        if (interruptedRef.current) return;
        if (Math.abs(window.scrollY - targetTopRef.current) > 120) return;
        const currentTop = el.getBoundingClientRect().top;
        const cs = getComputedStyle(document.documentElement).scrollPaddingTop;
        const sp = parseFloat(cs) || 80;
        const drift = currentTop - sp;
        if (Math.abs(drift) > 20 && attempt < 3) {
          window.scrollTo({ top: window.scrollY + drift, behavior: "smooth" });
          const onEnd = () => {
            window.removeEventListener("scrollend", onEnd);
            settle(attempt + 1);
          };
          window.addEventListener("scrollend", onEnd);
          setTimeout(() => {
            window.removeEventListener("scrollend", onEnd);
            settle(attempt + 1);
          }, 1200);
        }
      };
      const onFirstEnd = () => {
        window.removeEventListener("scrollend", onFirstEnd);
        settle(0);
      };
      window.addEventListener("scrollend", onFirstEnd);
      navTimeoutRef.current = setTimeout(() => {
        window.removeEventListener("scrollend", onFirstEnd);
        settle(0);
      }, 2500);

    }
  };

  const activeId = activeSection;

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-lg shadow-[var(--shadow)]"
          : "bg-[var(--bg-primary)]/60 backdrop-blur-sm border-b border-[var(--border)]/30"
      }`}
      role="navigation"
      aria-label={t("nav.aria.main")}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="font-mono text-xs sm:text-sm md:text-base tracking-wider text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <span>Samuel Medeiros</span>
          </motion.a>

          {/* Desktop Nav — horizontal with glass effect */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.href.replace("#", "");
              return (
                <li key={item.href}>
                  <motion.a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium border backdrop-blur-md transition-all ${
                      isActive
                        ? "bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)] shadow-[0_0_18px_-4px_var(--accent)]"
                        : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
                    }`}
                    whileHover={isActive ? undefined : { y: -1 }}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {t(item.key)}
                  </motion.a>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <a
              href="https://github.com/Samuelfmedeiros"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="GitHub"
              onClick={() => track({ type: "external_link", url: "github-nav", label: "GitHub Nav" })}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <PalettePicker />
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Nav — horizontal scrollable, NO hamburger */}
        <ul
          ref={scrollRef}
          className="lg:hidden flex items-center gap-0.5 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x snap-mandatory"
          aria-label={t("nav.aria.mobile")}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.href.replace("#", "");
            return (
              <li key={item.href} className="shrink-0 snap-start">
                <motion.a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium border backdrop-blur-md transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)]"
                      : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]"
                  }`}
                  whileTap={{ scale: 0.95 }}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{t(item.key)}</span>
                </motion.a>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
});
