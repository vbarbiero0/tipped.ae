import { createClient } from "@supabase/supabase-js";
import type { Pet, BillPaid, Rescuer, ShopLedgerRow } from "./types";
import { seedPets, seedBillsPaid, seedRescuers, seedShopLedger } from "./seed";

// Data adapter: reads from Supabase when configured, otherwise serves the
// built-in seed so the site runs (and deploys) before the backend exists.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasSupabase = Boolean(url && anonKey);

function client() {
  return createClient(url!, anonKey!);
}

function withRescuers(pets: Pet[], rescuers: Rescuer[]): Pet[] {
  const byId = new Map(rescuers.map((r) => [r.id, r]));
  return pets.map((a) => ({ ...a, rescuer: byId.get(a.rescuer_id) }));
}

export async function getRescuers(): Promise<Rescuer[]> {
  if (!hasSupabase) return seedRescuers;
  const { data, error } = await client()
    .from("rescuers")
    .select("id,name,username,emirate,blurb,email,socials,pets_saved,clinics,wishlist_links,is_placeholder")
    .order("pets_saved", { ascending: false });
  if (error || !data) return seedRescuers;
  return data as Rescuer[];
}

export async function getPets(): Promise<Pet[]> {
  if (!hasSupabase) return withRescuers(seedPets, seedRescuers);
  const { data, error } = await client()
    .from("pets")
    .select("*, rescuer:rescuers(id,name,emirate,blurb,email,socials,pets_saved,clinics,is_placeholder)")
    .order("created_at", { ascending: false });
  if (error || !data) return withRescuers(seedPets, seedRescuers);
  return data as unknown as Pet[];
}

export async function getPet(ref: string): Promise<Pet | null> {
  const pets = await getPets();
  return pets.find((a) => a.ref.toLowerCase() === ref.toLowerCase()) ?? null;
}

export async function getBillsPaid(): Promise<BillPaid[]> {
  if (!hasSupabase) return seedBillsPaid;
  const { data, error } = await client()
    .from("bills_paid")
    .select("*")
    .order("paid_on", { ascending: false });
  if (error || !data) return seedBillsPaid;
  return data as BillPaid[];
}

export async function getShopLedger(): Promise<ShopLedgerRow[]> {
  if (!hasSupabase) return seedShopLedger;
  const { data, error } = await client()
    .from("shop_ledger")
    .select("*")
    .order("sold_on", { ascending: false });
  if (error || !data) return seedShopLedger;
  return data as ShopLedgerRow[];
}

export function getOpenBillFor(bills: BillPaid[], petRef: string): BillPaid | null {
  return (
    bills.find(
      (b) =>
        b.pet_ref === petRef &&
        b.amount_covered_aed !== null &&
        b.amount_covered_aed < b.amount_aed
    ) ?? null
  );
}
