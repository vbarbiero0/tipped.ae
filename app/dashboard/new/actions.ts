"use server";

import { createClient } from "@supabase/supabase-js";
import { sendPendingAlert } from "@/lib/telegram";

// Fired (fire-and-forget) by the add-a-pet form right after a successful
// insert. The alert content comes from the DB via the service client — the
// caller only supplies an id, so a forged call can't inject text, and only a
// genuinely pending, just-created pet produces a message. Always resolves.
export async function alertPendingSubmission(petId: string): Promise<void> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key || !petId) return;

    const admin = createClient(url, key, { auth: { persistSession: false } });
    const { data: pet } = await admin
      .from("pets")
      .select("name,species,approval_status,photos,created_at,rescuer:rescuers(name)")
      .eq("id", petId)
      .maybeSingle();

    if (!pet || pet.approval_status !== "pending") return;
    // Only alert for fresh submissions — an old id replayed at this action
    // shouldn't re-ping the admin.
    if (Date.now() - new Date(pet.created_at).getTime() > 10 * 60 * 1000) return;

    const rescuer = pet.rescuer as unknown as { name: string } | null;
    await sendPendingAlert({
      petName: pet.name,
      species: pet.species,
      rescuerName: rescuer?.name ?? "unknown rescuer",
      photoUrl: (pet.photos as string[] | null)?.[0] ?? null,
    });
  } catch (err) {
    console.error("[telegram] alertPendingSubmission:", err);
  }
}
