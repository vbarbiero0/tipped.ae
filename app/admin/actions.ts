"use server";

import { createClient } from "@supabase/supabase-js";

// Invite a vetted rescuer: create the auth user, the rescuer row, and an
// emailable one-time login link (they set their password at /dashboard/reset).
// Runs with the service role — caller must prove admin via their access token.

interface InviteInput {
  accessToken: string;
  name: string;
  username: string;
  email: string;
  emirate: string;
}

export async function inviteRescuer(
  input: InviteInput
): Promise<{ ok: boolean; link?: string; error?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { ok: false, error: "Server not configured." };

  const admin = createClient(url, serviceKey);

  // Verify the caller is a signed-in admin
  const {
    data: { user },
  } = await admin.auth.getUser(input.accessToken);
  if (!user) return { ok: false, error: "Not signed in." };
  const { data: caller } = await admin
    .from("rescuers")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (caller?.role !== "admin") return { ok: false, error: "Admins only." };

  const email = input.email.trim().toLowerCase();
  const username = input.username.trim().toLowerCase();
  const name = input.name.trim();
  if (!email.includes("@") || !username || !name)
    return { ok: false, error: "Name, username and a valid email are required." };

  // Create the auth user via an invite link (creates the account if new)
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tippedae.netlify.app"}/dashboard/reset`,
    },
  });
  if (linkError || !linkData?.user)
    return { ok: false, error: linkError?.message ?? "Couldn't create the account." };

  // Rescuer row (idempotent on the auth link)
  const { error: rowError } = await admin.from("rescuers").upsert(
    {
      auth_user_id: linkData.user.id,
      username,
      name,
      email,
      emirate: input.emirate,
      is_placeholder: false,
      trust_level: "review",
      role: "rescuer",
    },
    { onConflict: "auth_user_id" }
  );
  if (rowError) return { ok: false, error: "Account made, but the rescuer row failed: " + rowError.message };

  return { ok: true, link: linkData.properties?.action_link };
}
