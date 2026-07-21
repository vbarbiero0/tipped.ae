"use client";

import { useState } from "react";
import { applyAsRescuer } from "@/app/rescuers/actions";
import { SOCIAL_PLATFORMS, Social } from "@/lib/socials";
import { EMIRATES } from "@/lib/emirates";

// The join box on /rescuers#join — one short message, same-day listing.
// Success swaps the form for a quiet confirmation; the mailto stays as a
// fallback link beside it (rendered by the parent).

const field =
  "font-sans font-semibold text-[14px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[10px] px-4 py-3 outline-none focus:border-cocoa/40 w-full";

export default function JoinForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emirate, setEmirate] = useState("Dubai");
  const [phone, setPhone] = useState("");
  const [vets, setVets] = useState("");
  const [socials, setSocials] = useState<Social[]>([{ platform: "instagram", handle: "" }]);
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  const canSend =
    name.trim() && email.includes("@") && phone.trim() && vets.trim();

  const submit = async () => {
    if (!canSend || busy) return;
    setBusy(true);
    const { ok } = await applyAsRescuer({
      name, email, emirate, phone, vets, note, website,
      socials: socials.filter((x) => x.handle.trim()),
    });
    setState(ok ? "done" : "error");
    setBusy(false);
  };

  if (state === "done")
    return (
      <div className="bg-white rounded-[18px] shadow-card p-6 max-w-[520px]">
        <div className="font-display font-extrabold text-[20px] text-cocoa mb-1">
          Got it. 🎉
        </div>
        <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/70 m-0">
          Vanessa reads every application herself — you&rsquo;ll hear back at{" "}
          <span className="font-bold">{email.trim()}</span>, usually the same
          day. Your first pet can be live right after.
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded-[18px] shadow-card p-6 max-w-[520px]">
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name or group" className={field} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className={field} />
        <select value={emirate} onChange={(e) => setEmirate(e.target.value)} className={field}>
          {EMIRATES.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Phone (WhatsApp is fine)" className={field} />
      </div>
      <input
        value={vets}
        onChange={(e) => setVets(e.target.value)}
        placeholder="Vet clinic(s) you usually work with — they help us confirm it's you"
        className={`${field} mb-3`}
      />
      <div className="flex flex-col gap-2 mb-3">
        {socials.map((x, i) => (
          <div key={i} className="flex gap-2">
            <select
              value={x.platform}
              onChange={(e) =>
                setSocials((prev) =>
                  prev.map((p, j) => (j === i ? { ...p, platform: e.target.value as Social["platform"] } : p))
                )
              }
              className={`${field} w-[120px] shrink-0`}
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <input
              value={x.handle}
              onChange={(e) =>
                setSocials((prev) => prev.map((p, j) => (j === i ? { ...p, handle: e.target.value } : p)))
              }
              placeholder={x.platform === "other" ? "https://…" : "@handle (optional)"}
              className={field}
            />
          </div>
        ))}
        {socials.length < 3 && (
          <button
            onClick={() => setSocials((prev) => [...prev, { platform: "facebook", handle: "" }])}
            className="self-start font-sans font-bold text-[13px] text-cocoa/60 bg-transparent border-0 p-0 cursor-pointer hover:text-cocoa"
          >
            + Add another social
          </button>
        )}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="A few words — how many pets, how long you've been rescuing…"
        rows={3}
        className={`${field} resize-none mb-3`}
      />
      {/* Honeypot — hidden from people, irresistible to bots */}
      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute opacity-0 pointer-events-none h-0 w-0"
        placeholder="Website"
      />
      {state === "error" && (
        <div className="font-sans font-semibold text-[13px] text-badge-text mb-3">
          Couldn&rsquo;t send — check the email address and try again.
        </div>
      )}
      <button
        onClick={submit}
        disabled={busy || !canSend}
        className="bg-cocoa text-cream font-sans font-bold text-[15px] px-7 py-[14px] rounded-[12px] cursor-pointer border-0 hover:bg-[#241A14] disabled:opacity-40 disabled:cursor-default"
      >
        {busy ? "Sending…" : "Send it"}
      </button>
    </div>
  );
}
