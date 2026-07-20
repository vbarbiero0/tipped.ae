"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { signOutRescuer, useRescuer } from "@/components/dashboard/useRescuer";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  EmptyStateHead,
  PencilIcon,
  PlusIcon,
  SwapIcon,
  TrashIcon,
} from "@/components/dashboard/icons";

// My animals — live against Supabase. The 3-way dashboard status maps onto
// the public model: available = (status available, in_foster false),
// in foster = (status available, in_foster true), adopted = status adopted.

interface Row {
  id: string;
  ref: string;
  name: string;
  species: string;
  sex: string | null;
  age: string | null;
  emirate: string | null;
  status: string;
  in_foster: boolean;
  photos: string[];
}

type DashStatus = "available" | "in foster" | "adopted";

const dashStatus = (r: Row): DashStatus =>
  r.status === "adopted" ? "adopted" : r.in_foster ? "in foster" : "available";

const nextPatch = (s: DashStatus) =>
  s === "available"
    ? { status: "available", in_foster: true }
    : s === "in foster"
      ? { status: "adopted", in_foster: false }
      : { status: "available", in_foster: false };

const speciesEmoji: Record<string, string> = { cat: "🐈", dog: "🐕", other: "🦜" };

function StatusChip({ status }: { status: DashStatus }) {
  if (status === "available")
    return (
      <span className="bg-sunset/[.16] text-link font-sans font-bold text-[12px] px-3 py-[5px] rounded-[8px]">
        available
      </span>
    );
  if (status === "in foster")
    return (
      <span className="bg-cream border border-cocoa/[.15] text-cocoa/75 font-sans font-bold text-[12px] px-3 py-1 rounded-[8px]">
        in foster
      </span>
    );
  return (
    <span className="flex flex-col gap-[2px] items-start">
      <span className="bg-cocoa text-cream font-sans font-bold text-[12px] px-3 py-[5px] rounded-[8px]">
        adopted
      </span>
      <span className="font-sans font-semibold text-[10.5px] text-cocoa/45">
        shown on the public Adopted page
      </span>
    </span>
  );
}

const iconBtn =
  "w-[38px] h-[38px] rounded-[10px] border-[1.5px] border-cocoa/[.15] flex items-center justify-center cursor-pointer bg-transparent transition-colors";

