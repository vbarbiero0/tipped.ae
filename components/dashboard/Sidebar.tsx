"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TippedLogo from "@/components/TippedLogo";
import { COCOA, EAR_PINK } from "@/lib/brand";

// Rescuer dashboard sidebar per `Tipped Rescuer Dashboard.dc.html`.
// Demo identity (Silvana) until rescuer auth exists.

function CatHeadIcon({ active }: { active: boolean }) {
  return (
    <svg width="17" height="15" viewBox="0 0 120 110" aria-hidden>
      <path
        d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 C57,30 63,30 68,32 L74,18 L86,14 L92,52 C96,60 96,70 92,78 C84,96 36,96 28,78 C24,70 24,60 28,52 Z"
        fill="currentColor"
      />
      {active && <path d="M68,32 L74,18 L86,14 L92,52 Z" fill={EAR_PINK} />}
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M10,4 V16 M4,10 H16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4,17 C4.8,13.8 7.1,12.2 10,12.2 C12.9,12.2 15.2,13.8 16,17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const items = [
  { href: "/dashboard", label: "My animals", icon: CatHeadIcon },
  { href: "/dashboard/new", label: "Add an animal", icon: PlusIcon },
  { href: "/dashboard/profile", label: "My profile", icon: PersonIcon },
];

export interface SidebarRescuer {
  name: string;
  username: string | null;
  emirate: string | null;
}

export default function Sidebar({
  showRescuerCard = false,
  rescuer,
  onSignOut,
}: {
  showRescuerCard?: boolean;
  rescuer?: SidebarRescuer | null;
  onSignOut?: () => void;
}) {
  const pathname = usePathname();
  return (
    <aside className="w-[230px] shrink-0 bg-white border-r border-cocoa/[.08] flex flex-col px-[14px] pt-[22px] pb-[18px] min-h-screen">
      <Link href="/" className="no-underline px-[10px] pb-[22px]" aria-label="tipped — home">
        <TippedLogo size={24} />
      </Link>
      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const active = pathname === it.href;
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-[11px] px-3 py-[11px] rounded-[10px] no-underline font-sans text-[14px] transition-colors ${
                active
                  ? "bg-cream font-bold text-cocoa"
                  : "font-semibold text-cocoa/70 hover:bg-cocoa/[.05] hover:text-cocoa"
              }`}
              style={active ? { color: COCOA } : undefined}
            >
              <Icon active={active} />
              {it.label}
            </Link>
          );
        })}
      </nav>
      {showRescuerCard && rescuer && (
        <div className="mt-auto bg-paper border border-cocoa/[.08] rounded-[12px] p-3">
          <div className="font-sans font-bold text-[13px] text-cocoa">{rescuer.name}</div>
          <div className="font-sans font-semibold text-[11.5px] text-cocoa/55 mt-[2px]">
            {rescuer.username ? `@${rescuer.username} · ` : ""}
            {rescuer.emirate}
          </div>
          <div className="font-sans font-semibold text-[11px] text-cocoa/40 mt-2">
            Posts go live immediately — no review step.
          </div>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="font-sans font-bold text-[11.5px] text-cocoa/60 hover:text-cocoa cursor-pointer bg-transparent border-0 p-0 mt-2"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
