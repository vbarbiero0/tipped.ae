"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TippedLogo from "./TippedLogo";
import { COCOA, EAR_PINK, EAR_SUNSET } from "@/lib/brand";

// Floating bar (Solidroad-style layout, tipped's skin). Desktop follows the
// design spec exactly; on phones the bar compresses — the dropdown gains the
// links that fall off, and the CTA collapses to its arrow tile.

function HeadIcon() {
  // Monogram head as a Cocoa silhouette, pink tipped ear
  return (
    <svg width="22" viewBox="0 0 120 110" aria-hidden>
      <path
        d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 C57,30 63,30 68,32 L74,18 L86,14 L92,52 C96,60 96,70 92,78 C84,96 36,96 28,78 C24,70 24,60 28,52 Z"
        fill={COCOA}
      />
      <path d="M68,32 L74,18 L86,14 L92,52 Z" fill={EAR_PINK} />
    </svg>
  );
}

function ListIcon() {
  // 3 Sunset dots + 3 Cocoa lines
  return (
    <svg width="18" viewBox="0 0 20 16" aria-hidden>
      {[3, 8, 13].map((y) => (
        <circle key={y} cx="3" cy={y} r="1.6" fill={EAR_SUNSET} />
      ))}
      {[2.2, 7.2, 12.2].map((y) => (
        <rect key={y} x="7.5" y={y} width="10" height="1.6" rx="0.8" fill={COCOA} />
      ))}
    </svg>
  );
}

function BookIcon() {
  // Open-book outline
  return (
    <svg
      width="20"
      viewBox="0 0 20 16"
      fill="none"
      stroke={COCOA}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2,3 C4.5,1.6 7.5,1.6 10,3 C12.5,1.6 15.5,1.6 18,3 L18,13 C15.5,11.6 12.5,11.6 10,13 C7.5,11.6 4.5,11.6 2,13 Z" />
      <path d="M10,3 L10,13" />
    </svg>
  );
}

const rows = [
  {
    href: "/pets",
    title: "Browse pets",
    desc: "Every listing written by the rescuer",
    icon: <HeadIcon />,
  },
  {
    href: "/how-it-works",
    title: "How it works",
    desc: "Adopting or fostering, in plain steps",
    icon: <ListIcon />,
  },
  {
    href: "/transparency",
    title: "Vet bills & receipts",
    desc: "Paid to the clinic — receipts public",
    icon: <BookIcon />,
  },
];

// Off-bar links: on desktop these live in the bar / footer; on phones they
// join the dropdown so nothing is unreachable.
const mobileOnly = [
  { href: "/shop", label: "Shop" },
  { href: "/rescuers", label: "Rescuers" },
  { href: "/about", label: "About tipped" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  // The rescuer dashboard has its own sidebar chrome
  const inDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  // Hide the bar while scrolling down, bring it back on any scroll up.
  // The back-to-top tile appears once the visitor is deep in the page.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setShowTop(y > 600);
      if (y < 80) {
        setHidden(false);
      } else if (y > lastY + 4) {
        setHidden(true);
        setOpen(false);
      } else if (y < lastY - 4) {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const navItem =
    "font-sans font-semibold text-[14.5px] text-cocoa no-underline px-3 py-[9px] rounded-[9px] hover:bg-cocoa/[.06] transition-colors";

  if (inDashboard) return null;

  return (
    <>
    <header
      className={`sticky top-[14px] z-[60] mt-[14px] px-6 transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-[130%]" : "translate-y-0"
      }`}
    >
      <div className="max-w-[1060px] mx-auto bg-white border border-cocoa/[.07] rounded-[18px] shadow-[0_12px_34px_rgba(58,42,34,.12)] pl-[14px] pr-3 py-[10px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left group */}
        <div className="flex items-center justify-start gap-1" ref={wrapRef}>
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={`${navItem} inline-flex items-center gap-[7px] cursor-pointer bg-transparent border-0 whitespace-nowrap`}
            >
              <span className="sm:hidden">Menu</span>
              <span className="hidden sm:inline">Adopt &amp; foster</span>
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                stroke={COCOA}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200"
                style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                aria-hidden
              >
                <path d="M1,1 L5,5 L9,1" />
              </svg>
            </button>

            {open && (
              <div className="nav-panel-in absolute left-0 top-full mt-4 w-[300px] bg-white border border-cocoa/[.09] rounded-[14px] shadow-[0_24px_60px_rgba(58,42,34,.18)] p-2 z-50">
                {rows.map((r, i) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    onClick={() => setOpen(false)}
                    className="nav-row-in flex items-center gap-3 px-3 py-[10px] rounded-[10px] no-underline hover:bg-cocoa/[.05]"
                    style={{ animationDelay: `${0.05 * (i + 1)}s` }}
                  >
                    <span className="w-9 h-9 shrink-0 bg-cream rounded-[9px] flex items-center justify-center">
                      {r.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-sans font-bold text-[14.5px] text-cocoa leading-tight">
                        {r.title}
                      </span>
                      <span className="block font-sans font-medium text-[12.5px] text-cocoa/55 leading-snug">
                        {r.desc}
                      </span>
                    </span>
                  </Link>
                ))}
                {/* Phones only: everything that fell off the compressed bar */}
                <div className="md:hidden">
                  <div className="h-px bg-cocoa/10 mx-3 my-2" />
                  {mobileOnly.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 rounded-[9px] font-sans font-semibold text-[14px] text-cocoa no-underline hover:bg-cocoa/[.05]"
                    >
                      {n.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/shop" className={`${navItem} hidden md:inline`}>
            Shop
          </Link>
          <Link href="/rescuers" className={`${navItem} hidden md:inline`}>
            Rescuers
          </Link>
        </div>

        {/* Center: wordmark */}
        <Link href="/" className="no-underline justify-self-center" aria-label="tipped — home">
          <TippedLogo size={25} />
        </Link>

        {/* Right group */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/transparency"
            className="hidden md:inline font-sans font-semibold text-[14.5px] text-cocoa no-underline hover:text-link transition-colors"
          >
            Open books
          </Link>
          <Link
            href="/pets"
            className="inline-flex items-center gap-3 bg-cocoa text-cream no-underline font-sans font-bold text-[14px] rounded-[12px] p-2 sm:pl-5 hover:bg-[#241A14]"
          >
            <span className="hidden sm:inline">Find your pet</span>
            <span className="w-[26px] h-[26px] bg-sunset rounded-[8px] flex items-center justify-center text-cocoa font-bold text-[14px] leading-none">
              →
            </span>
          </Link>
        </div>
      </div>
    </header>

      {/* Back to top — lives outside the header: a CSS transform on an
          ancestor would hijack position:fixed */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-[60] w-11 h-11 rounded-[12px] bg-cocoa text-cream shadow-[0_10px_28px_rgba(58,42,34,.28)] flex items-center justify-center font-sans font-bold text-[16px] cursor-pointer hover:bg-[#241A14] transition-all duration-300 ${
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        ↑
      </button>
    </>
  );
}
