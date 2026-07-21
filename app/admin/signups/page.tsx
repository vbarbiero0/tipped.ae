"use client";

import { useEffect, useState } from "react";
import AdminShell, { useAdmin } from "@/components/admin/AdminShell";
import { supabaseBrowser } from "@/lib/supabase-browser";

// Shop-interest signups: view + CSV export.

interface Signup {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminSignupsPage() {
  const { admin, loading } = useAdmin();
  const [rows, setRows] = useState<Signup[]>([]);

  useEffect(() => {
    if (!admin) return;
    supabaseBrowser()
      .from("shop_signups")
      .select("id,email,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as Signup[]) ?? []));
  }, [admin]);

  const downloadCsv = () => {
    const csv = ["email,signed_up"]
      .concat(rows.map((r) => `${r.email},${r.created_at.slice(0, 10)}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tipped-shop-signups.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <AdminShell admin={admin}>
      {loading ? (
        <div className="font-sans font-semibold text-[14px] text-cocoa/50">Loading…</div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-[22px]">
            <div>
              <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0">Signups</h1>
              <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mt-[3px]">
                {rows.length} waiting to hear about the shop
              </div>
            </div>
            {rows.length > 0 && (
              <button
                onClick={downloadCsv}
                className="bg-cocoa text-cream font-sans font-bold text-[14px] px-5 py-3 rounded-[11px] cursor-pointer border-0 hover:bg-[#241A14]"
              >
                Download CSV
              </button>
            )}
          </div>

          <div className="bg-white rounded-[16px] shadow-card overflow-hidden max-w-[560px]">
            {rows.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-baseline justify-between gap-3 px-5 py-3 ${
                  i < rows.length - 1 ? "border-b border-cocoa/[.07]" : ""
                }`}
              >
                <span className="font-sans font-semibold text-[14px] text-cocoa truncate">
                  {r.email}
                </span>
                <span className="font-mono text-[11.5px] text-cocoa/50">
                  {r.created_at.slice(0, 10)}
                </span>
              </div>
            ))}
            {rows.length === 0 && (
              <div className="px-5 py-8 font-sans font-medium text-[14px] text-cocoa/55">
                No signups yet — they&rsquo;ll appear the moment someone leaves an
                email on the shop page.
              </div>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
