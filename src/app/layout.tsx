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
    default: "Samuel Medeiros — Desenvolvedor Full Stack",
    template: "%s | Samuel Medeiros",
  },
  description:
    "Desenvolvedor Full Stack com 5+ anos de experiência. React, Next.js, TypeScript, Supabase, Cloudflare e integrações com IA.",
  keywords: [
    "desenvolvedor full stack",
    "react",
    "next.js",
    "typescript",
    "supabase",
    "cloudflare",
    "tailwind",
    "framer motion",
    "node.js",
    "postgres",
    "cloudflare workers",
    "ia",
    "llm",
    "brasília",
    "portfólio",
  ],
  authors: [{ name: "Samuel Medeiros", url: "https://samuelmedeiros.vercel.app" }],
  creator: "Samuel Medeiros",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://samuelmedeiros.vercel.app",
    siteName: "Samuel Medeiros",
    title: "Samuel Medeiros — Desenvolvedor Full Stack",
    description:
      "Desenvolvedor Full Stack com 5+ anos de experiência. React, Next.js, TypeScript, Supabase, Cloudflare e integrações com IA.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Samuel Medeiros — Desenvolvedor Full Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samuel Medeiros — Desenvolvedor Full Stack",
    description: "Desenvolvedor Full Stack. React, Next.js, TypeScript, Supabase, Cloudflare.",
    images: ["/og-image.png"],
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