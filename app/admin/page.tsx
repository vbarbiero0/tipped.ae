"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import AdminShell, { useAdmin } from "@/components/admin/AdminShell";
import { EmptyStateHead } from "@/components/dashboard/icons";
import { supabaseBrowser } from "@/lib/supabase-browser";

// Approval queue: pending pets newest-first with a full preview.
// Approve / Request changes (note the rescuer sees) / Reject — all RLS-gated
// to admins, all audit-logged by DB triggers.

interface QueueAnimal {
  id: string;
  ref: string;
  name: string;
  species: string;
  sex: string | null;
  age: string | null;
  emirate: string | null;
  story: string | null;
  medical_other: string | null;
  medical_checks: string[];
  ear_tipped: boolean;
  microchip_number: string;
  vet_certificate_url: string;
  photos: string[];
  created_at: string;
  rescuer: { name: string } | null;
}

const CHECK_LABELS: Record<string, string> = {
  spayed_neutered: "spayed / neutered",
  vaccinated: "vaccinated",
  dewormed: "dewormed",
  flea_treated: "flea-treated",
  fiv_tested: "FIV tested",
  felv_tested: "FeLV tested",
  blood_panel: "blood panel",
  dental_done: "dental done",
  passport_ready: "passport ready",
  fit_to_fly: "fit to fly",
};

