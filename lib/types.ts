import type { Emirate } from "./emirates";
import type { ConditionSlug, TestedSlug } from "./health";

export type AnimalStatus = "available" | "pending" | "adopted";
export type Species = "cat" | "dog";

export interface Rescuer {
  id: string;
  name: string;
  emirate: Emirate | null;
  blurb: string | null;
  email: string;
  instagram: string | null; // handle without @
  cats_saved: number; // total animals rehomed — column name kept for schema continuity
  clinics: { name: string; url?: string; ref?: string }[];
  is_placeholder: boolean;
  // Dashboard-era fields (optional until wired):
  username?: string | null;
  avatar_url?: string | null;
  wishlists?: { name: string; url?: string }[];
}

export interface Animal {
  id: string;
  ref: string; // 'DXB-001'
  rescuer_id: string;
  species: Species;
  name: string;
  sex: "Male" | "Female" | null;
  age: string | null;
  emirate: Emirate | null;
  story: string | null;
  medical: string | null;
  // Health basics — precise claims, not vibes. "Vaccinated" = up to date on
  // the UAE's required shots (see VACCINATED_DEFINITION in lib/health.ts).
  sterilised: boolean;
  vaccinated: boolean;
  microchipped: boolean;
  tested: TestedSlug[];
  conditions: ConditionSlug[];
  status: AnimalStatus;
  // Dashboard-era fields (optional until wired):
  medical_checks?: string[];
  microchip_number?: string | null;
  vet_certificate_url?: string | null;
  adopted_at?: string | null;
  // What the rescuer is open to — any combination. Foster-to-adopt is normal.
  for_adoption: boolean;
  for_foster: boolean;
  // Orthogonal to status: a fostered animal is usually still looking for a
  // forever home. This is "where is she sleeping tonight", not the outcome.
  in_foster: boolean;
  photos: string[];
  rescuer?: Rescuer;
}

export interface BillPaid {
  id: string;
  paid_on: string; // ISO date
  context: string | null;
  animal_ref: string | null;
  clinic: string | null;
  amount_aed: number;
  amount_covered_aed: number | null;
  receipt_url: string | null;
  source: "shop" | "supporter";
  note: string | null;
}

export interface ShopLedgerRow {
  id: string;
  sold_on: string; // ISO date
  item: string;
  qty: number;
  amount_aed: number;
  benefit: string | null;
  note: string | null;
}

export interface Product {
  slug: string;
  name: string;
  price_aed: number;
  benefit: string; // '→ food runs for rescuers'
  description: string;
}
