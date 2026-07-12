import { SITE_URL } from "@/lib/types";
import { STATIC_PROJECTS, FEATURED_PROJECTS } from "@/lib/staticProjects";

export function JsonLd() {
  const projects = STATIC_PROJECTS.filter((p) =>
    FEATURED_PROJECTS.includes(p.name)
  );

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Samuel Medeiros",
    givenName: "Samuel",
    familyName: "Medeiros",
    alternateName: "Samuel Andrade Medeiros",
    jobTitle: "Desenvolvedor Full Stack & Analista de Dados",
    url: SITE_URL,
    email: "samuelandrademedeiros@gmail.com",
    telephone: "+55-61-99999-9999",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brasília",
      addressRegion: "DF",
      addressCountry: "BR",
    },
    birthDate: "1997-05-19",
    nationality: {
      "@type": "Country",
      name: "Brazil",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidade de Brasília",
    },
    knowsLanguage: [
      {
        "@type": "Language",
        name: "Portuguese",
        alternateName: "pt-BR",
      },
      {
        "@type": "Language",
        name: "English",
        alternateName: "en",
      },
    ],
    sameAs: [
      "https://github.com/Samuelfmedeiros",
      "https://linkedin.com/in/samuelandrademedeiros",
      "https://lifelog-sepia.vercel.app",
      "https://x.com/Samuelfmedeiros",
      "https://wa.me/5561999999999",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "SQL",
      "Power BI",
      "Machine Learning",
      "Cloudflare Workers",
      "PostgreSQL",
      "GitHub Actions",
      "CI/CD",
      "LLMs",
      "Business Intelligence",
      "Data Analysis",
    ],
    description:
      "Desenvolvedor Full Stack com 5+ anos de experiência. Especializado em React, Next.js, TypeScript, Python e Cloudflare. Transformando dados em decisões estratégicas.",
    image: `${SITE_URL}/opengraph-image`,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: "Samuel Medeiros — Portfólio",
    alternateName: "Samuel Medeiros Portfolio",
    description:
      "Portfólio profissional de Samuel Medeiros — Desenvolvedor Full Stack & Analista de Dados. Projetos, habilidades e contato.",
    inLanguage: ["pt-BR", "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: project.name,
        description: project.description,
        url: project.homepage || project.html_url || `${SITE_URL}/#projects`,
        applicationCategory: project.topics.includes("game")
          ? "GameApplication"
          : "WebApplication",
        operatingSystem: "Web",
        author: {
          "@type": "Person",
          name: "Samuel Medeiros",
          url: SITE_URL,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "BRL",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
        suppressHydrationWarning
      />
    </>
  );
}
