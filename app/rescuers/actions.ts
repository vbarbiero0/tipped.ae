"use server";

import { createClient } from "@supabase/supabase-js";
import { sendAlert, siteUrl } from "@/lib/telegram";

// The /rescuers#join application. Inserted with the service key (the table
// has no anon INSERT policy), then a Telegram ping — fire-and-forget: an
// alert failure never fails the application.

const cap = (v: unknown, n: number) =>
  typeof v === "string" ? v.trim().slice(0, n) : "";

const PLATFORMS = new Set(["instagram", "facebook", "tiktok", "other"]);

export async function applyAsRescuer(form: {
  name: string;
  email: string;
  emirate?: string;
  phone?: string;
  vets?: string;
  socials?: { platform: string; handle: string }[];
  note?: string;
  website?: string; // honeypot — real people never fill this
}): Promise<{ ok: boolean }> {
  try {
    if (form.website) return { ok: true }; // bot: pretend success, store nothing

    const name = cap(form.name, 80);
    const email = cap(form.email, 120);
    const phone = cap(form.phone, 30);
    const vets = cap(form.vets, 300);
    if (!name || !email.includes("@") || !phone || !vets) return { ok: false };

    const socials = (Array.isArray(form.socials) ? form.socials : [])
      .slice(0, 4)
      .map((x) => ({
        platform: PLATFORMS.has(x?.platform) ? x.platform : "other",
        handle: cap(x?.handle, 120).replace(/^@/, ""),
      }))
      .filter((x) => x.handle);

    const row = {
      name,
      email,
      emirate: cap(form.emirate, 40) || null,
      phone,
      vets,
      socials,
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
        [row.email, row.phone].filter(Boolean).join(" · "),
        `Vets: ${row.vets}`,
        socials.length
          ? socials.map((x) => `${x.platform}: ${x.handle}`).join(" · ")
          : "",
        row.note ? `“${row.note}”` : "",
        `Review: ${siteUrl()}/admin/rescuers`,
      ]
        .filter(Boolean)
        .join("\n")
    );

    return { ok: true };
  } catch (err) {
    console.error("[applyAsRescuer]:", err);
    return { ok: false };
  }
}
