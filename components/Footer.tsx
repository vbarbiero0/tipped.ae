"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TippedLogo from "./TippedLogo";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/brand";

// Hard rule 5: real rescuers appear only with their consent. Flip this to true
// once the credited groups have confirmed — the list is already wired up.
const SHOW_RESCUER_CREDITS = false;

const rescuerCredits = [
  "Dubai Street Kitties",
  "@straycatdubai",
  "@kevinofdxb",
  "Save Dubai Stray Cats",
  "@straycatsdxb",
  "@furrballs_cats",
  "Nine Lives",
  "Meow Meow Rescue",
  "Bin Kitty Collective",
  "@bubbles.petsrescue",
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) return null;
  return (
    <footer className="bg-cocoa">
      <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-16 pb-12 grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-14">
        <div>
          <div className="mb-[14px]">
            <TippedLogo size={30} inverted />
          </div>
          <p className="font-sans font-medium text-sm leading-relaxed text-cream/60 m-0 mb-[18px] max-w-[340px]">
            A home for the UAE&rsquo;s rescued street pets and the people who
            save them. Every tipped ear is an animal someone saved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-sans font-bold text-sm text-cream no-underline hover:text-sunset"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans font-bold text-sm text-cream no-underline hover:text-sunset"
            >
              @{INSTAGRAM_HANDLE}
            </a>
          </div>
          {/* Quiet site links — About/Contact live here now that the top bar
              is minimal */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 font-sans font-semibold text-[13px]">
            {[
              { href: "/about", label: "About tipped" },
              { href: "/contact", label: "Contact" },
              { href: "/transparency", label: "Open books" },
              { href: "/adopted", label: "Already home" },
              { href: "/how-it-works", label: "How it works" },
            ].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-cream/60 no-underline hover:text-cream"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="font-sans font-bold text-xs tracking-[.14em] text-cream/45 mb-[14px]">
            BUILT WITH THE UAE&rsquo;S RESCUE COMMUNITY
          </div>
          {SHOW_RESCUER_CREDITS ? (
            <div className="flex flex-wrap gap-x-[18px] gap-y-2 font-sans font-semibold text-[13px]">
              {rescuerCredits.map((name) => (
                <span key={name} className="text-cream/75">
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="font-sans font-medium text-[13px] leading-relaxed text-cream/60 m-0 max-w-[380px]">
              Rescuer credits go up here as each group confirms.
            </p>
          )}
          <div className="flex flex-col items-start gap-[6px] mt-3">
            <Link
              href="/dashboard/login"
              className="font-sans font-bold text-[13px] text-cream no-underline hover:text-sunset"
            >
              Rescuer sign in →
            </Link>
            <Link
              href="/rescuers#join"
              className="font-sans font-bold text-[13px] text-cream no-underline hover:text-sunset"
            >
              Rescue in the UAE? Sign up here →
            </Link>
          </div>
          <div className="font-sans font-semibold text-xs text-cream/35 mt-6">
            United Arab Emirates · every pet here is cared for by the rescuer who knows them best
          </div>
        </div>
      </div>
    </footer>
  );
}
