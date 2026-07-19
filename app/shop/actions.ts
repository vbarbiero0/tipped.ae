"use server";

import { createClient } from "@supabase/supabase-js";

export type SignupState = {
  status: "idle" | "ok" | "invalid" | "not-configured" | "error";
};

// Captures shop interest to `shop_signups`. When Supabase isn't configured
// yet, tells the client to fall back to plain email.
export async function signupForShop(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "invalid" };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { status: "not-configured" };

  const supabase = createClient(url, serviceKey);
  const { error } = await supabase.from("shop_signups").upsert(
    { email },
    { onConflict: "email", ignoreDuplicates: true }
  );
  if (error) return { status: "error" };
  return { status: "ok" };
}
