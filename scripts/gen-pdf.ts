// gen-pdf.ts — gera PDF do teste normal a partir do JSON salvo da API
import { generateResumePdf } from "../src/lib/resumePdf";
import { readFileSync, writeFileSync } from "node:fs";

async function main() {
  const data = JSON.parse(readFileSync("/tmp/rt_normal.json", "utf8"));
  const theme = data.brand ?? null;
  const blob = generateResumePdf(data.resume, "pt", theme);
  const buf = Buffer.from(await blob.arrayBuffer());
  writeFileSync("/tmp/resume-google.pdf", buf);
  console.log("PDF salvo:", buf.length, "bytes");
  console.log("brand:", JSON.stringify(theme));
  console.log("role:", data.resume.role);
  console.log("empresas:", data.resume.experiences.map((e: any) => e.company).join(", "));
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });