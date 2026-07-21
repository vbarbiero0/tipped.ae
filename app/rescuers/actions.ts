"use server";

import { createClient } from "@supabase/supabase-js";
import { sendAlert, siteUrl } from "@/lib/telegram";

// The /rescuers#join application. Inserted with the service key (the table
// has no anon INSERT policy), then a Telegram ping — fire-and-forget: an
// alert failure never fails the application.

const cap = (v: unknown, n: number) =>
  typeof v === "string" ? v.trim().slice(0, n) : "";

export async function applyAsRescuer(form: {
  name: string;
  email: string;
  emirate?: string;
  instagram?: string;
  note?: string;
  website?: string; // honeypot — real people never fill this
}): Promise<{ ok: boolean }> {
  try {
    if (form.website) return { ok: true }; // bot: pretend success, store nothing

    const name = cap(form.name, 80);
    const email = cap(form.email, 120);
    if (!name || !email.includes("@")) return { ok: false };

    const row = {
      name,
      email,
      emirate: cap(form.emirate, 40) || null,
      instagram: cap(form.instagram, 60).replace(/^@/, "") || null,
      note: cap(form.note, 500) || null,
    };

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return { ok: false };
    const admin = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await admin.from("rescuer_applications").insert(row);
    if (error) {
      console.error("[applyAsRescuer] insert failed:", error.message);
      return { ok: false };
    }

    await sendAlert(
      [
        `\u{1F64B} New rescuer application`,
        `${row.name}${row.emirate ? ` — ${row.emirate}` : ""}`,
        [row.email, row.instagram && `@${row.instagram}`].filter(Boolean).join(" · "),
        row.note ? `“${row.note}”` : "",
        `Review: ${siteUrl()}/admin/rescuers`,
      ]
        .filter(Boolean)
        .join("\n")
    ).catch(() => {});

    return { ok: true };
  } catch (err) {
    console.error("[applyAsRescuer]:", err);
    return { ok: false };
  }
}
