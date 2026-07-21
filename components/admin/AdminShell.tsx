"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import TippedLogo from "@/components/TippedLogo";
import { signOutRescuer, useRescuer, type DashRescuer } from "@/components/dashboard/useRescuer";
import { supabaseBrowser } from "@/lib/supabase-browser";

// Admin chrome. Guards role='admin' (others land back on their dashboard),
// shows the pending-approval badge, and hands the admin identity to pages.

const nav = [
  { href: "/admin", label: "Approvals" },
  { href: "/admin/rescuers", label: "Rescuers" },
  { href: "/admin/pets", label: "All pets" },
  { href: "/admin/ledger", label: "Ledger" },
  { href: "/admin/signups", label: "Signups" },
];

export function useAdmin() {
  const router = useRouter();
  const { rescuer, loading } = useRescuer();
  useEffect(() => {
    if (!loading && rescuer && rescuer.role !== "admin") router.replace("/dashboard");
  }, [loading, rescuer, router]);
  return { admin: rescuer?.role === "admin" ? rescuer : null, loading };
}

export default function AdminShell({
  admin,
  children,
  onQueueChange,
}: {
  admin: DashRescuer | null;
  children: React.ReactNode;
  onQueueChange?: number; // bump to refresh the badge
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    if (!admin) return;
    supabaseBrowser()
      .from("pets")
      .select("id", { count: "exact", head: true })
      .eq("approval_status", "pending")
      .then(({ count }) => setPending(count ?? 0));
  }, [admin, onQueueChange]);

  return (
    <div className="flex min-h-screen font-sans bg-paper">
      <aside className="w-[230px] shrink-0 bg-white border-r border-cocoa/[.08] flex flex-col px-[14px] pt-[22px] pb-[18px] min-h-screen">
        <Link href="/" className="no-underline px-[10px] pb-1" aria-label="tipped — home">
          <TippedLogo size={24} />
        </Link>
        <div className="px-[10px] pb-[18px] font-sans font-bold text-[10.5px] tracking-[.14em] text-cocoa/40">
          ADMIN
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`flex items-center justify-between px-3 py-[11px] rounded-[10px] no-underline font-sans text-[14px] transition-colors ${
                  active
                    ? "bg-cream font-bold text-cocoa"
                    : "font-semibold text-cocoa/70 hover:bg-cocoa/[.05] hover:text-cocoa"
                }`}
              >
                {it.label}
                {it.href === "/admin" && pending !== null && pending > 0 && (
                  <span className="bg-sunset text-cocoa font-sans font-bold text-[11px] min-w-[20px] h-5 px-[6px] rounded-[6px] inline-flex items-center justify-center">
                    {pending}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto bg-paper border border-cocoa/[.08] rounded-[12px] p-3">
          <div className="font-sans font-bold text-[13px] text-cocoa">{admin?.name}</div>
          <div className="font-sans font-semibold text-[11.5px] text-cocoa/55 mt-[2px]">
            admin
          </div>
          <div className="flex gap-3 mt-2">
            <Link
              href="/dashboard"
              className="font-sans font-bold text-[11.5px] text-cocoa/60 hover:text-cocoa no-underline"
            >
              My Pets
            </Link>
            <button
              onClick={() => signOutRescuer(router)}
              className="font-sans font-bold text-[11.5px] text-cocoa/60 hover:text-cocoa cursor-pointer bg-transparent border-0 p-0"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 px-[34px] py-[30px] min-w-0">{children}</main>
    </div>
  );
}
