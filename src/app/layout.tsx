import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CockpitBackground } from "@/components/CockpitBackground";
import { AppWrapper } from "@/components/AppWrapper";
import { Navbar } from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ConditionalAnalytics } from "@/components/ConditionalAnalytics";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SkipLink } from "@/components/SkipLink";
import { JsonLd } from "@/components/JsonLd";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { BackToTop } from "@/components/BackToTop";
import { CookieBannerProvider, useAnalyticsConsent } from "@/components/CookieBanner";
import { MonetizationProvider, AdSense } from "@/components/monetization";
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
    "Desenvolvedor Full Stack e Analista de Dados com 5+ anos de experiência em Brasília. Next.js, React, Python, SQL, Power BI, Machine Learning — transformando dados em decisões estratégicas.",
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
    "supabase",
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
      "Desenvolvedor Full Stack e Analista de Dados com 5+ anos de experiência. Next.js, React, Python, SQL, Power BI, Machine Learning.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Samuel Medeiros — Analista de Dados",
      },
    ],
    videos: [],
    emails: "samuelandrademedeiros@gmail.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Samuelfmedeiros",
    creator: "@Samuelfmedeiros",
    title: "Samuel Medeiros — Desenvolvedor Full Stack & Analista de Dados",
    description: "Desenvolvedor Full Stack e Analista de Dados. Next.js, Python, SQL, Power BI, Machine Learning. Brasília/DF.",
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
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    other: {
      "msvalidate.01": "bing-site-verification-code",
    },
  },
  other: {
    "article:author": "https://samuelmedeiros.vercel.app",
    "article:section": "Portfolio",
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
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f8fafc" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#020617" />
        {/* Theme + scroll restoration — critical, must run before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('mc-theme');
                  if (!t) {
                    t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  }
                  document.documentElement.classList.add(t === 'dark' ? 'theme-dark' : 'theme-light');
                  // Restore palette accent colors to prevent FOUC
                  var p = localStorage.getItem('mc-palette');
                  if (p) {
                    var palettes = {"cyan":["#22d3ee","#0284c7","#6366f1","#4338ca"],"emerald":["#34d399","#059669","#818cf8","#4f46e5"],"violet":["#a78bfa","#7c3aed","#f472b6","#db2777"],"amber":["#fbbf24","#d97706","#fb923c","#ea580c"],"rose":["#fb7185","#e11d48","#a78bfa","#7c3aed"],"blue":["#60a5fa","#2563eb","#34d399","#059669"]};
                    var c = palettes[p];
                    if (c) {
                      var d = t === 'dark' ? 0 : 1;
                      document.documentElement.style.setProperty('--accent', c[d]);
                      document.documentElement.style.setProperty('--accent-alt', c[d+2]);
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                  }
                  window.scrollTo(0, 0);
                  var st = function(){ window.scrollTo(0, 0); };
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', st);
                  }
                  window.addEventListener('load', function(){ window.scrollTo(0, 0); });
                  var c = 0, iv = setInterval(function(){
                    window.scrollTo(0, 0);
                    if (++c > 20) clearInterval(iv);
                  }, 25);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="relative min-h-screen antialiased">
        <SkipLink />
        <ThemeProvider>
          <CookieBannerProvider>
            <MonetizationProvider>
              <ConditionalAnalytics />
              <AppWrapper>
                <CockpitBackground />
                <ScrollProgress />
                <Navbar />
                <main id="main-content" className="pt-20 md:pt-24">
                  <ErrorBoundary>{children}</ErrorBoundary>
                </main>
                {/* AdSense banner — só aparece quando configurado no .env.local */}
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
                  <AdSense slot="footer" format="horizontal" className="min-h-[90px]" />
                </div>
                <Footer />
              </AppWrapper>
            </MonetizationProvider>
          </CookieBannerProvider>
        </ThemeProvider>
        <KeyboardShortcuts />
        <JsonLd />
        <BackToTop />

        {/* Third-party scripts — loaded after hydration to prevent hydration errors */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5928931854509344"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://fundingchoicesmessages.google.com/i/pub-5928931854509344?ers=1"
          strategy="afterInteractive"
        />
        <Script
          id="google-cmp-iframe"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){function g(){if(!window.frames['googlefcPresent']){if(document.body){const a=document.createElement('iframe');a.style='width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px';a.style.display='none';a.name='googlefcPresent';document.body.appendChild(a)}else setTimeout(g,0)}}g()})();`,
          }}
        />
      </body>
    </html>
  );
}