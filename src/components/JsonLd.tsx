export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Samuel Medeiros",
    jobTitle: "Desenvolvedor Full Stack",
    url: "https://samuelmedeiros.vercel.app",
    email: "samuelandrademedeiros@gmail.com",
    sameAs: [
      "https://github.com/Samuelfmedeiros",
      "https://linkedin.com/in/samuelandrademedeiros",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Supabase",
      "Tailwind",
      "Framer Motion",
      "Node.js",
      "PostgreSQL",
      "Cloudflare Workers",
      "IA Generativa",
      "LLMs Locais",
      "Ollama",
      "GitHub Actions",
      "Vercel",
      "CI/CD",
    ],
    description:
      "Desenvolvedor Full Stack com 5+ anos de experiência. Especializado em React, Next.js, TypeScript, Supabase e Cloudflare. Portfólio profissional interativo.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  );
}
