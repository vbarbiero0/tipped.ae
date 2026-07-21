"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AdminShell, { useAdmin } from "@/components/admin/AdminShell";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { UploadIcon } from "@/components/dashboard/icons";

// The weekly books, from a phone if need be: Money in (shop_ledger) and
// Money out (bills_paid) with one-screen add forms. Feeds /transparency.
// One bill can be featured — it becomes the homepage receipt module.

interface InRow {
  id: string;
  sold_on: string;
  item: string;
  qty: number;
  amount_aed: number;
}

interface OutRow {
  id: string;
  paid_on: string;
  context: string | null;
  clinic: string | null;
  amount_aed: number;
  amount_covered_aed: number | null;
  receipt_url: string | null;
  source: string;
  featured: boolean;
}

const inputCls =
  "w-full box-border font-sans font-semibold text-[14.5px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[10px] px-3 py-[11px] outline-none focus:border-cocoa";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminLedgerPage() {
  const { admin, loading } = useAdmin();
  const [tab, setTab] = useState<"in" | "out">("in");
  const [inRows, setInRows] = useState<InRow[]>([]);
  const [outRows, setOutRows] = useState<OutRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [inForm, setInForm] = useState({ sold_on: todayISO(), item: "", qty: "1", amount: "" });
  const [outForm, setOutForm] = useState({
    paid_on: todayISO(),
    context: "",
    clinic: "",
    amount: "",
    covered: "",
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const receiptRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    const supabase = supabaseBrowser();
    const [{ data: a }, { data: b }] = await Promise.all([
      supabase.from("shop_ledger").select("id,sold_on,item,qty,amount_aed").order("sold_on", { ascending: false }),
      supabase.from("bills_paid").select("id,paid_on,context,clinic,amount_aed,amount_covered_aed,receipt_url,source,featured").order("paid_on", { ascending: false }),
    ]);
    setInRows((a as InRow[]) ?? []);
    setOutRows((b as OutRow[]) ?? []);
  }, []);

  useEffect(() => {
    if (admin) load();
  }, [admin, load]);

  const addIn = async () => {
    if (!inForm.item.trim() || !inForm.amount) return setMsg("Item and amount, please.");
    setBusy(true);
    const { error } = await supabaseBrowser().from("shop_ledger").insert({
      sold_on: inForm.sold_on,
      item: inForm.item.trim(),
      qty: parseInt(inForm.qty) || 1,
      amount_aed: parseFloat(inForm.amount),
      benefit: "→ vet bills",
    });
    setBusy(false);
    if (error) return setMsg("Couldn't save. Try again.");
    setMsg("Sale added.");
    setInForm({ sold_on: todayISO(), item: "", qty: "1", amount: "" });
    load();
  };

  const addOut = async () => {
    if (!outForm.context.trim() || !outForm.amount) return setMsg("Description and amount, please.");
    setBusy(true);
    const supabase = supabaseBrowser();
    let receipt_url: string | null = null;
    if (receipt) {
      const path = `bills/${crypto.randomUUID()}-${receipt.name}`;
      const { error: upErr } = await supabase.storage
        .from("receipts")
        .upload(path, receipt, { contentType: receipt.type });
      if (upErr) {
        setBusy(false);
        return setMsg("Receipt upload failed. Try again.");
      }
      receipt_url = supabase.storage.from("receipts").getPublicUrl(path).data.publicUrl;
    }
    const { error } = await supabase.from("bills_paid").insert({
      paid_on: outForm.paid_on,
      context: outForm.context.trim(),
      clinic: outForm.clinic.trim() || null,
      amount_aed: parseFloat(outForm.amount),
      amount_covered_aed: outForm.covered ? parseFloat(outForm.covered) : null,
      receipt_url,
      source: "shop",
    });
    setBusy(false);
    if (error) return setMsg("Couldn't save. Try again.");
    setMsg("Bill added — it's on the public page now.");
    setOutForm({ paid_on: todayISO(), context: "", clinic: "", amount: "", covered: "" });
    setReceipt(null);
    load();
  };

  // One featured bill drives the homepage receipt module
  const featureBill = async (id: string) => {
    const supabase = supabaseBrowser();
    await supabase.from("bills_paid").update({ featured: false }).eq("featured", true);
    const { error } = await supabase.from("bills_paid").update({ featured: true }).eq("id", id);
    if (!error) {
      setOutRows((prev) => prev.map((r) => ({ ...r, featured: r.id === id })));
      setMsg("That bill now fronts the homepage.");
    }
  };

  const tabBtn = (t: "in" | "out", label: string) => (
    <button
      onClick={() => setTab(t)}
      className={`font-sans font-bold text-[13.5px] px-4 py-2 rounded-[9px] cursor-pointer transition-colors ${
        tab === t
          ? "bg-cocoa text-cream border-[1.5px] border-cocoa"
          : "bg-transparent text-cocoa/70 border-[1.5px] border-cocoa/20 hover:border-cocoa/50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <AdminShell admin={admin}>
      {loading ? (
        <div className="font-sans font-semibold text-[14px] text-cocoa/50">Loading…</div>
      ) : (
        <>
          <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0">Ledger</h1>
          <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mt-[3px] mb-4">
            What lands here shows on the public Open books page. Weekly, remember.
          </div>

          <div className="flex gap-2 mb-5">
            {tabBtn("in", `Money in · ${inRows.length}`)}
            {tabBtn("out", `Money out · ${outRows.length}`)}
          </div>

          {msg && (
            <div className="font-sans font-semibold text-[13px] text-cocoa/70 mb-3">{msg}</div>
          )}

          <div className="grid lg:grid-cols-[380px_1fr] gap-6 max-w-[980px] items-start">
            {/* Add form — one screen, phone-friendly */}
            <div className="bg-white rounded-[16px] shadow-card p-5">
              <div className="font-display font-extrabold text-[17px] text-cocoa mb-3">
                {tab === "in" ? "Add a sale" : "Add a bill / purchase"}
              </div>
              {tab === "in" ? (
                <div className="flex flex-col gap-2">
                  <input type="date" value={inForm.sold_on}
                    onChange={(e) => setInForm({ ...inForm, sold_on: e.target.value })} className={inputCls} />
                  <input placeholder="What sold (e.g. The ear-tipped tote)" value={inForm.item}
                    onChange={(e) => setInForm({ ...inForm, item: e.target.value })} className={inputCls} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" min="1" placeholder="Qty" value={inForm.qty}
                      onChange={(e) => setInForm({ ...inForm, qty: e.target.value })} className={inputCls} />
                    <input type="number" step="0.01" placeholder="Total AED" value={inForm.amount}
                      onChange={(e) => setInForm({ ...inForm, amount: e.target.value })} className={inputCls} />
                  </div>
                  <button onClick={addIn} disabled={busy}
                    className="bg-cocoa text-cream font-sans font-bold text-[14px] py-3 rounded-[10px] cursor-pointer border-0 hover:bg-[#241A14] disabled:opacity-60 mt-1">
                    {busy ? "Saving…" : "Save sale"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <input type="date" value={outForm.paid_on}
                    onChange={(e) => setOutForm({ ...outForm, paid_on: e.target.value })} className={inputCls} />
                  <input placeholder="What it paid for (e.g. Batata — dental)" value={outForm.context}
                    onChange={(e) => setOutForm({ ...outForm, context: e.target.value })} className={inputCls} />
                  <input placeholder="Clinic / vendor (optional)" value={outForm.clinic}
                    onChange={(e) => setOutForm({ ...outForm, clinic: e.target.value })} className={inputCls} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" step="0.01" placeholder="Amount AED" value={outForm.amount}
                      onChange={(e) => setOutForm({ ...outForm, amount: e.target.value })} className={inputCls} />
                    <input type="number" step="0.01" placeholder="Covered so far (opt.)" value={outForm.covered}
                      onChange={(e) => setOutForm({ ...outForm, covered: e.target.value })} className={inputCls} />
                  </div>
                  <button type="button" onClick={() => receiptRef.current?.click()}
                    className="w-full border-[1.5px] border-dashed border-cocoa/30 rounded-[10px] bg-white py-3 flex items-center justify-center gap-2 font-sans font-bold text-[13px] text-cocoa/65 cursor-pointer hover:border-cocoa hover:text-cocoa">
                    <UploadIcon />
                    {receipt?.name ?? "Receipt photo (public!)"}
                  </button>
                  <input ref={receiptRef} type="file" accept="image/*,application/pdf" className="hidden"
                    onChange={(e) => setReceipt(e.target.files?.[0] ?? null)} />
                  <button onClick={addOut} disabled={busy}
                    className="bg-cocoa text-cream font-sans font-bold text-[14px] py-3 rounded-[10px] cursor-pointer border-0 hover:bg-[#241A14] disabled:opacity-60 mt-1">
                    {busy ? "Saving…" : "Save bill"}
                  </button>
                </div>
              )}
            </div>

            {/* Rows */}
            <div className="bg-white rounded-[16px] shadow-card overflow-hidden">
              {tab === "in"
                ? inRows.map((r, i) => (
                    <div key={r.id}
                      className={`flex items-baseline justify-between gap-3 px-5 py-3 ${
                        i < inRows.length - 1 ? "border-b border-cocoa/[.07]" : ""
                      }`}>
                      <div>
                        <div className="font-sans font-bold text-[14px] text-cocoa">
                          {r.item}{r.qty > 1 ? ` × ${r.qty}` : ""}
                        </div>
                        <div className="font-mono text-[11px] text-cocoa/50">{r.sold_on}</div>
                      </div>
                      <span className="font-mono font-semibold text-[14px] text-cocoa">AED {r.amount_aed}</span>
                    </div>
                  ))
                : outRows.map((r, i) => (
                    <div key={r.id}
                      className={`flex items-center justify-between gap-3 px-5 py-3 ${
                        i < outRows.length - 1 ? "border-b border-cocoa/[.07]" : ""
                      }`}>
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-[14px] text-cocoa truncate">
                          {r.context}
                          {r.featured && (
                            <span className="ml-2 font-bold text-[10px] tracking-[.06em] text-link">★ HOMEPAGE</span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-cocoa/50">
                          {r.paid_on}{r.clinic ? ` · ${r.clinic}` : ""}
                          {r.amount_covered_aed !== null ? ` · ${r.amount_covered_aed}/${r.amount_aed} covered` : ""}
                          {r.receipt_url ? " · receipt ✓" : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-[14px] text-cocoa whitespace-nowrap">
                          AED {r.amount_aed}
                        </span>
                        {!r.featured && (
                          <button onClick={() => featureBill(r.id)}
                            title="Show this bill on the homepage"
                            className="font-sans font-bold text-[12px] text-cocoa/60 border-[1.5px] border-cocoa/20 px-2 py-1 rounded-[7px] cursor-pointer bg-transparent hover:border-cocoa/50">
                            ★
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              {(tab === "in" ? inRows : outRows).length === 0 && (
                <div className="px-5 py-8 font-sans font-medium text-[14px] text-cocoa/55">
                  Nothing here yet.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
