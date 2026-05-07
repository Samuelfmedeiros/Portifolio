export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Samuel Andrade",
    jobTitle: "Analista de Dados e Produto",
    url: "https://samuelandrade.dev",
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
    ],
    description:
      "Analista de Dados e Produto especializado em BI, SQL, Python e Machine Learning. Portfólio profissional interativo.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
