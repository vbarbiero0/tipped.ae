"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TippedLogo from "./TippedLogo";

// Primary stays visible on desktop; everything informational lives behind
// the three lines. On mobile the primary links fold into the menu too.
const primary = [
  { href: "/shop", label: "Shop" },
  { href: "/rescuers", label: "Meet our rescuers" },
];

const secondary = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/transparency", label: "Where the money goes" },
  { href: "/about", label: "About tipped" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

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

  const item =
    "block px-4 py-[10px] rounded-[9px] font-sans font-semibold text-[14px] text-cocoa no-underline hover:bg-paper";

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur">
      <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-[18px] md:py-[22px] flex items-center justify-between gap-6">
        <Link href="/" className="no-underline" aria-label="tipped — home">
          <TippedLogo size={26} />
        </Link>
        <nav className="flex items-center gap-5 md:gap-7 font-sans font-semibold text-sm">
          {primary.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hidden md:inline text-cocoa no-underline hover:text-link"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/adopt"
            className="bg-cocoa text-cream no-underline px-5 py-[10px] rounded-[10px] font-bold hover:bg-[#241A14]"
          >
            Find your animal
          </Link>

          {/* The three lines */}
          <div ref={wrapRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Menu"
              className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded-[10px] cursor-pointer border-[1.5px] border-cocoa/25 hover:border-cocoa transition-colors bg-transparent"
            >
              <span className="block w-[16px] h-[2px] rounded-full bg-cocoa" />
              <span className="block w-[16px] h-[2px] rounded-full bg-cocoa" />
              <span className="block w-[16px] h-[2px] rounded-full bg-cocoa" />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-[232px] bg-white rounded-[14px] shadow-[0_8px_30px_rgba(58,42,34,.18)] p-2 z-50">
                {/* Primary links appear here only on small screens */}
                <div className="md:hidden">
                  {primary.map((n) => (
                    <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={item}>
                      {n.label}
                    </Link>
                  ))}
                  <div className="h-px bg-cocoa/10 mx-3 my-2" />
                </div>
                {secondary.map((n) => (
                  <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={item}>
                    {n.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
