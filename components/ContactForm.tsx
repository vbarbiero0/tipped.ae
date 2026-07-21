"use client";

import { useState } from "react";
import { sendContactMessage } from "@/app/contact/actions";

const field =
  "font-sans font-semibold text-[14px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[10px] px-4 py-3 outline-none focus:border-cocoa/40 w-full";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  const canSend = name.trim() && email.includes("@") && message.trim();

  const submit = async () => {
    if (!canSend || busy) return;
    setBusy(true);
    const { ok } = await sendContactMessage({ name, email, message, website });
    setState(ok ? "done" : "error");
    setBusy(false);
  };

  if (state === "done")
    return (
      <div className="bg-white rounded-[18px] shadow-card p-6 max-w-[560px]">
        <div className="font-display font-extrabold text-[20px] text-cocoa mb-1">
          Sent. 📨
        </div>
        <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/70 m-0">
          It&rsquo;s already on Vanessa&rsquo;s phone — you&rsquo;ll hear back
          at <span className="font-bold">{email.trim()}</span>.
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded-[18px] shadow-card p-6 max-w-[560px]">
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className={field} />
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What's on your mind — adopting, fostering, the shop, the books…"
        rows={4}
        className={`${field} resize-none mb-3`}
      />
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
        {busy ? "Sending…" : "Send"}
      </button>
    </div>
  );
}
