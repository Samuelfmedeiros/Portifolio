import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ParallaxBackground } from "@/components/ParallaxBackground";
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
    "Analista de Dados em Brasília. Power BI, SQL, Python, Machine Learning e ETL. Transformando dados em decisões estratégicas.",
  keywords: [
    "analista de dados",
    "BI",
    "SQL",
    "machine learning",
    "power bi",
    "python",
    "brasília",
    "portfólio",
    "data analyst",
    "ETL",
    "dashboard",
    "IA",
  ],
  authors: [{ name: "Samuel Medeiros", url: "https://samuelmedeiros.vercel.app" }],
  creator: "Samuel Medeiros",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://samuelmedeiros.vercel.app",
    siteName: "Samuel Medeiros",
    title: "Samuel Medeiros — Analista de Dados",
    description:
      "Analista de Dados em Brasília. Power BI, SQL, Python, Machine Learning e ETL.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samuel Medeiros — Analista de Dados",
    description: "Dashboards, SQL, Python e Machine Learning.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
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
          <ParallaxBackground />
          <ScrollProgress />
          <Navbar />
          <main id="main-content">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <Footer />
        </ThemeProvider>
        <KeyboardShortcuts />
        <JsonLd />
      </body>
    </html>
  );
}