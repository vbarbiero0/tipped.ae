import type { Emirate } from "./emirates";
import type { ConditionSlug, TestedSlug } from "./health";

export type AnimalStatus = "available" | "in_foster" | "adopted";
export type Species = "cat" | "dog" | "other";

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
  username?: string | null;
  avatar_url?: string | null;
  wishlist_links?: { label: string; url?: string }[];
  trust_level?: "trusted" | "review";
  role?: "rescuer" | "admin";
  active?: boolean;
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
  medical_other: string | null;
  // Health: controlled checklist (see lib/health.ts) + precise tag sources.
  // "vaccinated" = up to date on the UAE's required shots.
  medical_checks: string[];
  ear_tipped: boolean;
  microchipped: boolean;
  microchip_number?: string | null;
  vet_certificate_url?: string | null;
  tested: TestedSlug[];
  conditions: ConditionSlug[];
  status: AnimalStatus;
  approval_status?: "pending" | "approved" | "changes_requested" | "rejected";
  approval_note?: string | null;
  adopted_at?: string | null;
  // What the rescuer is open to — any combination. Foster-to-adopt is normal.
  // Independent of status ("in_foster" says where she sleeps tonight).
  for_adoption: boolean;
  for_foster: boolean;
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
