import { createClient } from "@supabase/supabase-js";
import type { Animal, BillPaid, Rescuer, ShopLedgerRow } from "./types";
import { seedAnimals, seedBillsPaid, seedRescuers, seedShopLedger } from "./seed";

// Data adapter: reads from Supabase when configured, otherwise serves the
// built-in seed so the site runs (and deploys) before the backend exists.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasSupabase = Boolean(url && anonKey);

function client() {
  return createClient(url!, anonKey!);
}

function withRescuers(animals: Animal[], rescuers: Rescuer[]): Animal[] {
  const byId = new Map(rescuers.map((r) => [r.id, r]));
  return animals.map((a) => ({ ...a, rescuer: byId.get(a.rescuer_id) }));
}

export async function getRescuers(): Promise<Rescuer[]> {
  if (!hasSupabase) return seedRescuers;
  const { data, error } = await client()
    .from("rescuers")
    .select("id,name,emirate,blurb,email,instagram,cats_saved,clinics,is_placeholder")
    .order("cats_saved", { ascending: false });
  if (error || !data) return seedRescuers;
  return data as Rescuer[];
}

export async function getAnimals(): Promise<Animal[]> {
  if (!hasSupabase) return withRescuers(seedAnimals, seedRescuers);
  const { data, error } = await client()
    .from("animals")
    .select("*, rescuer:rescuers(id,name,emirate,blurb,email,instagram,cats_saved,clinics,is_placeholder)")
    .order("created_at", { ascending: false });
  if (error || !data) return withRescuers(seedAnimals, seedRescuers);
  return data as unknown as Animal[];
}

export async function getAnimal(ref: string): Promise<Animal | null> {
  const animals = await getAnimals();
  return animals.find((a) => a.ref.toLowerCase() === ref.toLowerCase()) ?? null;
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

export function getOpenBillFor(bills: BillPaid[], animalRef: string): BillPaid | null {
  return (
    bills.find(
      (b) =>
        b.animal_ref === animalRef &&
        b.amount_covered_aed !== null &&
        b.amount_covered_aed < b.amount_aed
    ) ?? null
  );
}
