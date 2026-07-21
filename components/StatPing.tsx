"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

// Fire-and-forget view counter (animal_stats.views via bump_animal_stat RPC).
// Session-guarded so remounts don't inflate the number.
export default function StatPing({ animalId }: { animalId: string }) {
  useEffect(() => {
    if (!animalId || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const key = `viewed-${animalId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // private mode etc. — count anyway
    }
    supabaseBrowser()
      .rpc("bump_animal_stat", { p_animal_id: animalId, p_kind: "view" })
      .then(() => undefined);
  }, [animalId]);
  return null;
}
