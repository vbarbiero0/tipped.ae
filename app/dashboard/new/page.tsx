"use client";

/* eslint-disable @next/next/no-img-element */
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { useRescuer } from "@/components/dashboard/useRescuer";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { alertPendingSubmission } from "./actions";
import { UploadIcon, CheckIcon } from "@/components/dashboard/icons";
import { EMIRATES } from "@/lib/emirates";

// Add/edit a pet — live against Supabase. Photos go to the public
// pet-photos bucket; the vet certificate goes to the PRIVATE
// vet-certificates bucket under the signed-in user's folder.

const MEDICAL_LABEL_TO_SLUG: Record<string, string> = {
  "spayed / neutered": "spayed_neutered",
  vaccinated: "vaccinated",
  dewormed: "dewormed",
  "flea-treated": "flea_treated",
  "FIV tested": "fiv_tested",
  "FeLV tested": "felv_tested",
  "blood panel done": "blood_panel",
  "dental done": "dental_done",
  "passport ready": "passport_ready",
  "fit to fly": "fit_to_fly",
};
// ear-tipped is its own boolean column (drives the brand badge), so it sits
// in the checklist UI but maps to `ear_tipped`, not medical_checks.
const EAR_TIPPED_LABEL = "ear-tipped";
const MEDICAL_OPTIONS = [...Object.keys(MEDICAL_LABEL_TO_SLUG), EAR_TIPPED_LABEL];

type DashStatus = "available" | "in_foster" | "adopted";
const STATUS_UI: Record<DashStatus, string> = {
  available: "available",
  in_foster: "in foster",
  adopted: "adopted",
};

const inputCls =
  "w-full box-border font-sans font-semibold text-[15px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[11px] px-[15px] py-[13px] outline-none focus:border-cocoa";
const labelCls = "block font-sans font-bold text-[13.5px] text-cocoa mb-[7px]";

