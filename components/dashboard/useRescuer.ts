"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export interface DashRescuer {
  id: string;
  username: string | null;
  name: string;
  emirate: string | null;
  blurb: string | null;
  email: string;
  instagram: string | null;
  avatar_url: string | null;
  clinics: { name: string; url?: string }[];
  wishlists: { name: string; url?: string }[];
}

// Auth guard + "who am I": redirects to /dashboard/login without a session,
// otherwise loads the rescuer row linked to the signed-in user.
export function useRescuer() {
  const router = useRouter();
  const [rescuer, setRescuer] = useState<DashRescuer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const supabase = supabaseBrowser();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/dashboard/login");
        return;
      }
      const { data, error } = await supabase
        .from("rescuers")
        .select(
          "id,username,name,emirate,blurb,email,instagram,avatar_url,clinics,wishlists,auth_user_id"
        )
        .eq("auth_user_id", session.user.id)
        .maybeSingle();
      if (!alive) return;
      if (error || !data) {
        // Signed in but not linked to a rescuer row — sign out to be safe.
        await supabase.auth.signOut();
        router.replace("/dashboard/login");
        return;
      }
      setRescuer(data as unknown as DashRescuer);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  return { rescuer, loading };
}

export async function signOutRescuer(router: { replace: (p: string) => void }) {
  await supabaseBrowser().auth.signOut();
  router.replace("/dashboard/login");
}
