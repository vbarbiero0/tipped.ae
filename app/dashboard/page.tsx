"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  EmptyStateHead,
  PencilIcon,
  PlusIcon,
  SwapIcon,
  TrashIcon,
} from "@/components/dashboard/icons";

// Front-end demo of `Tipped Rescuer Dashboard.dc.html` screen 1 (+1b empty
// state). Local state only — persistence arrives with Supabase auth.
// NOTE for the future schema: the dashboard vocabulary is species
// cat|dog|other and status available|in foster|adopted (plus the public
// Adopted page) — see docs/sessions/5.

type DashStatus = "available" | "in foster" | "adopted";

interface DashAnimal {
  id: string;
  name: string;
  meta: string;
  species: "cat" | "dog" | "other";
  status: DashStatus;
  photo?: string;
  emoji: string;
}

const demoAnimals: DashAnimal[] = [
  {
    id: "mango",
    name: "Mango",
    meta: "female · ~3 yrs · Dubai",
    species: "cat",
    status: "available",
    photo: "/animals/hero-tortie.jpg",
    emoji: "🐈",
  },
  {
    id: "thabet",
    name: "Thabet",
    meta: "male · ~5 yrs · Sharjah",
    species: "dog",
    status: "in foster",
    emoji: "🐕",
  },
  {
    id: "najma",
    name: "Najma",
    meta: "female · ~1 yr · Ajman",
    species: "other",
    status: "available",
    emoji: "🦜",
  },
  {
    id: "loza",
    name: "Loza",
    meta: "female · ~2 yrs · Dubai",
    species: "cat",
    status: "adopted",
    emoji: "🐈",
  },
];

const statusCycle: DashStatus[] = ["available", "in foster", "adopted"];

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
  const [animals, setAnimals] = useState(demoAnimals);
  const [deleting, setDeleting] = useState<DashAnimal | null>(null);

  const cycleStatus = (id: string) =>
    setAnimals((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: statusCycle[(statusCycle.indexOf(a.status) + 1) % 3] }
          : a
      )
    );

  const confirmDelete = () => {
    if (deleting) setAnimals((prev) => prev.filter((a) => a.id !== deleting.id));
    setDeleting(null);
  };

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar showRescuerCard />

      <main className="flex-1 px-[34px] py-[30px] relative min-w-0">
        <div className="flex items-center justify-between mb-[22px] gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0">
              My animals
            </h1>
            <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mt-[3px]">
              {animals.length} listed · marking one adopted moves it to the public
              Adopted page
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

        {animals.length === 0 ? (
          /* 1b — first-visit empty state */
          <div className="bg-paper border border-cocoa/[.08] rounded-[12px] px-10 py-[60px] flex flex-col items-center text-center">
            <EmptyStateHead />
            <div className="font-display font-extrabold text-[24px] text-cocoa mt-[18px] mb-2">
              No animals listed yet
            </div>
            <div className="font-sans font-medium text-[15px] leading-[1.6] text-cocoa/65 max-w-[420px] mb-6">
              List your first rescue — a name, a photo and their story is all it
              takes. It goes live the moment you hit save.
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

            {animals.map((a, i) => (
              <div
                key={a.id}
                className={`grid grid-cols-[64px_1.2fr_.6fr_.8fr_auto] gap-4 items-center px-5 py-3 ${
                  i < animals.length - 1 ? "border-b border-cocoa/[.07]" : ""
                } ${a.status === "adopted" ? "bg-cocoa/[.025]" : ""}`}
              >
                <div className="w-14 h-14 bg-cream rounded-[10px] overflow-hidden flex items-center justify-center text-[22px]">
                  {a.photo ? (
                    <img
                      src={a.photo}
                      alt={a.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span aria-hidden>{a.emoji}</span>
                  )}
                </div>
                <div>
                  <div className="font-display font-extrabold text-[16.5px] text-cocoa">
                    {a.name}
                  </div>
                  <div className="font-sans font-semibold text-[12px] text-cocoa/50">
                    {a.meta}
                  </div>
                </div>
                <span className="font-sans font-semibold text-[13.5px] text-cocoa/75">
                  {a.species}
                </span>
                <span>
                  <StatusChip status={a.status} />
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
                    onClick={() => cycleStatus(a.id)}
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
            ))}
          </div>
        )}

        {/* Delete confirmation */}
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
                This removes {deleting.name === "Thabet" ? "him" : "her"} from
                tipped for good. If {deleting.name === "Thabet" ? "he" : "she"}{" "}
                was adopted, mark {deleting.name === "Thabet" ? "him" : "her"}{" "}
                adopted instead — {deleting.name === "Thabet" ? "he" : "she"}
                &rsquo;ll join the public Adopted page.
              </div>
              <div className="flex gap-[10px] justify-end">
                <button
                  onClick={() => setDeleting(null)}
                  className="font-sans font-bold text-[13.5px] text-cocoa border-[1.5px] border-cocoa/25 px-[18px] py-[10px] rounded-[10px] cursor-pointer bg-transparent hover:bg-cocoa/[.05]"
                >
                  Keep {deleting.name === "Thabet" ? "him" : "her"}
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
