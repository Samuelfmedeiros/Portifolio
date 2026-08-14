import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CAPIVARA_API = "https://capivara.seu.pet/api/portifolio/public";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, consent, locale } = body;
    const isEn = locale === "en";

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

    // ── Persistência + Notificações (paralelo, não bloqueia o download) ──
    const notifications: Promise<void>[] = [];

    // Capivara: persistir evento de download
    notifications.push(
      fetch(`${CAPIVARA_API}/cv-downloads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: entry.name || "anonimo",
          email: entry.email || null,
          ip: entry.ip,
          user_agent: entry.userAgent,
          referrer: entry.referrer,
          timestamp: entry.timestamp,
        }),
      }).then(() => {}).catch(() => {})
    );

    // Telegram notification
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
        " *CURRÍCULO BAIXADO*",
        "━━━━━━━━━━━━━━━━━━━━━━━━",
        "",
        ` *Nome:* ${nome}`,
        ` *Email:* ${email}`,
        ` *IP:* ${entry.ip}`,
        ` *Referrer:* ${ref}`,
        "",
        "━━━━━━━━━━━━━━━━━━━━━━━━",
        ` ${now}`,
        ` samuelmedeiros.vercel.app`,
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

    // ── Email via Resend (se configurado) ──────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      notifications.push(
        (async () => {
          try {
            const nome = entry.name || "Anônimo";
            const email = entry.email || "—";
            const ip = entry.ip;
            const ref = entry.referrer !== "direct" ? entry.referrer : "—";
            const now = new Date().toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${resendKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "Portifolio Samuel <contato@seu.pet>",
                to: "samuelandrademedeiros@gmail.com",
                subject: ` Currículo baixado — ${nome}`,
                html: `
                  <div style="background:#0a0a0f;color:#e0e0e0;font-family:'Segoe UI',Arial,sans-serif;padding:32px;max-width:600px;margin:0 auto;border:2px solid #00e5ff;border-radius:12px">
                    <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#00e5ff22,#0a0a0f);border-radius:8px;margin-bottom:24px;border-bottom:3px solid #00e5ff">
                      <div style="font-size:48px;line-height:1"></div>
                      <h1 style="color:#00e5ff;font-size:28px;margin:8px 0 4px;text-transform:uppercase;letter-spacing:2px">CURRÍCULO BAIXADO</h1>
                      <p style="color:#888;font-size:13px;margin:0">Portifolio Samuel — Download do CV</p>
                    </div>
                    <div style="background:#111118;border:1px solid #00e5ff44;border-radius:8px;padding:16px;margin-bottom:16px">
                      <div style="margin-bottom:12px">
                        <span style="color:#00e5ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold"> Nome</span>
                        <div style="color:#fff;font-size:18px;font-weight:bold;margin-top:2px;padding:8px 12px;background:#0a0a0f;border-left:3px solid #00e5ff;border-radius:4px">${nome}</div>
                      </div>
                      <div style="margin-bottom:12px">
                        <span style="color:#00e5ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold"> Email</span>
                        <div style="color:#fff;font-size:16px;margin-top:2px;padding:8px 12px;background:#0a0a0f;border-left:3px solid #00e5ff;border-radius:4px">${email}</div>
                      </div>
                      <div style="margin-bottom:12px">
                        <span style="color:#00e5ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold"> IP</span>
                        <div style="color:#e0e0e0;font-size:14px;margin-top:2px;padding:8px 12px;background:#0a0a0f;border-left:3px solid #00e5ff;border-radius:4px">${ip}</div>
                      </div>
                      <div>
                        <span style="color:#00e5ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold"> Referrer</span>
                        <div style="color:#e0e0e0;font-size:14px;margin-top:2px;padding:8px 12px;background:#0a0a0f;border-left:3px solid #00e5ff;border-radius:4px">${ref}</div>
                      </div>
                    </div>
                    <div style="text-align:center;padding:8px;border-top:1px solid #222;margin-top:16px">
                      <span style="color:#555;font-size:11px"> Enviado via samuelmedeiros.vercel.app</span>
                    </div>
                    <div style="background:#00e5ff;height:2px;border-radius:2px;margin-top:12px;width:100%"></div>
                  </div>
                `,
              }),
            });
            if (!res.ok) {
              console.error("Resend falhou:", res.status, await res.text().catch(() => ""));
            }
          } catch (err) {
            console.error("Erro email Resend:", err instanceof Error ? err.message : "unknown");
          }
        })()
      );
    }

    // Aguarda notificações antes de responder (evita corte do Vercel)
    await Promise.allSettled(notifications);

    // Serve o PDF
    const pdfName = isEn ? "Samuel_Andrade_Resume_2026.pdf" : "Samuel_Andrade_2026.pdf";
    const pdfPath = path.join(process.cwd(), "public", pdfName);
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json({ error: isEn ? "Resume not found" : "Currículo não encontrado" }, { status: 404 });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const uint8 = new Uint8Array(pdfBuffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfName}"`,
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
