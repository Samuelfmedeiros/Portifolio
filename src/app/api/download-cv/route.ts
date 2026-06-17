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

    // ── Notificações (await para garantir no Vercel) ──────────
    const notifications: Promise<void>[] = [];

    // Telemetry
    notifications.push(
      fetch("https://capivara.seu.pet/api/telemetry/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "cv_download",
          source: "portifolio",
          payload: {
            name: entry.name || "anonimo",
            ip: entry.ip,
            user_agent: entry.userAgent,
            referrer: entry.referrer,
          },
        }),
      }).then(() => {}).catch(() => {})
    );

    // Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || "-1003963506968";
    if (botToken) {
      const nome = entry.name || "Anônimo";
      const email = entry.email || "—";
      const now = new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const ref = entry.referrer !== "direct" ? entry.referrer : "—";
      const text = [
        "📄 *CURRÍCULO BAIXADO*",
        "━━━━━━━━━━━━━━━━━━━━━━━━",
        "",
        `👤 *Nome:* ${nome}`,
        `📧 *Email:* ${email}`,
        `🌐 *IP:* ${entry.ip}`,
        `🔗 *Referrer:* ${ref}`,
        "",
        "━━━━━━━━━━━━━━━━━━━━━━━━",
        `🕐 ${now}`,
        `📎 samuelmedeiros.vercel.app`,
      ].join("\n");

      notifications.push(
        fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "Markdown",
            }),
          }
        ).then(() => {}).catch(() => {})
      );
    }

    // Aguarda notificações antes de responder (evita corte do Vercel)
    await Promise.allSettled(notifications);

    // Serve o PDF
    const pdfPath = path.join(process.cwd(), "public", "Samuel_Andrade_2026.pdf");
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json({ error: "Currículo não encontrado" }, { status: 404 });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const uint8 = new Uint8Array(pdfBuffer);
    return new NextResponse(uint8, {
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
