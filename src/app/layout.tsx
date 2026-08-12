import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { CockpitBackground } from "@/components/CockpitBackground";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navbar } from "@/components/Navbar";
import { ConditionalAnalytics } from "@/components/ConditionalAnalytics";
import { Footer } from "@/components/Footer";
import { SupportButton } from "@/components/SupportButton";
import { ConsultingButton } from "@/components/ConsultingButton";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollRestoration } from "@/components/ScrollRestoration";
import { SkipLink } from "@/components/SkipLink";
import { JsonLd } from "@/components/JsonLd";
import { BackToTop } from "@/components/BackToTop";
import { CookieBannerProvider } from "@/components/CookieBanner";
import { MonetizationProvider, AdSense } from "@/components/monetization";
import { MotionConfig } from "framer-motion";
import { ADSENSE_CONFIG } from "@/lib/monetization";
import { SITE_URL } from "@/lib/types";
import "./globals.css";

// Fontes modernas
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Samuel Medeiros — Desenvolvedor Full Stack & Analista de Dados",
    template: "%s | Samuel Medeiros",
  },
  description:
    "Desenvolvedor Full Stack e Analista de Dados com 5+ anos de experiência em Brasília. Next.js, React, TypeScript, FastAPI, PostgreSQL, Docker, Cloudflare, Power BI e RAG/LLMs — transformando dados em decisões estratégicas.",
  keywords: [
    "desenvolvedor full stack",
    "analista de dados",
    "power bi",
    "sql",
    "python",
    "machine learning",
    "business intelligence",
    "dashboards",
    "data analysis",
    "brasília",
    "portfólio",
    "bi",
    "etl",
    "postgresql",
    "azure",
    "next.js",
    "react",
    "typescript",
    "frontend",
    "backend",
    "fastapi",
    "docker",
    "rag",
    "llm",
    "stripe",
    "playwright",
    "cloudflare",
    "tailwind css",
  ],
  authors: [{ name: "Samuel Medeiros", url: "https://samuelmedeiros.vercel.app" }],
  creator: "Samuel Medeiros",
  publisher: "Samuel Medeiros",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    url: "https://samuelmedeiros.vercel.app",
    siteName: "Samuel Medeiros",
    title: "Samuel Medeiros — Desenvolvedor Full Stack & Analista de Dados",
    description:
      "Desenvolvedor Full Stack e Analista de Dados com 5+ anos de experiência. Next.js, React, TypeScript, FastAPI, PostgreSQL, Docker, Cloudflare, Power BI e RAG/LLMs.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Samuel Medeiros — Portfólio Profissional | Full Stack & Dados",
      },
    ],
    countryName: "Brazil",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Samuelfmedeiros",
    creator: "@Samuelfmedeiros",
    title: "Samuel Medeiros — Desenvolvedor Full Stack & Analista de Dados",
    description: "Desenvolvedor Full Stack e Analista de Dados. Next.js, React, TypeScript, FastAPI, PostgreSQL, Docker, Cloudflare, Power BI, RAG/LLMs. Brasília/DF.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://samuelmedeiros.vercel.app",
    languages: {
      "pt-BR": "https://samuelmedeiros.vercel.app",
      "en-US": "https://samuelmedeiros.vercel.app/en",
    },
  },
  verification: {
    // SEO verification codes — preencher com valores reais se aplicável
    // google: "your-code",
    // yandex: "your-code",
    // other: { "msvalidate.01": "your-code" },
  },
  other: {
    "article:author": SITE_URL,
    "article:section": "Portfolio",
    "article:tag": "desenvolvimento, tecnologia, portfólio, dados, fullstack",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Inline script: theme FOUC prevention — must run before first paint */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('mc-theme')||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');if(t==='light'||t==='dark')document.documentElement.classList.add('theme-'+t);var p=localStorage.getItem('mc-palette'),P={'cyan':{dk:'#22d3ee',lt:'#0284c7',ad:'#6366f1',al:'#4338ca'},'emerald':{dk:'#34d399',lt:'#059669',ad:'#818cf8',al:'#4f46e5'},'violet':{dk:'#a78bfa',lt:'#7c3aed',ad:'#f472b6',al:'#db2777'},'amber':{dk:'#fbbf24',lt:'#d97706',ad:'#fb923c',al:'#ea580c'},'rose':{dk:'#fb7185',lt:'#e11d48',ad:'#a78bfa',al:'#7c3aed'},'blue':{dk:'#60a5fa',lt:'#2563eb',ad:'#34d399',al:'#059669'}};if(p&&P[p]){var l=t==='light';document.documentElement.style.setProperty('--accent',l?P[p].lt:P[p].dk);document.documentElement.style.setProperty('--accent-alt',l?P[p].al:P[p].ad)}}catch(e){}})()`}} />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f8fafc" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#020617" />
        {/* Cache control no documento — reforça os headers (mobile Chrome pode
            restaurar aba do bfcache e mostrar versão velha sem buscar na rede) */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        {/* Aba restaurada do bfcache → recarrega sozinha pra sempre ver a versão nova */}
        <script dangerouslySetInnerHTML={{
          __html: `window.addEventListener('pageshow',function(e){if(e.persisted)location.reload()})`
        }} />
        <ScrollRestoration />
        {/* Umami carregado dinamicamente pelo CookieBanner pós-consentimento */}
      </head>
      <body className="relative min-h-screen antialiased" style={{ backgroundColor: 'var(--bg-primary, #020617)', touchAction: 'manipulation' } as React.CSSProperties}>
        <SkipLink />
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
          <LanguageProvider>
            <CookieBannerProvider>
            <MonetizationProvider>
              <ConditionalAnalytics />
              <CockpitBackground />
                <ScrollProgress />
                <Navbar />
                <main id="main-content" tabIndex={-1} className="pt-20 md:pt-24">
                  <ErrorBoundary>{children}</ErrorBoundary>
                </main>
                {/* AdSense banner — só aparece quando configurado no .env local */}
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
                  <AdSense slot={ADSENSE_CONFIG.footerSlot || "footer"} format="horizontal" className="min-h-[90px]" />
                </div>
                <div className="flex flex-wrap justify-center gap-4 px-4 pb-6">
                  <SupportButton />
                  <ConsultingButton />
                </div>
                <Footer />
            </MonetizationProvider>
          </CookieBannerProvider>
          </LanguageProvider>
          </MotionConfig>
        </ThemeProvider>
        <JsonLd />
        <BackToTop />

        {/* Google AdSense — loaded conditionally by AdSense component based on consent */}
      </body>
    </html>
  );
}