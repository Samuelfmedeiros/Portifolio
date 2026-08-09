import type { Repo } from "./types";

/**
 * Bilingual profile data — replaces hardcoded PT text in components.
 * Indexed by locale: { pt: ..., en: ... }
 */

/* ──────────────────── TIMELINE/CAREER ──────────────────── */

export interface TimelineItem {
  type: "experience" | "education" | "certification";
  period: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
  skillsUsed: string[];
}

const TIMELINE_PT: TimelineItem[] = [
  {
    type: "experience",
    period: "2025 — Atual",
    title: "Desenvolvedor Full Stack Autônomo",
    company: "Capivara / Arachne / DogWalk",
    description: "Arquitetura e desenvolvimento de plataformas completas do zero: Arachne (scraper inteligente com RAG), Capivara (hub pessoal multi-tenant com FastAPI e autenticação JWT), DogWalk (marketplace pet com Supabase, Stripe, Cloudflare Workers). Responsável por todo o ciclo — modelagem de dados, APIs REST, deploy em produção, CI/CD, testes automatizados e documentação técnica. Stack principal: Next.js, React, FastAPI, Supabase, Cloudflare, Docker, Python, TypeScript, PostgreSQL.",
    tags: ["Next.js", "FastAPI", "Supabase", "Cloudflare", "Python"],
    skillsUsed: ["Next.js & React", "Python", "SQL & PostgreSQL", "Docker", "Git & GitHub"],
  },
  {
    type: "experience",
    period: "2025",
    title: "Analista de Dados — ANA",
    company: "Agência Nacional de Águas",
    description: "Análise de dados hídricos em larga escala na Agência Nacional de Águas. Desenvolvimento de dashboards interativos no Power BI para monitoramento de recursos hídricos, automação de pipelines de ETL com Python e SQL, integração de fontes de dados heterogêneas (sensores, estações, bases históricas). Criação de relatórios executivos e técnicos para tomada de decisão em políticas públicas de recursos hídricos.",
    tags: ["Power BI", "Python", "SQL", "ETL"],
    skillsUsed: ["Power BI", "SQL & PostgreSQL", "Python"],
  },
  {
    type: "experience",
    period: "2024 — 2025",
    title: "Técnico de Suporte N1 — Global Hitss",
    company: "Global Hitss",
    description: "Atendimento de suporte técnico N1 para funcionários da Global Hitss em ambiente corporativo com mais de 2.000 usuários. Diagnóstico e resolução de problemas de hardware, software, redes e periféricos. Administração de usuários e dispositivos no Azure Active Directory e Microsoft 365. Configuração e manutenção de estações de trabalho, impressoras e equipamentos de rede. Suporte presencial e remoto com SLA de até 4 horas.",
    tags: ["Azure", "Microsoft 365", "Suporte"],
    skillsUsed: ["Docker", "Git & GitHub"],
  },
  {
    type: "education",
    period: "Em Andamento",
    title: "Pós-graduação em Ciência de Dados e Machine Learning Engineering",
    company: "IESB",
    description: "Curso de pós-graduação focado em Ciência de Dados e Machine Learning Engineering no IESB. Estudo aprofundado de algoritmos de ML (regressão, classificação, clustering, redes neurais), engenharia de features, avaliação de modelos, deployment em produção. Domínio de SQL para análise exploratória, Power BI para visualização de dados, Python (pandas, numpy, scikit-learn, tensorflow) para modelagem preditiva e ETL.",
    tags: ["Data Science", "Machine Learning", "SQL", "Python"],
    skillsUsed: ["Python", "Machine Learning", "SQL & PostgreSQL"],
  },
  {
    type: "education",
    period: "2022 — 2024",
    title: "Análise e Desenvolvimento de Sistemas",
    company: "IESB — Data & ML",
    description: "Graduação tecnológica em Análise e Desenvolvimento de Sistemas com ênfase em Data & ML pelo IESB. Formação abrangente em ciência da computação: algoritmos, estruturas de dados, banco de dados relacionais e não-relacionais, engenharia de software, desenvolvimento web full-stack. Disciplinas específicas em machine learning, inteligência artificial, estatística aplicada e visualização de dados. Projetos práticos utilizando Python, SQL, React e Next.js.",
    tags: ["Python", "Machine Learning", "Data Science"],
    skillsUsed: ["Python", "Machine Learning", "Next.js & React"],
  },
  {
    type: "experience",
    period: "2022 — 2023",
    title: "Auxiliar Técnico Freelancer",
    company: "Autônomo",
    description: "Serviços de assistência técnica em hardware e software para pequenas empresas e residências. Diagnóstico e reparo de computadores, notebooks e periféricos. Configuração de redes domésticas e empresariais. Instalação e manutenção de sistemas operacionais e softwares. Consultoria para aquisição de equipamentos de TI.",
    tags: ["Hardware", "Redes", "Suporte"],
    skillsUsed: ["Hardware", "Redes", "Suporte Técnico"],
  },
  {
    type: "experience",
    period: "2020 — 2021",
    title: "Auxiliar Técnico — TRT 10ª Região",
    company: "Tribunal Regional do Trabalho — 10ª Região",
    description: "Suporte técnico presencial aos servidores e magistrados do TRT 10ª Região. Manutenção preventiva e corretiva de equipamentos de informática (desktops, notebooks, impressoras). Configuração e suporte a sistemas corporativos. Gerenciamento de chamados e documentação de procedimentos. Participação em projetos de modernização do parque tecnológico.",
    tags: ["Suporte", "Hardware", "Documentação"],
    skillsUsed: ["Suporte Técnico", "Hardware", "Documentação"],
  },
];

