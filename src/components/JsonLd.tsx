export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Samuel Medeiros",
    jobTitle: "Analista de Dados e Produto",
    url: "https://samuelmedeiros.vercel.app",
    email: "samuelandrademedeiros@gmail.com",
    sameAs: [
      "https://github.com/Samuelfmedeiros",
      "https://linkedin.com/in/samuelandrade",
    ],
    knowsAbout: [
      "Data Analysis",
      "Business Intelligence",
      "SQL",
      "Python",
      "Machine Learning",
      "Next.js",
      "IA Generativa",
      "LLMs Locais",
    ],
    description:
      "Analista de Dados e Produto especializado em BI, SQL, Python, Machine Learning e IA Generativa. Portfólio profissional interativo.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
