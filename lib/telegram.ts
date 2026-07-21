// Server-only Telegram alert (Step 5). Both env vars optional — without them
// every call is a silent no-op. A notification failure must never surface to
// the submitting rescuer: errors are logged server-side and swallowed.

interface PendingAlert {
  petName: string;
  species: string;
  rescuerName: string;
  photoUrl?: string | null;
}

export async function sendPendingAlert(alert: PendingAlert): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // not configured — skip cleanly

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tippedae.netlify.app";
  const text = [
    `🐾 New pending submission`,
    `${alert.petName} — ${alert.species}, with ${alert.rescuerName}`,
    `Review: ${site}/admin`,
  ].join("\n");

  // Absolute photo URL → sendPhoto with caption; otherwise plain message.
  // Relative paths (seed photos) fall back to text — Telegram can't fetch them.
  const photo = alert.photoUrl?.startsWith("http") ? alert.photoUrl : null;
  const method = photo ? "sendPhoto" : "sendMessage";
  const body = photo
    ? { chat_id: chatId, photo, caption: text }
    : { chat_id: chatId, text };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("[telegram] alert failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[telegram] alert failed:", err);
  }
}
