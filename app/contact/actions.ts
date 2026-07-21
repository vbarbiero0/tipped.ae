"use server";

import { createClient } from "@supabase/supabase-js";
import { sendAlert } from "@/lib/telegram";

// /contact message box. Stored first (the DB row is the safety net), then the
// Telegram ping is AWAITED — never `void` a side effect in a server action:
// Netlify freezes the function on response and kills in-flight work.

const cap = (v: unknown, n: number) =>
  typeof v === "string" ? v.trim().slice(0, n) : "";

export async function sendContactMessage(form: {
  name: string;
  email: string;
  message: string;
  website?: string; // honeypot
}): Promise<{ ok: boolean }> {
  try {
    if (form.website) return { ok: true };

    const name = cap(form.name, 80);
    const email = cap(form.email, 120);
    const message = cap(form.message, 1000);
    if (!name || !email.includes("@") || !message) return { ok: false };

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return { ok: false };
    const admin = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await admin
      .from("contact_messages")
      .insert({ name, email, message });
    if (error) {
      console.error("[sendContactMessage] insert failed:", error.message);
      return { ok: false };
    }

    // Full content inline — replying is just emailing them back.
    await sendAlert(
      [`\u{1F4E8} New message`, `${name} · ${email}`, `“${message}”`].join("\n")
    );

    return { ok: true };
  } catch (err) {
    console.error("[sendContactMessage]:", err);
    return { ok: false };
  }
}
