"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { UploadIcon, CheckIcon } from "@/components/dashboard/icons";
import { EMIRATES } from "@/lib/emirates";

// Screen 2 of `Tipped Rescuer Dashboard.dc.html` — add/edit an animal.
// Front-end demo: all state is local, Save returns to the list.

const MEDICAL_OPTIONS = [
  "spayed / neutered",
  "vaccinated",
  "dewormed",
  "flea-treated",
  "FIV tested",
  "FeLV tested",
  "blood panel done",
  "dental done",
  "ear-tipped",
  "passport ready",
  "fit to fly",
];

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

export default function AddAnimalPage() {
  const router = useRouter();
  const [species, setSpecies] = useState<"cat" | "dog" | "other">("cat");
  const [sex, setSex] = useState<"female" | "male">("female");
  const [emirate, setEmirate] = useState<string>("Dubai");
  const [status, setStatus] = useState<"available" | "in foster" | "adopted">("available");
  const [medical, setMedical] = useState<Set<string>>(
    new Set(["spayed / neutered", "vaccinated", "dewormed", "ear-tipped"])
  );
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [certName, setCertName] = useState<string | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const certRef = useRef<HTMLInputElement | null>(null);

  const toggleMedical = (m: string) =>
    setMedical((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });

  const setPhoto = (i: number, file: File | null) =>
    setPhotos((prev) => {
      const next = [...prev];
      next[i] = file ? URL.createObjectURL(file) : null;
      return next;
    });

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 px-[34px] pt-[30px] pb-[110px] relative min-w-0">
        <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0 mb-1">
          Add an animal
        </h1>
        <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mb-[26px]">
          Goes live the moment you save — you can edit anytime.
        </div>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-7 max-w-[940px]">
          {/* Left column */}
          <div className="flex flex-col gap-[22px]">
            <div>
              <label className={labelCls}>
                Name <span className="text-[#C4525C]">*</span>
              </label>
              <input placeholder="e.g. Mango" className={inputCls} />
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
                <Segments
                  options={["female", "male"] as const}
                  value={sex}
                  onChange={setSex}
                />
              </div>
              <div>
                <label className={labelCls}>Age</label>
                <input placeholder="~2 yrs" className={inputCls} />
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
                className={`${inputCls} h-[150px] resize-none leading-[1.6]`}
              />
            </div>

            <div>
              <label className={labelCls}>Status</label>
              <Segments
                options={["available", "in foster", "adopted"] as const}
                value={status}
                onChange={setStatus}
                activeCls="bg-sunset/[.16] border-[1.5px] border-sunset text-link"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-[22px]">
            <div>
              <label className={labelCls}>
                Photos{" "}
                <span className="font-semibold text-cocoa/50">
                  · 1–4, first is the main one · at least 1200 × 1500 px (4:5),
                  JPG or PNG up to 10 MB
                </span>
              </label>
              <div className="grid grid-cols-4 gap-[10px]">
                {photos.map((p, i) => (
                  <div key={i} className="relative h-[110px]">
                    <button
                      type="button"
                      onClick={() => fileRefs.current[i]?.click()}
                      className="w-full h-full bg-cream rounded-[12px] overflow-hidden flex items-center justify-center font-sans font-bold text-[13px] text-cocoa/50 cursor-pointer border-0 hover:bg-[#FFEDD6]"
                    >
                      {p ? (
                        <img src={p} alt="" className="w-full h-full object-cover" />
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
                      onChange={(e) => setPhoto(i, e.target.files?.[0] ?? null)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Medical</label>
              <div className="bg-white border-[1.5px] border-cocoa/[.12] rounded-[12px] px-4 py-[14px] grid grid-cols-2 gap-x-4 gap-y-[10px]">
                {MEDICAL_OPTIONS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMedical(m)}
                    className="flex items-center gap-[9px] font-sans font-semibold text-[13.5px] text-cocoa cursor-pointer bg-transparent border-0 p-0 text-left"
                  >
                    <span
                      className={`w-5 h-5 rounded-[6px] shrink-0 inline-flex items-center justify-center box-border ${
                        medical.has(m)
                          ? "bg-cocoa"
                          : "border-[1.5px] border-cocoa/25"
                      }`}
                    >
                      {medical.has(m) && <CheckIcon />}
                    </span>
                    {m}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Other / special cases — allergies, medication, quirks the vet flagged…"
                className={`${inputCls} h-[70px] mt-[10px] resize-none text-[13.5px] leading-[1.55] px-[13px] py-[11px]`}
              />
            </div>

            <div>
              <label className={labelCls}>
                Microchip number <span className="text-[#C4525C]">*</span>
              </label>
              <input
                placeholder="15-digit chip number"
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
                {certName ?? "Upload certificate"}
              </button>
              <input
                ref={certRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setCertName(e.target.files?.[0]?.name ?? null)}
              />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="fixed left-[230px] right-0 bottom-0 bg-paper border-t border-cocoa/[.08] px-[34px] py-4 flex justify-end gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="font-sans font-bold text-[14.5px] text-cocoa border-[1.5px] border-cocoa/25 px-6 py-[13px] rounded-[11px] cursor-pointer bg-transparent hover:bg-cocoa/[.05]"
          >
            Cancel
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="font-sans font-bold text-[14.5px] text-cream bg-cocoa px-[34px] py-[13px] rounded-[11px] cursor-pointer border-0 hover:bg-[#241A14]"
          >
            Save — goes live now
          </button>
        </div>
      </main>
    </div>
  );
}
