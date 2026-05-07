import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Navbar } from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://samuelandrade.dev"),
  title: "Mission Control | Samuel Andrade",
  description: "Portfólio profissional — Analista de Dados & Produto. BI, SQL, Machine Learning.",
  keywords: ["analista de dados", "BI", "SQL", "machine learning", "portfolio", "next.js"],
  authors: [{ name: "Samuel Andrade" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Mission Control | Samuel Andrade",
    description: "Analista de Dados & Produto — Portfólio Interativo",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#22d3ee" />
        <JsonLd />
      </head>
      <body className="relative min-h-screen antialiased">
        <SkipLink />
        <ThemeProvider>
          <AnalyticsTracker />
          <ParallaxBackground />
          <Navbar />
          <main id="main-content"><ErrorBoundary>{children}</ErrorBoundary></main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
