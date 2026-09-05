import { generateResumePdf } from "../src/lib/resumePdf";
import { readFileSync, writeFileSync } from "node:fs";

async function main() {
  const data = JSON.parse(readFileSync("/tmp/rt_normal.json", "utf8"));
  const theme = data.brand ?? null;
  const mk = async (p: string, resume: any, loc: "pt" | "en", t: any) => {
    const blob = generateResumePdf(resume, loc, t);
    const buf = Buffer.from(await blob.arrayBuffer());
    writeFileSync(p, buf);
    console.log(p, buf.length, "bytes");
  };
  await mk("/tmp/resume-google-v2.pdf", data.resume, "pt", theme);
  await mk("/tmp/resume-neutro-v2.pdf", data.resume, "pt", null);
  await mk("/tmp/resume-en-v2.pdf", { ...data.resume, role: "Senior Data Engineer" }, "en", theme);
  console.log("role:", data.resume.role, "| brand:", JSON.stringify(theme));
}
main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
