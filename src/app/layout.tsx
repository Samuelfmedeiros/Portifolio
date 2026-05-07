import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Navbar } from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mission Control | Samuel Andrade",
  description: "Portfólio profissional — Analista de Dados & Produto. BI, SQL, Machine Learning.",
  keywords: ["analista de dados", "BI", "SQL", "machine learning", "portfolio", "next.js"],
  authors: [{ name: "Samuel Andrade" }],
  openGraph: {
    title: "Mission Control | Samuel Andrade",
    description: "Analista de Dados & Produto — Portfólio Interativo",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="relative min-h-screen antialiased">
        <ThemeProvider>
          <AnalyticsTracker />
          <ParallaxBackground />
          <Navbar />
          <main><ErrorBoundary>{children}</ErrorBoundary></main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
