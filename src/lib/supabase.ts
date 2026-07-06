/**
 * Contact form submission — persists to PostgreSQL via Capivara API.
 * Also triggers email + Telegram notification via the existing API route.
 */

const CAPIVARA_API = "https://capivara.seu.pet/api/portifolio/public";

export async function submitContactForm(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    // Persistir no banco via Capivara (PG18 local via Cloudflare Tunnel)
    const res = await fetch(`${CAPIVARA_API}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        content: data.message,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Contact form submission failed:", err);
    return null;
  }
}

/**
 * Register a CV download event in the database.
 */
export async function submitCVDownload(data: {
  name?: string;
  email?: string;
  consent: boolean;
}) {
  try {
    await fetch(`${CAPIVARA_API}/cv-downloads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error("CV download registration failed:", err);
  }
}

/**
 * Register a monitoring event.
 */
export async function submitMonitoringEvent(
  event_type: string,
  payload: Record<string, unknown> = {}
) {
  try {
    await fetch(`${CAPIVARA_API}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type, payload }),
    });
  } catch (err) {
    // Silencioso — monitoramento é best-effort
  }
}