const TIMELINE_EN: TimelineItem[] = [
  {
    type: "experience",
    period: "2025 — Present",
    title: "Full Stack Developer (Self-employed)",
    company: "Capivara / Arachne / DogWalk",
    description: "Architecture and development of complete platforms from scratch: Arachne (intelligent scraper with RAG), Capivara (multi-tenant personal hub with FastAPI and JWT authentication), DogWalk (pet marketplace with Supabase, Stripe, Cloudflare Workers). Responsible for the full cycle — data modeling, REST APIs, production deployment, CI/CD, automated testing and technical documentation. Main stack: Next.js, React, FastAPI, Supabase, Cloudflare, Docker, Python, TypeScript, PostgreSQL.",
    tags: ["Next.js", "FastAPI", "Supabase", "Cloudflare", "Python"],
    skillsUsed: ["Next.js & React", "Python", "SQL & PostgreSQL", "Docker", "Git & GitHub"],
  },
  {
    type: "experience",
    period: "2025",
    title: "Data Analyst — ANA (National Water Agency)",
    company: "National Water Agency (ANA)",
    description: "Large-scale water data analysis at the National Water Agency. Development of interactive dashboards in Power BI for water resource monitoring, automation of ETL pipelines with Python and SQL, integration of heterogeneous data sources (sensors, stations, historical databases). Creation of executive and technical reports for decision-making in water resource public policies.",
    tags: ["Power BI", "Python", "SQL", "ETL"],
    skillsUsed: ["Power BI", "SQL & PostgreSQL", "Python"],
  },
  {
    type: "experience",
    period: "2024 — 2025",
    title: "Support Technician N1 — Global Hitss",
    company: "Global Hitss",
    description: "N1 technical support for Global Hitss employees in a corporate environment with over 2,000 users. Diagnosis and resolution of hardware, software, network and peripheral issues. User and device administration in Azure Active Directory and Microsoft 365. Configuration and maintenance of workstations, printers and network equipment. On-site and remote support with up to 4-hour SLA.",
    tags: ["Azure", "Microsoft 365", "Support"],
    skillsUsed: ["Docker", "Git & GitHub"],
  },
  {
    type: "education",
    period: "In Progress",
    title: "Postgraduate in Data Science and ML Engineering",
    company: "IESB",
    description: "Postgraduate course focused on Data Science and Machine Learning Engineering at IESB. In-depth study of ML algorithms (regression, classification, clustering, neural networks), feature engineering, model evaluation, production deployment. Mastery of SQL for exploratory analysis, Power BI for data visualization, Python (pandas, numpy, scikit-learn, tensorflow) for predictive modeling and ETL.",
    tags: ["Data Science", "Machine Learning", "SQL", "Python"],
    skillsUsed: ["Python", "Machine Learning", "SQL & PostgreSQL"],
  },
  {
    type: "education",
    period: "2022 — 2024",
    title: "Systems Analysis and Development",
    company: "IESB — Data & ML",
    description: "Undergraduate degree in Systems Analysis and Development with emphasis on Data & ML at IESB. Comprehensive education in computer science: algorithms, data structures, relational and non-relational databases, software engineering, full-stack web development. Specific courses in machine learning, artificial intelligence, applied statistics and data visualization. Practical projects using Python, SQL, React and Next.js.",
    tags: ["Python", "Machine Learning", "Data Science"],
    skillsUsed: ["Python", "Machine Learning", "Next.js & React"],
  },
  {
    type: "experience",
    period: "2022 — 2023",
    title: "Freelance Technical Assistant",
    company: "Self-employed",
    description: "Hardware and software technical assistance services for small businesses and residences. Diagnosis and repair of computers, notebooks and peripherals. Configuration of home and business networks. Installation and maintenance of operating systems and software. Consulting for IT equipment acquisition.",
    tags: ["Hardware", "Networks", "Support"],
    skillsUsed: ["Hardware", "Networks", "Technical Support"],
  },
  {
    type: "experience",
    period: "2020 — 2021",
    title: "Technical Assistant — TRT 10th Region",
    company: "Regional Labor Court — 10th Region",
    description: "On-site technical support for servers and magistrates of the TRT 10th Region. Preventive and corrective maintenance of computer equipment (desktops, notebooks, printers). Configuration and support for corporate systems. Ticket management and procedure documentation. Participation in technology park modernization projects.",
    tags: ["Support", "Hardware", "Documentation"],
    skillsUsed: ["Technical Support", "Hardware", "Documentation"],
  },
];

