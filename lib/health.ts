// The health-tag vocabulary. Controlled slugs, not freeform — rescuers tick
// boxes in the future dashboard, so "Neutered"/"snipped"/"fixed" can't drift.
// No alarm styling anywhere: an FIV+ cat is adoptable and the tag must not
// read as a warning label. Detail lives in the medical text and the
// condition notes below.

import type { Pet } from "./types";

// "Tested" is a claim of its own — "we didn't test" and "negative" are
// different statements.
export type TestedSlug = "fiv_felv" | "heartworm";

export const TESTED_LABELS: Record<TestedSlug, string> = {
  fiv_felv: "tested FIV/FeLV −",
  heartworm: "tested heartworm −",
};

export type ConditionSlug =
  | "fiv"
  | "felv"
  | "heartworm"
  | "heartworm_treatment"
  | "special_needs"
  | "chronic";

export const CONDITION_LABELS: Record<ConditionSlug, string> = {
  fiv: "FIV +",
  felv: "FeLV +",
  heartworm: "heartworm +",
  heartworm_treatment: "heartworm — in treatment",
  special_needs: "special needs",
  chronic: "chronic condition",
};

// "Vaccinated" means: up to date on what the UAE actually requires for pet
// registration — rabies every year plus the core combo (flu/enteritis a.k.a.
// FVRCP for cats, DHPPi/L for dogs). Same set the municipality checks.
export const VACCINATED_DEFINITION =
  "Up to date on the UAE's required shots: rabies every year, plus the core combo — flu/enteritis (FVRCP) for cats, DHPPi/L for dogs. The same set the municipality checks at registration.";

// Auto-explainers: when a pet carries one of these conditions, its
// profile grows a plain-language section — what it means, how to care.
// special_needs and chronic deliberately have no generic note; the rescuer's
// medical text carries the specifics.
export const CONDITION_NOTES: Partial<
  Record<ConditionSlug, { title: string; body: (name: string) => string }>
> = {
  fiv: {
    title: "About FIV",
    body: (name) =>
      `Feline immunodeficiency virus. It cannot pass to humans or dogs, and between cats it spreads only through deep bites — not shared bowls or grooming. With an indoor life, regular vet checks, and small illnesses seen to early, ${name} can live a full, happy, normal-length life. Many FIV-positive cats share homes with negative cats and never pass it on.`,
  },
  felv: {
    title: "About FeLV",
    body: (name) =>
      `Feline leukaemia virus — more serious than FIV, and it does spread through close cat-to-cat contact. ${name} would do best as an only cat, or with other FeLV-positive cats, living indoors. They may need more vet visits than average, and their years may be fewer — but with loving care, every one of them can be full and happy.`,
  },
  heartworm: {
    title: "About heartworm",
    body: (name) =>
      `A mosquito-borne parasite, common in the Gulf. It is treatable — treatment takes a few months and plenty of quiet rest. After that, a monthly preventative keeps ${name} protected, and they can enjoy a completely normal dog life.`,
  },
  heartworm_treatment: {
    title: "About heartworm",
    body: (name) =>
      `A mosquito-borne parasite, common in the Gulf. ${name} is already in treatment — a few months of medication and quiet rest, then a monthly preventative and a completely normal dog life. Treatment bills like this one are the kind our Open books page helps cover.`,
  },
};

export function conditionNotesFor(pet: Pet) {
  return pet.conditions
    .map((slug) => CONDITION_NOTES[slug])
    .filter((n): n is NonNullable<typeof n> => Boolean(n));
}
