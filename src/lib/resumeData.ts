// Fonte de dados imutável do CV — usada pelo Resume Tailor AI.
// Parse manual do docs/cv/pt.md + docs/cv/en.md (fonte de verdade).
// REGRA: NUNCA inventar empresas, cargos, datas ou skills. Só estes dados
// entram no prompt da IA (hard constraints).

export interface ResumeExperience {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface ResumeData {
  name: string;
  role: string;
  contact: {
    location: string;
    phone: string;
    email: string;
    linkedin: string;
    site: string;
    github: string;
  };
  objective: string;
  summary: string;
  experiences: ResumeExperience[];
  education: string[];
  skills: string[];
  /** Competências-chave mapeadas da vaga (chips no header do PDF). Opcional. */
  highlights?: string[];
}

const PT: ResumeData = {
  name: "Samuel Andrade Fonseca de Medeiros",
  role: "Analista de Dados & Desenvolvedor Full Stack",
  contact: {
    location: "Brasília-DF",
    phone: "(61) 99119-1722",
    email: "samuelandrademedeiros@gmail.com",
    linkedin: "https://www.linkedin.com/in/samuelandrademedeiros",
    site: "https://samuelmedeiros.vercel.app",
    github: "https://github.com/Samuelfmedeiros",
  },
  objective:
    "Analista de Dados e Produto | Criação de Dashboards e Insights Estratégicos | BI e Performance",
  summary:
    "Profissional de Tecnologia da Informação com experiência em análise de dados e desenvolvimento full stack. Atuação na criação de dashboards em Power BI, consultas em SQL e automação de rotinas com Python, além do desenvolvimento de plataformas web completas com React, Next.js e FastAPI. Experiência com integração de APIs e pagamentos, bancos de dados relacionais, infraestrutura em Docker e Cloudflare, e aplicações com LLMs locais e RAG. Conhecimentos em Ciência de Dados (Data Science) e Machine Learning aplicados à análise e interpretação de dados.",
  experiences: [
    {
      title: "Desenvolvedor Full Stack & Analista de Dados",
      company: "Freelancer",
      period: "2025 – Atual",
      bullets: [
        "Desenvolvimento e manutenção de plataformas web completas (frontend e backend) com React, Next.js, TypeScript e FastAPI",
        "Criação de dashboards interativos e pipelines de dados com Power BI, SQL e Python",
        "Integração de pagamentos com Stripe Connect e autenticação segura (JWT, 2FA)",
        "Construção de sistemas de extração de dados (web scraping) com busca semântica RAG e LLMs locais",
        "Infraestrutura e deploy com Docker, Cloudflare (Tunnel, Pages, R2, D1) e CI/CD (GitHub Actions)",
        "Automação de testes E2E e unitários com Playwright, Vitest e pytest — mais de 2.000 testes automatizados",
        "Cinco projetos web em produção, incluindo marketplace, plataforma de dados e blog bilíngue",
      ],
    },
    {
      title: "Analista de Dados",
      company: "Agência Nacional de Águas (ANA)",
      period: "2025",
      bullets: [
        "Análise e tratamento de dados de sistemas hídricos para geração de insights",
        "Criação de dashboards em Power BI com indicadores estratégicos",
        "Automação de rotinas de coleta e processamento com Python e SQL",
        "Manipulação e consultas otimizadas em banco de dados",
        "Suporte técnico às áreas internas",
      ],
    },
    {
      title: "Técnico de Suporte N1",
      company: "Global Hitss",
      period: "2024 – 2025",
      bullets: [
        "Diagnóstico e solução de problemas em hardware, software e redes",
        "Monitoramento de sistemas e processos de TI",
        "Apoio em formatação, backup e manutenção de sistemas",
        "Atendimento técnico a usuários via telefone, e-mail e chat",
        "Utilização de Microsoft Azure e Microsoft 365",
      ],
    },
    {
      title: "Auxiliar Técnico",
      company: "Freelancer",
      period: "2021 – 2023",
      bullets: [
        "Instalação, configuração e manutenção de computadores, impressoras e periféricos",
        "Suporte técnico presencial e remoto a usuários (hardware e software)",
        "Implantação de sistemas e novas tecnologias",
        "Gestão de usuários e permissões (Office 365, Active Directory)",
      ],
    },
  ],
  education: [
    "Pós-graduação em Ciência de Dados e Big Data Analytics — Centro Universitário IESB (em andamento)",
    "Graduação em Análise e Desenvolvimento de Sistemas — Centro Universitário IESB",
  ],
  skills: [
    "Programação e Automação: Python (FastAPI, automação, ETL, web scraping, pandas), JavaScript/TypeScript (React, Next.js, Node.js), integração de APIs REST, automação de processos",
    "Banco de Dados e BI: PostgreSQL, SQL Server, SQLite, Power BI, Power Query, DAX, Excel, ETL, transformação e integração de dados (JSON, XML)",
    "Data & Machine Learning: TensorFlow, R, PyTorch, Hadoop, Spark, modelagem e análise de dados, LLMs locais (Ollama), RAG semântico, MCP",
    "DevOps e Infraestrutura: Docker, Cloudflare (Tunnel, Pages, R2, D1), Linux, CI/CD (GitHub Actions), Git, GitHub, GitLab",
    "Testes e Qualidade: Playwright, Vitest, pytest, testes E2E e unitários",
  ],
};

// EN — versão em inglês do CV (base docs/cv/en.md)
const EN: ResumeData = {
  name: "Samuel Andrade Fonseca de Medeiros",
  role: "Data Analyst & Full Stack Developer",
  contact: {
    location: "Brasília-DF, Brazil",
    phone: "+55 (61) 99119-1722",
    email: "samuelandrademedeiros@gmail.com",
    linkedin: "https://www.linkedin.com/in/samuelandrademedeiros",
    site: "https://samuelmedeiros.vercel.app",
    github: "https://github.com/Samuelfmedeiros",
  },
  objective:
    "Data & Product Analyst | Dashboards and Strategic Insights | BI and Performance",
  summary:
    "IT professional with experience in data analysis and full stack development. Experienced in building Power BI dashboards, writing SQL queries, and automating routines with Python, plus developing complete web platforms with React, Next.js and FastAPI. Experience with API and payment integrations, relational databases, Docker and Cloudflare infrastructure, and applications with local LLMs and RAG. Knowledge of Data Science and Machine Learning applied to data analysis and interpretation.",
  experiences: [
    {
      title: "Full Stack Developer & Data Analyst",
      company: "Freelancer",
      period: "2025 – Present",
      bullets: [
        "Development and maintenance of complete web platforms (frontend and backend) with React, Next.js, TypeScript and FastAPI",
        "Creation of interactive dashboards and data pipelines with Power BI, SQL and Python",
        "Payment integration with Stripe Connect and secure authentication (JWT, 2FA)",
        "Building data extraction systems (web scraping) with semantic RAG search and local LLMs",
        "Infrastructure and deployment with Docker, Cloudflare (Tunnel, Pages, R2, D1) and CI/CD (GitHub Actions)",
        "E2E and unit test automation with Playwright, Vitest and pytest — over 2,000 automated tests",
        "Five web projects in production, including marketplace, data platform and bilingual blog",
      ],
    },
    {
      title: "Data Analyst",
      company: "National Water Agency (ANA)",
      period: "2025",
      bullets: [
        "Analysis and processing of water systems data to generate insights",
        "Creation of Power BI dashboards with strategic indicators",
        "Automation of collection and processing routines with Python and SQL",
        "Optimized database manipulation and queries",
        "Technical support to internal areas",
      ],
    },
    {
      title: "N1 Support Technician",
      company: "Global Hitss",
      period: "2024 – 2025",
      bullets: [
        "Diagnosis and resolution of hardware, software and network issues",
        "Monitoring of IT systems and processes",
        "Support in formatting, backup and system maintenance",
        "Technical support to users via phone, email and chat",
        "Use of Microsoft Azure and Microsoft 365",
      ],
    },
    {
      title: "Technical Assistant",
      company: "Freelancer",
      period: "2021 – 2023",
      bullets: [
        "Installation, configuration and maintenance of computers, printers and peripherals",
        "On-site and remote technical support to users (hardware and software)",
        "System implementation and new technologies",
        "User and permission management (Office 365, Active Directory)",
      ],
    },
  ],
  education: [
    "Postgraduate in Data Science and Big Data Analytics — IESB University Center (in progress)",
    "Bachelor's Degree in Systems Analysis and Development — IESB University Center",
  ],
  skills: [
    "Programming and Automation: Python (FastAPI, automation, ETL, web scraping, pandas), JavaScript/TypeScript (React, Next.js, Node.js), REST API integration, process automation",
    "Database and BI: PostgreSQL, SQL Server, SQLite, Power BI, Power Query, DAX, Excel, ETL, data transformation and integration (JSON, XML)",
    "Data & Machine Learning: TensorFlow, R, PyTorch, Hadoop, Spark, data modeling and analysis, local LLMs (Ollama), semantic RAG, MCP",
    "DevOps and Infrastructure: Docker, Cloudflare (Tunnel, Pages, R2, D1), Linux, CI/CD (GitHub Actions), Git, GitHub, GitLab",
    "Testing and Quality: Playwright, Vitest, pytest, E2E and unit testing",
  ],
};

export function getResumeData(locale: "pt" | "en" = "pt"): ResumeData {
  return locale === "en" ? EN : PT;
}
