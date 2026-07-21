"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

// Fire-and-forget view counter (pet_stats.views via bump_pet_stat RPC).
// Session-guarded so remounts don't inflate the number.
export default function StatPing({ petId }: { petId: string }) {
  useEffect(() => {
    if (!petId || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const key = `viewed-${petId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // private mode etc. — count anyway
    }
    supabaseBrowser()
      .rpc("bump_pet_stat", { p_pet_id: petId, p_kind: "view" })
      .then(() => undefined);
  }, [petId]);
  return null;
}
