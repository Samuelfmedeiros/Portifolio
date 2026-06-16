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
            from: "Portifolio Samuel <onboarding@resend.dev>",
            to: "samuelandrademedeiros@gmail.com",
            subject: `📬 Contato do Portfólio — ${name}`,
            html: `
              <h2>Nova mensagem do portfólio</h2>
              <table style="border-collapse:collapse;width:100%;max-width:500px">
                <tr><td style="padding:8px;border:1px solid #333;font-weight:bold">Nome</td><td style="padding:8px;border:1px solid #333">${name}</td></tr>
                <tr><td style="padding:8px;border:1px solid #333;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #333">${email}</td></tr>
                <tr><td style="padding:8px;border:1px solid #333;font-weight:bold">Mensagem</td><td style="padding:8px;border:1px solid #333">${content}</td></tr>
              </table>
              <p style="color:#888;font-size:12px;margin-top:16px">Enviado via samuelmedeiros.vercel.app</p>
            `,
          }),
        });
        if (res.ok) results.email = "sent";
        else results.email = `falha: ${res.status}`;
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
