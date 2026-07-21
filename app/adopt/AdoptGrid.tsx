"use client";

import { useState } from "react";
import AnimalCard from "@/components/AnimalCard";
import { EMIRATES } from "@/lib/emirates";
import type { Animal, AnimalStatus, Species } from "@/lib/types";

const speciesFilters: { value: Species | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "cat", label: "Cats" },
  { value: "dog", label: "Dogs" },
];

const statusFilters: { value: AnimalStatus | "all"; label: string }[] = [
  { value: "all", label: "Any status" },
  { value: "available", label: "Looking for a home" },
  { value: "in_foster", label: "In foster" },
  { value: "adopted", label: "Adopted" },
];

export type Intent = "all" | "adopt" | "foster";

const intentFilters: { value: Intent; label: string }[] = [
  { value: "adopt", label: "Adopt" },
  { value: "foster", label: "Foster" },
];

export default function AdoptGrid({
  animals,
  initialIntent = "all",
}: {
  animals: Animal[];
  initialIntent?: Intent;
}) {
  const [species, setSpecies] = useState<Species | "all">("all");
  const [status, setStatus] = useState<AnimalStatus | "all">("all");
  const [intent, setIntent] = useState<Intent>(initialIntent);
  const [emirate, setEmirate] = useState<string>("all");

  const filtered = animals.filter(
    (a) =>
      (species === "all" || a.species === species) &&
      (status === "all" || a.status === status) &&
      (intent === "all" ||
        (intent === "adopt" ? a.for_adoption : a.for_foster)) &&
      (emirate === "all" || a.emirate === emirate)
  );

  const pill = (active: boolean) =>
    `font-sans font-bold text-[13px] px-4 py-2 rounded-[9px] cursor-pointer transition-colors ${
      active
        ? "bg-cocoa text-cream border-[1.5px] border-cocoa"
        : "bg-transparent text-cocoa border-[1.5px] border-cocoa/30 hover:border-cocoa"
    }`;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {speciesFilters.map((f) => (
          <button key={f.value} onClick={() => setSpecies(f.value)} className={pill(species === f.value)}>
            {f.label}
          </button>
        ))}
        <span className="w-[1px] h-6 bg-cocoa/15 mx-2 hidden sm:block" />
        {intentFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setIntent(intent === f.value ? "all" : f.value)}
            className={pill(intent === f.value)}
          >
            {f.label}
          </button>
        ))}
        <span className="w-[1px] h-6 bg-cocoa/15 mx-2 hidden sm:block" />
        {statusFilters.map((f) => (
          <button key={f.value} onClick={() => setStatus(f.value)} className={pill(status === f.value)}>
            {f.label}
          </button>
        ))}
        <select
          value={emirate}
          onChange={(e) => setEmirate(e.target.value)}
          className="ml-auto font-sans font-semibold text-[13px] text-cocoa bg-white border-[1.5px] border-cocoa/30 rounded-[9px] px-4 py-2"
          aria-label="Filter by emirate"
        >
          <option value="all">All emirates</option>
          {EMIRATES.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      {filtered.length === 0 ? (
        <p className="font-sans font-medium text-[15px] text-cocoa/60">
          Nobody matches that filter right now. The streets will provide — check
          back soon.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </>
  );
}
