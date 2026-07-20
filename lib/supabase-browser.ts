"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser Supabase client singleton (anon key; session persists in
// localStorage). Server code keeps its own per-request clients in lib/data.ts.
let client: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
