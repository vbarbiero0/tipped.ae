"use client";

import { useState } from "react";
import { applyAsRescuer } from "@/app/rescuers/actions";
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
  const [instagram, setInstagram] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  const submit = async () => {
    if (!name.trim() || !email.includes("@") || busy) return;
    setBusy(true);
    const { ok } = await applyAsRescuer({ name, email, emirate, instagram, note, website });
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
        <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram (optional)" className={field} />
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
        disabled={busy || !name.trim() || !email.includes("@")}
        className="bg-cocoa text-cream font-sans font-bold text-[15px] px-7 py-[14px] rounded-[12px] cursor-pointer border-0 hover:bg-[#241A14] disabled:opacity-40 disabled:cursor-default"
      >
        {busy ? "Sending…" : "Send it"}
      </button>
    </div>
  );
}