function Segments<T extends string>({
  options,
  value,
  onChange,
  activeCls = "bg-cocoa text-cream",
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  activeCls?: string;
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`flex-1 text-center font-sans font-bold text-[14px] py-3 rounded-[11px] cursor-pointer transition-colors ${
            value === o
              ? activeCls
              : "bg-white border-[1.5px] border-cocoa/[.15] text-cocoa/70 hover:border-cocoa/40"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function AddAnimalForm() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit");
  const { rescuer, loading } = useRescuer();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"cat" | "dog" | "other">("cat");
  const [sex, setSex] = useState<"female" | "male">("female");
  const [age, setAge] = useState("");
  const [emirate, setEmirate] = useState<string>("Dubai");
  const [story, setStory] = useState("");
  const [status, setStatus] = useState<DashStatus>("available");
  const [checks, setChecks] = useState<Set<string>>(
    new Set(["spayed / neutered", "vaccinated", "dewormed", "ear-tipped"])
  );
  const [otherMedical, setOtherMedical] = useState("");
  const [chip, setChip] = useState("");
  // photo slots: existing URL | new File | null
  const [slots, setSlots] = useState<(string | File | null)[]>([null, null, null, null]);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [existingCert, setExistingCert] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const certRef = useRef<HTMLInputElement | null>(null);

  // Edit mode: prefill from the DB row
  useEffect(() => {
    if (!editId || !rescuer) return;
    let query = supabaseBrowser().from("pets").select("*").eq("id", editId);
    if (rescuer.role !== "admin") query = query.eq("rescuer_id", rescuer.id);
    query
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setName(data.name ?? "");
        setSpecies(data.species ?? "cat");
        setSex(data.sex === "Male" ? "male" : "female");
        setAge(data.age ?? "");
        setEmirate(data.emirate ?? "Dubai");
        setStory(data.story ?? "");
        setStatus(data.status ?? "available");
        setOtherMedical(data.medical_other ?? "");
        setChip(data.microchip_number ?? "");
        setExistingCert(data.vet_certificate_url ?? null);
        const next = new Set<string>();
        for (const [label, slug] of Object.entries(MEDICAL_LABEL_TO_SLUG))
          if ((data.medical_checks ?? []).includes(slug)) next.add(label);
        if (data.ear_tipped) next.add(EAR_TIPPED_LABEL);
        setChecks(next);
        const photos: (string | File | null)[] = [null, null, null, null];
        (data.photos ?? []).slice(0, 4).forEach((p: string, i: number) => (photos[i] = p));
        setSlots(photos);
      });
  }, [editId, rescuer]);

  const toggleCheck = (m: string) =>
    setChecks((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });

  const slotPreview = (s: string | File | null) =>
    typeof s === "string" ? s : s ? URL.createObjectURL(s) : null;

  const save = async () => {
    if (!rescuer) return;
    if (!name.trim()) return setError("A name is required.");
    if (!chip.trim()) return setError("The microchip number is required.");
    if (!certFile && !existingCert)
      return setError("The veterinarian certificate is required.");
    setBusy(true);
    setError(null);
    const supabase = supabaseBrowser();

    try {
      // Upload any new photos
      const photoUrls: string[] = [];
      for (const s of slots) {
        if (typeof s === "string") photoUrls.push(s);
        else if (s) {
          const path = `${rescuer.id}/${crypto.randomUUID()}`;
          const { error: upErr } = await supabase.storage
            .from("pet-photos")
            .upload(path, s, { contentType: s.type });
          if (upErr) throw upErr;
          photoUrls.push(
            supabase.storage.from("pet-photos").getPublicUrl(path).data.publicUrl
          );
        }
      }

      // Upload the certificate (private bucket, path must start with auth uid)
      let certUrl = existingCert;
      if (certFile) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const path = `${session!.user.id}/${crypto.randomUUID()}-${certFile.name}`;
        const { error: certErr } = await supabase.storage
          .from("vet-certificates")
          .upload(path, certFile, { contentType: certFile.type });
        if (certErr) throw certErr;
        certUrl = path; // private bucket — store the path, not a public URL
      }

      const medical_checks = [...checks]
        .filter((c) => c in MEDICAL_LABEL_TO_SLUG)
        .map((c) => MEDICAL_LABEL_TO_SLUG[c]);

      const row = {
        // Admins editing someone else's pet must not steal ownership
        ...(editId ? {} : { rescuer_id: rescuer.id }),
        name: name.trim(),
        species,
        sex: sex === "male" ? "Male" : "Female",
        age: age.trim() || null,
        emirate,
        story: story.trim() || null,
        medical_other: otherMedical.trim() || null,
        status,
        ear_tipped: checks.has(EAR_TIPPED_LABEL),
        microchipped: true,
        microchip_number: chip.trim(),
        vet_certificate_url: certUrl,
        medical_checks,
        photos: photoUrls,
      };

      if (editId) {
        const { error: dbErr } = await supabase.from("pets").update(row).eq("id", editId);
        if (dbErr) throw dbErr;
      } else {
        const { data: created, error: dbErr } = await supabase
          .from("pets")
          .insert(row)
          .select("id,approval_status")
          .single();
        if (dbErr) throw dbErr;
        // Telegram ping for the admin queue — capped at 1.5s and swallowed:
        // a notification failure must never block or fail the submission.
        if (created?.approval_status === "pending") {
          await Promise.race([
            alertPendingSubmission(created.id).catch(() => {}),
            new Promise((r) => setTimeout(r, 1500)),
          ]);
        }
      }
      router.push("/dashboard");
    } catch {
      setError("Couldn't save. Check your connection and try again.");
      setBusy(false);
    }
  };

  if (loading)
    return (
      <div className="font-sans font-semibold text-[14px] text-cocoa/50 p-[34px]">
        Loading…
      </div>
    );

  return (
    <main className="flex-1 px-[34px] pt-[30px] pb-[110px] relative min-w-0">
      <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0 mb-1">
        {editId ? `Edit ${name || "pet"}` : "Add a pet"}
      </h1>
      <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mb-[26px]">
        Goes live the moment you save — you can edit anytime.
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-7 max-w-[940px]">
        <div className="flex flex-col gap-[22px]">
          <div>
            <label className={labelCls}>
              Name <span className="text-[#C4525C]">*</span>
            </label>
            <input
              placeholder="e.g. Mango"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Species</label>
            <Segments
              options={["cat", "dog", "other"] as const}
              value={species}
              onChange={setSpecies}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Sex</label>
              <Segments options={["female", "male"] as const} value={sex} onChange={setSex} />
            </div>
            <div>
              <label className={labelCls}>Age</label>
              <input
                placeholder="~2 yrs"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Emirate</label>
            <div className="flex flex-wrap gap-2">
              {EMIRATES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmirate(e)}
                  className={`font-sans font-bold text-[13px] px-4 py-[10px] rounded-[10px] cursor-pointer transition-colors ${
                    emirate === e
                      ? "bg-cocoa text-cream"
                      : "bg-white border-[1.5px] border-cocoa/[.15] text-cocoa/70 hover:border-cocoa/40"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Their story</label>
            <textarea
              placeholder="Where you found them, what they're like, what kind of home fits…"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className={`${inputCls} h-[150px] resize-none leading-[1.6]`}
            />
          </div>

          <div>
            <label className={labelCls}>Status</label>
            <div className="flex gap-2">
              {(["available", "in_foster", "adopted"] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setStatus(o)}
                  className={`flex-1 text-center font-sans font-bold text-[14px] py-3 rounded-[11px] cursor-pointer transition-colors ${
                    status === o
                      ? "bg-sunset/[.16] border-[1.5px] border-sunset text-link"
                      : "bg-white border-[1.5px] border-cocoa/[.15] text-cocoa/70 hover:border-cocoa/40"
                  }`}
                >
                  {STATUS_UI[o]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[22px]">
          <div>
            <label className={labelCls}>
              Photos{" "}
              <span className="font-semibold text-cocoa/50">
                · 1–4, first is the main one · at least 1200 × 1500 px (4:5), JPG or
                PNG up to 10 MB
              </span>
            </label>
            <div className="grid grid-cols-4 gap-[10px]">
              {slots.map((s, i) => {
                const preview = slotPreview(s);
                return (
                  <div key={i} className="relative h-[110px]">
                    <button
                      type="button"
                      onClick={() => fileRefs.current[i]?.click()}
                      className="w-full h-full bg-cream rounded-[12px] overflow-hidden flex items-center justify-center font-sans font-bold text-[13px] text-cocoa/50 cursor-pointer border-0 hover:bg-[#FFEDD6]"
                    >
                      {preview ? (
                        <img src={preview} alt="" className="w-full h-full object-cover" />
                      ) : i === 0 ? (
                        "+ main"
                      ) : (
                        "+"
                      )}
                    </button>
                    {i === 0 && (
                      <span className="absolute left-[6px] top-[6px] bg-sunset text-cocoa font-sans font-bold text-[10px] px-2 py-[3px] rounded-[6px] pointer-events-none">
                        MAIN
                      </span>
                    )}
                    <input
                      ref={(el) => {
                        fileRefs.current[i] = el;
                      }}
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={(e) =>
                        setSlots((prev) => {
                          const next = [...prev];
                          next[i] = e.target.files?.[0] ?? null;
                          return next;
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelCls}>Medical</label>
            <div className="bg-white border-[1.5px] border-cocoa/[.12] rounded-[12px] px-4 py-[14px] grid grid-cols-2 gap-x-4 gap-y-[10px]">
              {MEDICAL_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleCheck(m)}
                  className="flex items-center gap-[9px] font-sans font-semibold text-[13.5px] text-cocoa cursor-pointer bg-transparent border-0 p-0 text-left"
                >
                  <span
                    className={`w-5 h-5 rounded-[6px] shrink-0 inline-flex items-center justify-center box-border ${
                      checks.has(m) ? "bg-cocoa" : "border-[1.5px] border-cocoa/25"
                    }`}
                  >
                    {checks.has(m) && <CheckIcon />}
                  </span>
                  {m}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Other / special cases — allergies, medication, quirks the vet flagged…"
              value={otherMedical}
              onChange={(e) => setOtherMedical(e.target.value)}
              className={`${inputCls} h-[70px] mt-[10px] resize-none text-[13.5px] leading-[1.55] px-[13px] py-[11px]`}
            />
          </div>

          <div>
            <label className={labelCls}>
              Microchip number <span className="text-[#C4525C]">*</span>
            </label>
            <input
              placeholder="15-digit chip number"
              value={chip}
              onChange={(e) => setChip(e.target.value)}
              className={`${inputCls} font-mono text-[14px]`}
            />
          </div>

          <div>
            <label className={labelCls}>
              Veterinarian certificate <span className="text-[#C4525C]">*</span>{" "}
              <span className="font-semibold text-cocoa/50">· photo or PDF</span>
            </label>
            <button
              type="button"
              onClick={() => certRef.current?.click()}
              className="w-full border-[1.5px] border-dashed border-cocoa/30 rounded-[12px] bg-white p-[22px] flex items-center justify-center gap-[10px] font-sans font-bold text-[14px] text-cocoa/65 cursor-pointer hover:border-cocoa hover:text-cocoa transition-colors"
            >
              <UploadIcon />
              {certFile?.name ?? (existingCert ? "Certificate on file — replace?" : "Upload certificate")}
            </button>
            <input
              ref={certRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => setCertFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {error && (
            <p className="font-sans font-semibold text-[13.5px] text-badge-text m-0">{error}</p>
          )}
        </div>
      </div>

      <div className="fixed left-[230px] right-0 bottom-0 bg-paper border-t border-cocoa/[.08] px-[34px] py-4 flex justify-end gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="font-sans font-bold text-[14.5px] text-cocoa border-[1.5px] border-cocoa/25 px-6 py-[13px] rounded-[11px] cursor-pointer bg-transparent hover:bg-cocoa/[.05]"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={busy}
          className="font-sans font-bold text-[14.5px] text-cream bg-cocoa px-[34px] py-[13px] rounded-[11px] cursor-pointer border-0 hover:bg-[#241A14] disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save — goes live now"}
        </button>
      </div>
    </main>
  );
}

export default function AddPetPage() {
  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <Suspense
        fallback={
          <div className="font-sans font-semibold text-[14px] text-cocoa/50 p-[34px]">
            Loading…
          </div>
        }
      >
        <AddAnimalForm />
      </Suspense>
    </div>
  );
}