/* ──────────────────── SKILLS ──────────────────── */

export interface SkillItem {
  name: string;
  category: string;
  description: string;
  level: string;
  levelKey: keyof typeof SKILL_LEVELS_PT;
}

const SKILL_LEVELS_PT = {
  expert: "Expert",
  advanced: "Avançado",
  proficient: "Proficiente",
};

const SKILL_LEVELS_EN = {
  expert: "Expert",
  advanced: "Advanced",
  proficient: "Proficient",
};

const SKILLS_PT: SkillItem[] = [
  { name: "Power BI", category: "BI", description: "Dashboards interativos, DAX, M, modelagem dimensional", level: "expert", levelKey: "expert" },
  { name: "SQL", category: "Data", description: "Consultas complexas, otimização, schema design, PostgreSQL", level: "expert", levelKey: "expert" },
  { name: "Python", category: "Backend", description: "FastAPI, automação, ETL, pandas, scikit-learn", level: "advanced", levelKey: "advanced" },
  { name: "Machine Learning", category: "AI", description: "Regressão, classificação, clustering, redes neurais", level: "advanced", levelKey: "advanced" },
  { name: "Next.js", category: "Web", description: "SSR, SSG, API Routes, App Router, Turbopack", level: "advanced", levelKey: "advanced" },
  { name: "LLMs Locais", category: "AI", description: "Ollama, llama.cpp, RAG, embedding, fine-tuning", level: "proficient", levelKey: "proficient" },
  { name: "Docker", category: "DevOps", description: "Containerização, Docker Compose, multi-stage builds", level: "proficient", levelKey: "proficient" },
  { name: "Git", category: "Tools", description: "Versionamento, branching, rebase, hooks, workflow", level: "advanced", levelKey: "advanced" },
  { name: "ML Frameworks", category: "AI", description: "TensorFlow, PyTorch, scikit-learn, Hugging Face", level: "proficient", levelKey: "proficient" },
  { name: "Git & CI/CD", category: "DevOps", description: "GitHub Actions, pipelines, deploy automatizado", level: "proficient", levelKey: "proficient" },
  { name: "Cloudflare", category: "DevOps", description: "Pages, Workers, D1, Tunnel, DNS, edge computing", level: "proficient", levelKey: "proficient" },
  { name: "TypeScript", category: "Web", description: "Tipagem estática, genéricos, interfaces, strict mode", level: "advanced", levelKey: "advanced" },
];