export default function ApprovalQueuePage() {
  const { admin, loading } = useAdmin();
  const [queue, setQueue] = useState<QueueAnimal[]>([]);
  const [queueLoading, setQueueLoading] = useState(true);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [certLinks, setCertLinks] = useState<Record<string, string>>({});
  const [bump, setBump] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabaseBrowser()
      .from("pets")
      .select(
        "id,ref,name,species,sex,age,emirate,story,medical_other,medical_checks,ear_tipped,microchip_number,vet_certificate_url,photos,created_at,rescuer:rescuers(name)"
      )
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false });
    setQueue((data as unknown as QueueAnimal[]) ?? []);
    setQueueLoading(false);
  }, []);

  useEffect(() => {
    if (admin) load();
  }, [admin, load]);

  // Signed URLs for the private vet certificates
  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const links: Record<string, string> = {};
      for (const a of queue) {
        if (a.vet_certificate_url && !a.vet_certificate_url.startsWith("pending")) {
          const { data } = await supabase.storage
            .from("vet-certificates")
            .createSignedUrl(a.vet_certificate_url, 3600);
          if (data?.signedUrl) links[a.id] = data.signedUrl;
        }
      }
      setCertLinks(links);
    })();
  }, [queue]);

  const act = async (
    id: string,
    status: "approved" | "changes_requested" | "rejected",
    actNote?: string
  ) => {
    const { error: err } = await supabaseBrowser()
      .from("pets")
      .update({ approval_status: status, approval_note: actNote ?? null })
      .eq("id", id);
    if (err) {
      setError("Couldn't save that decision. Try again.");
      return;
    }
    setError(null);
    setNoteFor(null);
    setNote("");
    setQueue((prev) => prev.filter((a) => a.id !== id));
    setBump((b) => b + 1);
  };

  const btn =
    "font-sans font-bold text-[13px] px-4 py-[9px] rounded-[10px] cursor-pointer transition-colors";

  return (
    <AdminShell admin={admin} onQueueChange={bump}>
      {loading || queueLoading ? (
        <div className="font-sans font-semibold text-[14px] text-cocoa/50">Loading…</div>
      ) : (
        <>
          <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0">
            Approvals
          </h1>
          <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mt-[3px] mb-[22px]">
            {queue.length === 0
              ? "Nothing waiting."
              : `${queue.length} listing${queue.length === 1 ? "" : "s"} waiting — newest first.`}
          </div>

          {error && (
            <div className="font-sans font-semibold text-[13px] text-badge-text mb-3">{error}</div>
          )}

          {queue.length === 0 ? (
            <div className="bg-white border border-cocoa/[.08] rounded-[16px] px-10 py-[60px] flex flex-col items-center text-center shadow-card">
              <EmptyStateHead />
              <div className="font-display font-extrabold text-[24px] text-cocoa mt-[18px] mb-2">
                Queue&rsquo;s clear
              </div>
              <div className="font-sans font-medium text-[15px] text-cocoa/65 max-w-[400px]">
                New listings from review-level rescuers will wait here for your
                once-over.
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5 max-w-[820px]">
              {queue.map((a) => (
                <div key={a.id} className="bg-white rounded-[16px] shadow-card p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-display font-extrabold text-[22px] text-cocoa">
                        {a.name}
                        <span className="font-sans font-semibold text-[13px] text-cocoa/50 ml-3">
                          {[a.species, a.sex?.toLowerCase(), a.age, a.emirate]
                            .filter(Boolean)
                            .join(" · ")}{" "}
                          · {a.ref}
                        </span>
                      </div>
                      <div className="font-sans font-semibold text-[12.5px] text-cocoa/55 mt-[2px]">
                        with {a.rescuer?.name ?? "—"} ·{" "}
                        {new Date(a.created_at).toISOString().slice(0, 10)}
                      </div>
                    </div>
                  </div>

                  {a.photos.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {a.photos.slice(0, 4).map((p) => (
                        <img
                          key={p}
                          src={p}
                          alt=""
                          className="w-[92px] h-[92px] object-cover rounded-[10px] bg-cream"
                        />
                      ))}
                    </div>
                  )}

                  {a.story && (
                    <p className="font-sans font-medium text-[14px] leading-[1.6] text-cocoa/80 m-0 mt-4">
                      {a.story}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-[6px] mt-4">
                    {a.ear_tipped && (
                      <span className="bg-tip-pink/[.16] text-badge-text font-sans font-bold text-[11px] px-[10px] py-1 rounded-[7px]">
                        ear-tipped
                      </span>
                    )}
                    {a.medical_checks.map((c) => (
                      <span
                        key={c}
                        className="bg-cream text-cocoa/75 font-sans font-bold text-[11px] px-[10px] py-1 rounded-[7px]"
                      >
                        {CHECK_LABELS[c] ?? c}
                      </span>
                    ))}
                  </div>
                  {a.medical_other && (
                    <p className="font-sans font-medium text-[13px] text-cocoa/70 m-0 mt-2">
                      {a.medical_other}
                    </p>
                  )}

                  <div className="flex items-center gap-5 mt-3 font-sans font-semibold text-[12.5px] text-cocoa/60">
                    <span className="font-mono">chip {a.microchip_number}</span>
                    {certLinks[a.id] ? (
                      <a href={certLinks[a.id]} target="_blank" rel="noopener noreferrer">
                        View vet certificate →
                      </a>
                    ) : (
                      <span className="text-cocoa/40">
                        certificate: {a.vet_certificate_url.startsWith("pending") ? "not uploaded" : "loading…"}
                      </span>
                    )}
                  </div>

                  {noteFor === a.id ? (
                    <div className="mt-4 flex flex-col gap-2">
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What needs to change? The rescuer sees this."
                        className="w-full box-border font-sans font-semibold text-[13.5px] text-cocoa bg-paper border-[1.5px] border-cocoa/[.15] rounded-[10px] px-3 py-[10px] outline-none focus:border-cocoa h-[74px] resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setNoteFor(null)} className={`${btn} text-cocoa/60 bg-transparent border-0`}>
                          Cancel
                        </button>
                        <button
                          onClick={() => act(a.id, "changes_requested", note.trim() || undefined)}
                          className={`${btn} bg-cream border-[1.5px] border-sunset text-link`}
                        >
                          Send back with note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => act(a.id, "approved")}
                        className={`${btn} bg-cocoa text-cream border-0 hover:bg-[#241A14]`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setNoteFor(a.id);
                          setNote("");
                        }}
                        className={`${btn} bg-transparent border-[1.5px] border-cocoa/25 text-cocoa hover:bg-cocoa/[.05]`}
                      >
                        Request changes
                      </button>
                      <button
                        onClick={() => act(a.id, "rejected")}
                        className={`${btn} bg-transparent border-[1.5px] border-[rgba(196,82,92,.4)] text-[#C4525C] hover:bg-[rgba(196,82,92,.08)]`}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
