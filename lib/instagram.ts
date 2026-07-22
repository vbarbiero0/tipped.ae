import "server-only";
import { createClient } from "@supabase/supabase-js";

// Instagram feed for @tipped.ae via the official Instagram API (Instagram
// Login). The long-lived token lives in app_settings (not env) so it can
// SELF-REFRESH: tokens last 60 days, and any fetch that finds the token
// older than 24h refreshes it and saves the new one back. After the one-time
// connect, the whole thing maintains itself.
//
// Every failure path returns null — the page renders a follow card instead.

export interface InstaPost {
  id: string;
  permalink: string;
  image: string;
  caption: string | null;
}

const TOKEN_KEY = "instagram_token";
const REFRESH_AFTER_MS = 24 * 60 * 60 * 1000;

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getInstagramPosts(limit = 9): Promise<InstaPost[] | null> {
  try {
    const db = admin();
    if (!db) return null;

    const { data: row } = await db
      .from("app_settings")
      .select("value,updated_at")
      .eq("key", TOKEN_KEY)
      .maybeSingle();
    if (!row?.value?.token) return null;
    let token: string = row.value.token;

    // Self-refresh: valid for 60 days, refreshable once older than 24h.
    if (Date.now() - new Date(row.updated_at).getTime() > REFRESH_AFTER_MS) {
      try {
        const r = await fetch(
          `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`,
          { next: { revalidate: 3600 } }
        );
        const j = await r.json();
        if (r.ok && j.access_token) {
          token = j.access_token;
          await db
            .from("app_settings")
            .upsert({ key: TOKEN_KEY, value: { token }, updated_at: new Date().toISOString() });
        }
      } catch {
        // keep using the current token — it's valid for weeks either way
      }
    }

    const r = await fetch(
      `https://graph.instagram.com/me/media?fields=id,permalink,media_url,thumbnail_url,media_type,caption&limit=${limit + 6}&access_token=${encodeURIComponent(token)}`,
      { next: { revalidate: 3600 } } // at most one Instagram call per hour
    );
    if (!r.ok) {
      console.error("[instagram] media fetch failed:", r.status, await r.text());
      return null;
    }
    const j = await r.json();
    const posts: InstaPost[] = (j.data ?? [])
      .map((m: Record<string, string>) => ({
        id: m.id,
        permalink: m.permalink,
        image: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
        caption: m.caption ?? null,
      }))
      .filter((p: InstaPost) => p.image)
      .slice(0, limit);
    return posts.length > 0 ? posts : null;
  } catch (err) {
    console.error("[instagram]:", err);
    return null;
  }
}