const SKILLS_EN: SkillItem[] = [
  { name: "Power BI", category: "BI", description: "Interactive dashboards, DAX, M, dimensional modeling", level: "expert", levelKey: "expert" },
  { name: "SQL", category: "Data", description: "Complex queries, optimization, schema design, PostgreSQL", level: "expert", levelKey: "expert" },
  { name: "Python", category: "Backend", description: "FastAPI, automation, ETL, pandas, scikit-learn", level: "advanced", levelKey: "advanced" },
  { name: "Machine Learning", category: "AI", description: "Regression, classification, clustering, neural networks", level: "advanced", levelKey: "advanced" },
  { name: "Next.js", category: "Web", description: "SSR, SSG, API Routes, App Router, Turbopack", level: "advanced", levelKey: "advanced" },
  { name: "Local LLMs", category: "AI", description: "Ollama, llama.cpp, RAG, embedding, fine-tuning", level: "proficient", levelKey: "proficient" },
  { name: "Docker", category: "DevOps", description: "Containerization, Docker Compose, multi-stage builds", level: "proficient", levelKey: "proficient" },
  { name: "Git", category: "Tools", description: "Versioning, branching, rebase, hooks, workflow", level: "advanced", levelKey: "advanced" },
  { name: "ML Frameworks", category: "AI", description: "TensorFlow, PyTorch, scikit-learn, Hugging Face", level: "proficient", levelKey: "proficient" },
  { name: "Git & CI/CD", category: "DevOps", description: "GitHub Actions, pipelines, automated deploy", level: "proficient", levelKey: "proficient" },
  { name: "Cloudflare", category: "DevOps", description: "Pages, Workers, D1, Tunnel, DNS, edge computing", level: "proficient", levelKey: "proficient" },
  { name: "TypeScript", category: "Web", description: "Static typing, generics, interfaces, strict mode", level: "advanced", levelKey: "advanced" },
];

/* ──────────────────── PROJECTS ──────────────────── */

export interface ProjectI18n {
  description: string;
  topics: string[];
}

const PROJECTS_PT: Record<string, ProjectI18n> = {
  DogWalk: {
    description: "Marketplace de serviços pet com autenticação, pagamentos e geolocalização — React, Supabase, Stripe e Cloudflare.",
    topics: ["web", "marketplace"],
  },
  Arachne: {
    description: "Motor de scraping inteligente com RAG semântico, parsing de 44+ formatos de documento, busca híbrida (web + vetorial), MCP server, crawl4ai e exportação multi-formato. Integra captura web, extração estruturada, busca semântica e agentes autônomos em um ecossistema unificado.",
    topics: ["web", "ai", "data", "fastapi", "python", "mcp", "crawl4ai", "rag"],
  },
  Portifolio: {
    description: "Portfolio profissional estilo cockpit sci-fi — Next.js, Framer Motion, animações cinematográficas, tema ciano+preto.",
    topics: ["web"],
  },
};

const PROJECTS_EN: Record<string, ProjectI18n> = {
  DogWalk: {
    description: "Pet service marketplace with authentication, payments and geolocation — React, Supabase, Stripe and Cloudflare.",
    topics: ["web", "marketplace"],
  },
  Arachne: {
    description: "Intelligent scraping engine with semantic RAG, parsing of 44+ document formats, hybrid search (web + vector), MCP server, crawl4ai and multi-format export. Integrates web capture, structured extraction, semantic search and autonomous agents in a unified ecosystem.",
    topics: ["web", "ai", "data", "fastapi", "python", "mcp", "crawl4ai", "rag"],
  },
  Portifolio: {
    description: "Professional sci-fi cockpit-style portfolio — Next.js, Framer Motion, cinematic animations, teal+black theme.",
    topics: ["web"],
  },
};

