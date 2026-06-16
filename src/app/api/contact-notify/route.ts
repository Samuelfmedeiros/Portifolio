import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, content } = await req.json();

    if (!name || !email || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const results: { email?: string; telegram?: string } = {};

    // ── Email via Resend (se configurado) ──────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Portifolio Samuel <contato@seu.pet>",
            to: "samuelandrademedeiros@gmail.com",
            subject: `📬 Contato do Portfólio — ${name}`,
            html: `
              <div style="background:#0a0a0f;color:#e0e0e0;font-family:'Segoe UI',Arial,sans-serif;padding:32px;max-width:600px;margin:0 auto;border:2px solid #00e5ff;border-radius:12px">
                <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#00e5ff22,#0a0a0f);border-radius:8px;margin-bottom:24px;border-bottom:3px solid #00e5ff">
                  <div style="font-size:48px;line-height:1">🚀</div>
                  <h1 style="color:#00e5ff;font-size:28px;margin:8px 0 4px;text-transform:uppercase;letter-spacing:2px">NOVA MENSAGEM</h1>
                  <p style="color:#888;font-size:13px;margin:0">Portifolio Samuel — Contato Recebido</p>
                </div>
                <div style="background:#111118;border:1px solid #00e5ff44;border-radius:8px;padding:16px;margin-bottom:16px">
                  <div style="margin-bottom:12px">
                    <span style="color:#00e5ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold">👤 Nome</span>
                    <div style="color:#fff;font-size:18px;font-weight:bold;margin-top:2px;padding:8px 12px;background:#0a0a0f;border-left:3px solid #00e5ff;border-radius:4px">${name}</div>
                  </div>
                  <div style="margin-bottom:12px">
                    <span style="color:#00e5ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold">📧 Email</span>
                    <div style="color:#fff;font-size:16px;margin-top:2px;padding:8px 12px;background:#0a0a0f;border-left:3px solid #00e5ff;border-radius:4px">${email}</div>
                  </div>
                  <div>
                    <span style="color:#00e5ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold">💬 Mensagem</span>
                    <div style="color:#e0e0e0;font-size:15px;margin-top:2px;padding:12px;background:#0a0a0f;border-left:3px solid #00e5ff;border-radius:4px;line-height:1.5;white-space:pre-wrap">${content}</div>
                  </div>
                </div>
                <div style="text-align:center;padding:8px;border-top:1px solid #222;margin-top:16px">
                  <span style="color:#555;font-size:11px">🛸 Enviado via samuelmedeiros.vercel.app</span>
                </div>
                <div style="background:#00e5ff;height:2px;border-radius:2px;margin-top:12px;width:100%;animation:pulse 2s infinite"></div>
              </div>
            `,
          }),
        });
        if (res.ok) {
          const body = await res.json();
          results.email = `sent (id: ${body.id})`;
        }
        else results.email = `falha: ${res.status} — ${await res.text()}`;
      } catch (err) {
        results.email = `erro: ${err instanceof Error ? err.message : "unknown"}`;
      }
    } else {
      results.email = "RESEND_API_KEY não configurada";
    }

    // ── Telegram via Bot API (se configurado) ──────────────────
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || "-1003963506968"; // Portifólio group
    if (botToken) {
      try {
        const text = [
          `📬 *${name}* <${email}>`,
          ``,
          content.replace(/_/g, "\\_"),
        ].join("\n");

        const res = await fetch(
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
        );
        if (res.ok) results.telegram = "sent";
        else results.telegram = `falha: ${res.status}`;
      } catch (err) {
        results.telegram = `erro: ${err instanceof Error ? err.message : "unknown"}`;
      }
    } else {
      results.telegram = "TELEGRAM_BOT_TOKEN não configurado";
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
