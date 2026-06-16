import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "data", "cv-downloads.jsonl");

interface DownloadLog {
  timestamp: string;
  ip: string;
  userAgent: string;
  referrer: string;
  name?: string;
  email?: string;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return req.headers.get("x-vercel-forwarded-for") ?? "unknown";
}

function appendLog(entry: DownloadLog) {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n", "utf-8");
  } catch {
    // silent — log é best-effort
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, consent } = body;

    if (!consent) {
      return NextResponse.json(
        { error: "Consentimento é obrigatório" },
        { status: 400 }
      );
    }

    const entry: DownloadLog = {
      timestamp: new Date().toISOString(),
      ip: getClientIp(req),
      userAgent: req.headers.get("user-agent") ?? "unknown",
      referrer: req.headers.get("referer") ?? req.headers.get("referrer") ?? "direct",
      name: typeof name === "string" && name.trim() ? name.trim() : undefined,
      email: typeof email === "string" && email.trim() ? email.trim() : undefined,
    };

    // Log em background (não bloqueia o download)
    appendLog(entry);

    // Serve o PDF
    const pdfPath = path.join(process.cwd(), "public", "Samuel_Andrade_2026.pdf");
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json({ error: "Currículo não encontrado" }, { status: 404 });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Samuel_Andrade_2026.pdf"',
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}