/* ──────────────────── ABOUT TEXT ──────────────────── */

const ABOUT_PT = {
  title: "Sobre Samuel Medeiros",
  role: "Desenvolvedor Full Stack & Analista de Dados",
  paragraphs: [
    'Sou <strong>Samuel Medeiros</strong>, Desenvolvedor Full Stack e Analista de Dados com sede em Brasília/DF. Minha atuação combina engenharia de software com análise de dados — construo plataformas web completas enquanto extraio insights estratégicos de dados complexos.',
    'No desenvolvimento, trabalho com <strong>Next.js, React, TypeScript, FastAPI e Python</strong> para criar aplicações escaláveis. Minha stack inclui Supabase para backend-as-a-service, Cloudflare para deploy e edge computing, Docker para containerização, e PostgreSQL para bancos de dados relacionais. Já entreguei projetos como um scraper inteligente com RAG semântico (Arachne), um hub pessoal multi-tenant (Capivara), e um marketplace pet com pagamentos Stripe (DogWalk).',
    'Na análise de dados, sou especialista em <strong>Power BI, SQL e Python</strong> — crio dashboards interativos, pipelines de ETL, e modelos preditivos com machine learning. Minha experiência na Agência Nacional de Águas (ANA) envolveu análise de dados hídricos em larga escala, automação de processos e relatórios executivos para tomada de decisão em políticas públicas.',
    'Atualmente curso Pós-graduação em Ciência de Dados e Machine Learning Engineering no IESB, e mantenho aprendizado contínuo em LLMs locais (Ollama, llama.cpp), CI/CD com GitHub Actions, e arquiteturas serverless. Acredito que tecnologia de qualidade começa com código limpo, testes automatizados e documentação clara.',
  ],
};

const ABOUT_EN = {
  title: "About Samuel Medeiros",
  role: "Full Stack Developer & Data Analyst",
  paragraphs: [
    'I\'m <strong>Samuel Medeiros</strong>, a Full Stack Developer and Data Analyst based in Brasília/DF. My work combines software engineering with data analysis — I build complete web platforms while extracting strategic insights from complex data.',
    'In development, I work with <strong>Next.js, React, TypeScript, FastAPI and Python</strong> to build scalable applications. My stack includes Supabase for backend-as-a-service, Cloudflare for deployment and edge computing, Docker for containerization, and PostgreSQL for relational databases. I\'ve delivered projects like an intelligent scraper with semantic RAG (Arachne), a multi-tenant personal hub (Capivara), and a pet marketplace with Stripe payments (DogWalk).',
    'In data analysis, I specialize in <strong>Power BI, SQL and Python</strong> — creating interactive dashboards, ETL pipelines, and predictive models with machine learning. My experience at the National Water Agency (ANA) involved large-scale water data analysis, process automation and executive reports for decision-making in public policy.',
    'I\'m currently pursuing a Postgraduate degree in Data Science and Machine Learning Engineering at IESB, and maintain continuous learning in local LLMs (Ollama, llama.cpp), CI/CD with GitHub Actions, and serverless architectures. I believe quality technology starts with clean code, automated testing and clear documentation.',
  ],
};

export function getAbout(locale: Locale) {
  return locale === "en" ? ABOUT_EN : ABOUT_PT;
}

/* ──────────────────── EXPORTS ──────────────────── */

export type Locale = "pt" | "en";

export function getTimeline(locale: Locale): TimelineItem[] {
  return locale === "en" ? TIMELINE_EN : TIMELINE_PT;
}

export function getSkills(locale: Locale): { items: SkillItem[]; levels: Record<string, string> } {
  return {
    items: locale === "en" ? SKILLS_EN : SKILLS_PT,
    levels: locale === "en" ? SKILL_LEVELS_EN : SKILL_LEVELS_PT,
  };
}

export function getProjectI18n(locale: Locale, projectName: string): ProjectI18n | null {
  const db = locale === "en" ? PROJECTS_EN : PROJECTS_PT;
  return db[projectName] || null;
}
