"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminShell, { useAdmin } from "@/components/admin/AdminShell";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { EMIRATES } from "@/lib/emirates";

// Every pet on the platform: search, filter, edit, unpublish, and the
// homepage-featured toggles (max 3).

interface Row {
  id: string;
  ref: string;
  name: string;
  species: string;
  emirate: string | null;
  status: string;
  approval_status: string;
  featured: boolean;
  photos: string[];
  rescuer_id: string;
  rescuer: { name: string } | null;
}

const speciesEmoji: Record<string, string> = { cat: "🐈", dog: "🐕", other: "🦜" };

export default function AdminPetsPage() {
  const { admin, loading } = useAdmin();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [species, setSpecies] = useState("all");
  const [emirate, setEmirate] = useState("all");
  const [status, setStatus] = useState("all");
  const [rescuerFilter, setRescuerFilter] = useState("all");
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabaseBrowser()
      .from("pets")
      .select("id,ref,name,species,emirate,status,approval_status,featured,photos,rescuer_id,rescuer:rescuers(name)")
      .order("created_at", { ascending: false });
    setRows((data as unknown as Row[]) ?? []);
  }, []);

  useEffect(() => {
    if (admin) load();
  }, [admin, load]);

  const rescuers = useMemo(() => {
    const m = new Map<string, string>();
    rows.forEach((r) => m.set(r.rescuer_id, r.rescuer?.name ?? "—"));
    return [...m.entries()];
  }, [rows]);

  const filtered = rows.filter(
    (r) =>
      (q === "" || r.name.toLowerCase().includes(q.toLowerCase()) || r.ref.toLowerCase().includes(q.toLowerCase())) &&
      (species === "all" || r.species === species) &&
      (emirate === "all" || r.emirate === emirate) &&
      (status === "all" || r.status === status) &&
      (rescuerFilter === "all" || r.rescuer_id === rescuerFilter)
  );

  const featuredCount = rows.filter((r) => r.featured).length;

  const patch = async (id: string, fields: Partial<Row>, note?: string) => {
    const { error } = await supabaseBrowser().from("pets").update(fields).eq("id", id);
    if (error) {
      setMsg("Couldn't save. Try again.");
      return;
    }
    setMsg(note ?? null);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...fields } : r)));
  };

  const toggleFeatured = (r: Row) => {
    if (!r.featured && featuredCount >= 3) {
      setMsg("Three pets are already featured — unfeature one first.");
      return;
    }
    patch(r.id, { featured: !r.featured });
  };

  const selCls =
    "font-sans font-semibold text-[13px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[9px] px-3 py-2";

  return (
    <AdminShell admin={admin}>
      {loading ? (
        <div className="font-sans font-semibold text-[14px] text-cocoa/50">Loading…</div>
      ) : (
        <>
          <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0">All pets</h1>
          <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mt-[3px] mb-4">
            {rows.length} on the platform · {featuredCount}/3 featured on the homepage
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or ref…"
              className={`${selCls} min-w-[200px]`}
            />
            <select value={species} onChange={(e) => setSpecies(e.target.value)} className={selCls}>
              <option value="all">All species</option>
              <option value="cat">Cats</option>
              <option value="dog">Dogs</option>
              <option value="other">Other</option>
            </select>
            <select value={emirate} onChange={(e) => setEmirate(e.target.value)} className={selCls}>
              <option value="all">All emirates</option>
              {EMIRATES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selCls}>
              <option value="all">Any status</option>
              <option value="available">Looking for a home</option>
              <option value="in_foster">In foster</option>
              <option value="adopted">Adopted</option>
            </select>
            <select value={rescuerFilter} onChange={(e) => setRescuerFilter(e.target.value)} className={selCls}>
              <option value="all">All rescuers</option>
              {rescuers.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          {msg && (
            <div className="font-sans font-semibold text-[13px] text-cocoa/70 mb-3">{msg}</div>
          )}

          <div className="bg-white rounded-[16px] shadow-card overflow-hidden max-w-[980px]">
            <div className="hidden md:grid grid-cols-[52px_1.3fr_.7fr_.9fr_.9fr_auto] gap-3 items-center px-5 py-3 border-b border-cocoa/[.07] font-sans font-bold text-[11px] tracking-[.08em] text-cocoa/45">
              <span /><span>ANIMAL</span><span>RESCUER</span><span>STATUS</span><span>VISIBILITY</span>
              <span className="text-right">ACTIONS</span>
            </div>
            {filtered.map((r, i) => (
              <div key={r.id}
                className={`flex flex-wrap md:grid md:grid-cols-[52px_1.3fr_.7fr_.9fr_.9fr_auto] gap-3 items-center px-4 md:px-5 py-[10px] ${
                  i < filtered.length - 1 ? "border-b border-cocoa/[.07]" : ""
                }`}>
                <div className="w-11 h-11 bg-cream rounded-[9px] overflow-hidden flex items-center justify-center text-[18px]">
                  {r.photos?.[0] ? (
                    <img src={r.photos[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span aria-hidden>{speciesEmoji[r.species] ?? "🐾"}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1 md:flex-none">
                  <div className="font-sans font-bold text-[14px] text-cocoa truncate">
                    {r.name}
                    {r.featured && (
                      <span className="ml-2 font-bold text-[10px] tracking-[.06em] text-link">★ FEATURED</span>
                    )}
                  </div>
                  <div className="font-mono text-[11px] text-cocoa/50">{r.ref} · {r.emirate}</div>
                </div>
                <span className="hidden md:inline font-sans font-semibold text-[12.5px] text-cocoa/70 truncate">
                  {r.rescuer?.name ?? "—"}
                </span>
                <span className="hidden md:inline font-sans font-semibold text-[12.5px] text-cocoa/70">
                  {r.status === "in_foster" ? "in foster" : r.status}
                </span>
                <span className={`font-sans font-bold text-[11.5px] ${
                    r.approval_status === "approved" ? "text-cocoa/60" : "text-link"
                  }`}>
                  {r.approval_status === "approved" ? "public" : r.approval_status.replace("_", " ")}
                </span>
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                  <button onClick={() => toggleFeatured(r)}
                    className={`font-sans font-bold text-[12px] px-3 py-[6px] rounded-[8px] cursor-pointer transition-colors ${
                      r.featured
                        ? "bg-sunset/[.16] border-[1.5px] border-sunset text-link"
                        : "bg-transparent border-[1.5px] border-cocoa/20 text-cocoa/70 hover:border-cocoa/50"
                    }`}
                    title="Feature on the homepage (max 3)">
                    ★
                  </button>
                  <Link href={`/dashboard/new?edit=${r.id}`}
                    className="font-sans font-bold text-[12px] text-cocoa border-[1.5px] border-cocoa/20 px-3 py-[6px] rounded-[8px] no-underline hover:bg-cocoa/[.05]">
                    Edit
                  </Link>
                  {r.approval_status === "approved" ? (
                    <button onClick={() => patch(r.id, { approval_status: "changes_requested" } as Partial<Row>, `${r.name} unpublished.`)}
                      className="font-sans font-bold text-[12px] text-[#C4525C] border-[1.5px] border-[rgba(196,82,92,.4)] px-3 py-[6px] rounded-[8px] cursor-pointer bg-transparent hover:bg-[rgba(196,82,92,.08)]">
                      Unpublish
                    </button>
                  ) : (
                    <button onClick={() => patch(r.id, { approval_status: "approved" } as Partial<Row>, `${r.name} is public.`)}
                      className="font-sans font-bold text-[12px] text-cocoa border-[1.5px] border-cocoa/20 px-3 py-[6px] rounded-[8px] cursor-pointer bg-transparent hover:bg-cocoa/[.05]">
                      Publish
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-5 py-8 font-sans font-medium text-[14px] text-cocoa/55">
                Nothing matches those filters.
              </div>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
