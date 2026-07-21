import EarTippedBadge from "./EarTippedBadge";
import { EAR_PINK } from "@/lib/brand";
import {
  CONDITION_LABELS,
  TESTED_LABELS,
  VACCINATED_DEFINITION,
  conditionNotesFor,
} from "@/lib/health";
import type { Pet } from "@/lib/types";

// Tag styles: basics are quiet Cream pills, conditions are warm Sunset-tinted
// pills. Deliberately no red, no alarm styling — an FIV+ cat is adoptable and
// the tag must not read as a warning label.

function BasicTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-cream text-cocoa/75 font-sans font-bold text-[11px] px-[10px] py-1 rounded-[7px] whitespace-nowrap">
      {label}
    </span>
  );
}

export function ConditionTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-sunset/[.18] text-link font-sans font-bold text-[11px] px-[10px] py-1 rounded-[7px] whitespace-nowrap">
      {label}
    </span>
  );
}

function PawBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-[5px] bg-tip-pink/[.16] text-badge-text font-sans font-bold text-[11px] px-[10px] py-1 rounded-[7px] whitespace-nowrap">
      <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
        <circle cx="7" cy="7" r="3" fill={EAR_PINK} />
        <circle cx="17" cy="7" r="3" fill={EAR_PINK} />
        <path
          d="M12,11 C16,11 19,14 19,17 C19,20 16,21 12,21 C8,21 5,20 5,17 C5,14 8,11 12,11 Z"
          fill={EAR_PINK}
        />
      </svg>
      {label}
    </span>
  );
}

// The card slot: one identity badge (the ear-tip when true, else a paw
// "sterilised") + condition tags only — those are the decision-relevant ones
// before a click. The full row lives on the profile.
export function CardBadges({ pet }: { pet: Pet }) {
  const sterilised = pet.medical_checks.includes("spayed_neutered");
  return (
    <>
      {pet.ear_tipped ? (
        <EarTippedBadge />
      ) : sterilised ? (
        <PawBadge label="sterilised" />
      ) : null}
      {pet.conditions.map((slug) => (
        <ConditionTag key={slug} label={CONDITION_LABELS[slug]} />
      ))}
    </>
  );
}

// The profile slot: every claim, spelled out.
const CHECK_LABELS: Record<string, string> = {
  spayed_neutered: "sterilised",
  vaccinated: "vaccinated",
  dewormed: "dewormed",
  flea_treated: "flea-treated",
  fiv_tested: "FIV tested",
  felv_tested: "FeLV tested",
  blood_panel: "blood panel done",
  dental_done: "dental done",
  passport_ready: "passport ready",
  fit_to_fly: "fit to fly",
};

export function HealthTagRow({ pet }: { pet: Pet }) {
  return (
    <div className="flex items-center flex-wrap gap-[6px]">
      {pet.ear_tipped && <EarTippedBadge />}
      {pet.medical_checks.map((c) =>
        c === "vaccinated" ? (
          <span key={c} title={VACCINATED_DEFINITION}>
            <BasicTag label={CHECK_LABELS[c] ?? c} />
          </span>
        ) : (
          <BasicTag key={c} label={CHECK_LABELS[c] ?? c} />
        )
      )}
      {pet.microchipped && <BasicTag label="microchipped" />}
      {pet.tested.map((slug) => (
        <BasicTag key={slug} label={TESTED_LABELS[slug]} />
      ))}
      {pet.conditions.map((slug) => (
        <ConditionTag key={slug} label={CONDITION_LABELS[slug]} />
      ))}
    </div>
  );
}

// Auto-added explainers (Vanessa's rule: an FIV+ cat's profile must say what
// that means and how to care). Renders nothing when no known condition.
export function ConditionNotes({ pet }: { pet: Pet }) {
  const notes = conditionNotesFor(pet);
  if (notes.length === 0) return null;
  return (
    <div className="flex flex-col gap-3 mt-5">
      {notes.map((n) => (
        <div key={n.title} className="bg-cream rounded-[18px] px-5 py-4 max-w-[520px]">
          <div className="font-display font-extrabold text-[16px] text-cocoa mb-1">
            {n.title}
          </div>
          <p className="font-sans font-medium text-[13.5px] leading-[1.65] text-cocoa/78 m-0">
            {n.body(pet.name)}
          </p>
        </div>
      ))}
    </div>
  );
}
