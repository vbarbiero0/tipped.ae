"use client";

import { useEffect, useRef, useState } from "react";
import { adoptionMailto, fosterMailto } from "@/lib/mailto";
import type { Animal, Rescuer } from "@/lib/types";

// Hard rule 2: direct email, pre-filled subject + template body. The popover
// offers one mailto per intent the rescuer is open to (adopt / foster), plus
// a copy-the-address fallback for desktop visitors with no default mail app.
// Still no forms, nothing stored.
export default function EmailRescuerButton({
  animal,
  rescuer,
  size = "sm",
}: {
  animal: Animal;
  rescuer: Rescuer;
  size?: "sm" | "lg";
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const firstName = rescuer.name.split(" ")[0];
  const canAdopt = animal.for_adoption;
  const canFoster = animal.for_foster;
  const fosterOnly = canFoster && !canAdopt;
  const both = canAdopt && canFoster;
  const label = fosterOnly ? `Foster ${animal.name}` : `Email ${firstName}`;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(rescuer.email);
      setCopied(true);
    } catch {
      // Clipboard can be unavailable (http, old browsers) — the address is
      // visible in the popover, so the visitor can still select it by hand.
    }
  };

  const sizeClasses =
    size === "lg"
      ? "text-[15px] px-7 py-[15px] rounded-[12px] bg-cocoa text-cream hover:bg-[#241A14]"
      : "text-[12.5px] px-[14px] py-2 rounded-[9px] text-cocoa border-[1.5px] border-cocoa/30 hover:bg-cocoa hover:text-cream";

  const pillClass =
    "block text-center bg-cocoa text-cream no-underline font-sans font-bold text-[13.5px] py-[11px] rounded-[10px] hover:bg-[#241A14]";

  return (
    <span ref={wrapRef} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`font-sans font-bold whitespace-nowrap transition-colors cursor-pointer ${sizeClasses}`}
      >
        {label}
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 z-30 w-[264px] bg-white rounded-[18px] shadow-[0_8px_30px_rgba(58,42,34,.18)] p-4 text-left">
          <div className="flex flex-col gap-2">
            {canAdopt && (
              <a
                href={adoptionMailto(rescuer.email, animal.name, animal.ref)}
                onClick={() => setOpen(false)}
                className={pillClass}
              >
                {both ? "Ask about adopting" : "Open your email app"}
              </a>
            )}
            {canFoster && (
              <a
                href={fosterMailto(rescuer.email, animal.name, animal.ref)}
                onClick={() => setOpen(false)}
                className={pillClass}
              >
                {both ? "Ask about fostering" : "Open your email app"}
              </a>
            )}
          </div>
          <div className="font-sans font-semibold text-[11px] text-cocoa/45 text-center my-[10px]">
            or write from wherever you like
          </div>
          <div className="flex items-center justify-between gap-2 bg-paper rounded-[9px] pl-4 pr-[5px] py-[5px]">
            <span className="font-sans font-semibold text-[12.5px] text-cocoa truncate">
              {rescuer.email}
            </span>
            <button
              onClick={copyAddress}
              className={`font-sans font-bold text-[11.5px] px-3 py-[7px] rounded-[8px] cursor-pointer whitespace-nowrap transition-colors ${
                copied
                  ? "bg-sunset text-cocoa"
                  : "bg-cocoa text-cream hover:bg-[#241A14]"
              }`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="font-sans font-medium text-[11px] leading-[1.5] text-cocoa/50 mt-[10px]">
            Straight to {firstName}&rsquo;s inbox — subject and questions come
            pre-filled. No forms, nothing stored here.
            {canFoster && " Fostering is UAE-local."}
          </div>
        </div>
      )}
    </span>
  );
}
