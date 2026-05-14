import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { AppWrapper } from "@/components/AppWrapper";
import { Navbar } from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SkipLink } from "@/components/SkipLink";
import { JsonLd } from "@/components/JsonLd";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://samuelmedeiros.vercel.app"),
  title: {
    default: "Samuel Medeiros — Analista de Dados",
    template: "%s | Samuel Medeiros",
  },
  description:
    "Analista de Dados com 5+ anos de experiência em Brasília. Power BI, SQL, Python, Machine Learning para transformar dados em decisões estratégicas.",
  keywords: [
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
    title: "Samuel Medeiros — Analista de Dados",
    description:
      "Analista de Dados com 5+ anos de experiência em Brasília. Power BI, SQL, Python, Machine Learning.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Samuel Medeiros — Analista de Dados",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Samuel Medeiros",
      },
    ],
    videos: [],
    emails: "samuelandrademedeiros@gmail.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Samuelfmedeiros",
    creator: "@Samuelfmedeiros",
    title: "Samuel Medeiros — Analista de Dados",
    description: "Analista de Dados. Power BI, SQL, Python, Machine Learning. Brasília/DF.",
    images: ["/og-image.png"],
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
    notAllowed: [],
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
  metadataDatabase: {
    issuer: "https://samuelmedeiros.vercel.app",
  },
  appLinks: {
    ios: {
      url: "https://samuelmedeiros.vercel.app",
      app_store_id: "123456789",
    },
    android: {
      package: "com.samuelmedeiros.portfolio",
      app_name: "Samuel Medeiros",
    },
    web: {
      url: "https://samuelmedeiros.vercel.app",
      should_fallback: true,
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
  category: "technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f8fafc" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#020617" />
      </head>
      <body className="relative min-h-screen antialiased">
        <SkipLink />
        <ThemeProvider>
          <AnalyticsTracker />
          <AppWrapper>
            <ParallaxBackground />
            <ScrollProgress />
            <Navbar />
            <main id="main-content">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
          </AppWrapper>
        </ThemeProvider>
        <KeyboardShortcuts />
        <JsonLd />
      </body>
    </html>
  );
}