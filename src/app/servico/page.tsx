import type { Metadata } from "next";
import { SITE_URL } from "@/lib/types";
import { ServicoContent } from "@/components/ServicoContent";

/**
 * /servico — oferta de automação com IA.
 *
 * Página server só para o `metadata` (title/description/canonical/OG); o corpo
 * é client porque o texto é bilíngue e o dicionário só é acessível por hook.
 * Herda o `opengraph-image.tsx` da raiz, então não declara imagem própria.
 */
const TITLE = "Automação com IA em 48h";
const DESCRIPTION =
  "Instalo uma automação com IA que roda sozinha no seu negócio em 48h: diagnóstico em 1 dia, entrega em 48h e 30 dias de ajuste incluídos. Implantação R$ 1.900, manutenção opcional R$ 490/mês.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/servico` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/servico`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Samuel Medeiros",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ServicoPage() {
  return <ServicoContent />;
}