export default function DashboardPage() {
  const router = useRouter();
  const { rescuer, loading } = useRescuer();
  const [rows, setRows] = useState<Row[]>([]);
  const [rowsLoading, setRowsLoading] = useState(true);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!rescuer) return;
    supabaseBrowser()
      .from("animals")
      .select("id,ref,name,species,sex,age,emirate,status,in_foster,photos")
      .eq("rescuer_id", rescuer.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setRows((data as Row[]) ?? []);
        setRowsLoading(false);
      });
  }, [rescuer]);

  const cycleStatus = async (row: Row) => {
    const patch = nextPatch(dashStatus(row));
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...patch } : r)));
    const { error } = await supabaseBrowser()
      .from("animals")
      .update(patch)
      .eq("id", row.id);
    if (error) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? row : r)));
      setSaveError("Couldn't save the status change. Try again.");
    } else setSaveError(null);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const target = deleting;
    setDeleting(null);
    setRows((prev) => prev.filter((r) => r.id !== target.id));
    const { error } = await supabaseBrowser().from("animals").delete().eq("id", target.id);
    if (error) {
      setRows((prev) => [...prev, target]);
      setSaveError(`Couldn't delete ${target.name}. Try again.`);
    } else setSaveError(null);
  };

  const pronoun = (r: Row) => (r.sex === "Male" ? ["him", "he"] : ["her", "she"]);

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar
        showRescuerCard
        rescuer={rescuer}
        onSignOut={() => signOutRescuer(router)}
      />

      <main className="flex-1 px-[34px] py-[30px] relative min-w-0">
        {loading || rowsLoading ? (
          <div className="font-sans font-semibold text-[14px] text-cocoa/50">Loading…</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-[22px] gap-4 flex-wrap">
              <div>
                <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0">
                  My animals
                </h1>
                <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mt-[3px]">
                  {rows.length} listed · marking one adopted moves it to the
                  public Adopted page
                </div>
              </div>
              <Link
                href="/dashboard/new"
                className="inline-flex items-center gap-[9px] bg-cocoa text-cream no-underline font-sans font-bold text-[15px] px-6 py-[14px] rounded-[12px] hover:bg-[#241A14]"
              >
                <PlusIcon />
                Add an animal
              </Link>
            </div>

            {saveError && (
              <div className="font-sans font-semibold text-[13px] text-badge-text mb-3">
                {saveError}
              </div>
            )}

            {rows.length === 0 ? (
              <div className="bg-paper border border-cocoa/[.08] rounded-[12px] px-10 py-[60px] flex flex-col items-center text-center">
                <EmptyStateHead />
                <div className="font-display font-extrabold text-[24px] text-cocoa mt-[18px] mb-2">
                  No animals listed yet
                </div>
                <div className="font-sans font-medium text-[15px] leading-[1.6] text-cocoa/65 max-w-[420px] mb-6">
                  List your first rescue — a name, a photo and their story is all
                  it takes. It goes live the moment you hit save.
                </div>
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center gap-[9px] bg-cocoa text-cream no-underline font-sans font-bold text-[15px] px-[26px] py-[14px] rounded-[12px] hover:bg-[#241A14]"
                >
                  <PlusIcon />
                  Add your first animal
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-[16px] shadow-card overflow-hidden">
                <div className="grid grid-cols-[64px_1.2fr_.6fr_.8fr_auto] gap-4 items-center px-5 py-3 border-b border-cocoa/[.07] font-sans font-bold text-[11.5px] tracking-[.08em] text-cocoa/45">
                  <span />
                  <span>ANIMAL</span>
                  <span>SPECIES</span>
                  <span>STATUS</span>
                  <span className="w-[150px] text-right">ACTIONS</span>
                </div>

                {rows.map((a, i) => {
                  const s = dashStatus(a);
                  const meta = [a.sex?.toLowerCase(), a.age, a.emirate]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <div
                      key={a.id}
                      className={`grid grid-cols-[64px_1.2fr_.6fr_.8fr_auto] gap-4 items-center px-5 py-3 ${
                        i < rows.length - 1 ? "border-b border-cocoa/[.07]" : ""
                      } ${s === "adopted" ? "bg-cocoa/[.025]" : ""}`}
                    >
                      <div className="w-14 h-14 bg-cream rounded-[10px] overflow-hidden flex items-center justify-center text-[22px]">
                        {a.photos?.[0] ? (
                          <img src={a.photos[0]} alt={a.name} className="w-full h-full object-cover" />
                        ) : (
                          <span aria-hidden>{speciesEmoji[a.species] ?? "🐾"}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-display font-extrabold text-[16.5px] text-cocoa">
                          {a.name}
                        </div>
                        <div className="font-sans font-semibold text-[12px] text-cocoa/50">
                          {meta}
                        </div>
                      </div>
                      <span className="font-sans font-semibold text-[13.5px] text-cocoa/75">
                        {a.species}
                      </span>
                      <span>
                        <StatusChip status={s} />
                      </span>
                      <div className="flex gap-[6px] w-[150px] justify-end">
                        <Link
                          href={`/dashboard/new?edit=${a.id}`}
                          aria-label={`Edit ${a.name}`}
                          title="Edit"
                          className={`${iconBtn} hover:bg-cocoa/[.05]`}
                        >
                          <PencilIcon />
                        </Link>
                        <button
                          onClick={() => cycleStatus(a)}
                          aria-label={`Change status of ${a.name}`}
                          title="Change status"
                          className={`${iconBtn} hover:bg-cocoa/[.05]`}
                        >
                          <SwapIcon />
                        </button>
                        <button
                          onClick={() => setDeleting(a)}
                          aria-label={`Delete ${a.name}`}
                          title="Delete"
                          className={`${iconBtn} hover:bg-[rgba(196,82,92,.08)] hover:border-[rgba(196,82,92,.4)]`}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {deleting && (
          <div
            className="fixed inset-0 z-50 bg-cocoa/20 flex items-center justify-center px-6"
            onClick={() => setDeleting(null)}
          >
            <div
              className="w-[360px] max-w-full bg-white border border-cocoa/10 rounded-[16px] shadow-[0_24px_60px_rgba(58,42,34,.25)] px-[22px] py-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display font-extrabold text-[17px] text-cocoa mb-[6px]">
                Delete {deleting.name}&rsquo;s listing?
              </div>
              <div className="font-sans font-medium text-[13.5px] leading-[1.55] text-cocoa/70 mb-4">
                This removes {pronoun(deleting)[0]} from tipped for good. If{" "}
                {pronoun(deleting)[1]} was adopted, mark {pronoun(deleting)[0]}{" "}
                adopted instead — {pronoun(deleting)[1]}&rsquo;ll join the public
                Adopted page.
              </div>
              <div className="flex gap-[10px] justify-end">
                <button
                  onClick={() => setDeleting(null)}
                  className="font-sans font-bold text-[13.5px] text-cocoa border-[1.5px] border-cocoa/25 px-[18px] py-[10px] rounded-[10px] cursor-pointer bg-transparent hover:bg-cocoa/[.05]"
                >
                  Keep {pronoun(deleting)[0]}
                </button>
                <button
                  onClick={confirmDelete}
                  className="font-sans font-bold text-[13.5px] text-white bg-[#C4525C] px-[18px] py-[10px] rounded-[10px] cursor-pointer border-0 hover:bg-[#AD434D]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
