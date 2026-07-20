-- tipped — initial schema (CLAUDE.md data model; cats & dogs since 2026-07-18)
-- Run against a fresh Supabase project. Public site reads work with the anon
-- key; ledger writes are service-role only.

create table rescuers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users, -- null until claimed
  username text unique,          -- dashboard sign-in handle (design: 'straycatdubai')
  avatar_url text,               -- Supabase Storage
  name text not null,
  emirate text check (emirate in ('Abu Dhabi','Dubai','Sharjah','Ajman','Umm Al Quwain','Ras Al Khaimah','Fujairah')),
  blurb text,
  email text not null,          -- adoption inquiries go here
  instagram text,
  cats_saved int default 0,     -- total animals rehomed (name kept for continuity)
  clinics jsonb default '[]',   -- [{name, url, ref}] — supporter pays the clinic directly
  wishlists jsonb default '[]', -- [{name, url}] — goods to the rescuer, never money
  is_placeholder boolean default true, -- true until the real rescuer consents
  created_at timestamptz default now()
);

create table animals (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null default '',
  rescuer_id uuid references rescuers not null,
  species text not null default 'cat' check (species in ('cat','dog','other')),
  name text not null,
  sex text check (sex in ('Male','Female')),
  age text,                     -- freeform: '~2 yrs'
  emirate text check (emirate in ('Abu Dhabi','Dubai','Sharjah','Ajman','Umm Al Quwain','Ras Al Khaimah','Fujairah')),
  story text,
  medical text,
  -- Health tags: precise claims, controlled vocabulary (see lib/health.ts).
  -- "vaccinated" = UAE-required shots up to date (annual rabies + core combo).
  sterilised boolean not null default false,
  vaccinated boolean not null default false,
  microchipped boolean not null default false,
  tested text[] not null default '{}',      -- 'fiv_felv' | 'heartworm'
  conditions text[] not null default '{}',  -- 'fiv','felv','heartworm','heartworm_treatment','special_needs','chronic'
  -- Dashboard medical checklist (session 5) — controlled slugs:
  -- dewormed, flea_treated, fiv_tested, felv_tested, blood_panel_done,
  -- dental_done, ear_tipped, passport_ready, fit_to_fly
  medical_checks text[] not null default '{}',
  microchip_number text,        -- required by the dashboard form at listing time
  vet_certificate_url text,     -- private bucket; required at listing time
  adopted_at timestamptz,       -- set by trigger; drives the public Adopted page
  status text not null default 'available'
    check (status in ('available','pending','adopted')),
  -- Dashboard status selector maps: 'available'→(status available, in_foster f),
  -- 'in foster'→(status available, in_foster t), 'adopted'→(status adopted).
  -- What the rescuer is open to — any combination; foster-to-adopt is normal.
  for_adoption boolean not null default true,
  for_foster boolean not null default false,
  -- Orthogonal to status: a fostered animal is usually still looking for a
  -- forever home. "Where is she sleeping tonight", not the outcome.
  in_foster boolean not null default false,
  photos text[] default '{}',   -- Supabase Storage URLs
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Full-emirate-name refs, sequential per emirate: DUBAI-001, SHARJAH-001,
-- UMM-AL-QUWAIN-001. Prefix = upper(emirate) with spaces as hyphens.
create or replace function assign_animal_ref()
returns trigger language plpgsql as $$
declare
  prefix text;
  next_n int;
begin
  if new.ref is null or new.ref = '' then
    prefix := upper(replace(coalesce(new.emirate, 'UAE'), ' ', '-'));
    select coalesce(max(substring(ref from '\d+$')::int), 0) + 1
      into next_n
      from animals
      where ref like prefix || '-%';
    new.ref := prefix || '-' || lpad(next_n::text, 3, '0');
  end if;
  return new;
end $$;

create trigger animals_assign_ref
  before insert on animals
  for each row execute function assign_animal_ref();

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger animals_touch_updated_at
  before update on animals
  for each row execute function touch_updated_at();

-- Track when an animal is marked adopted (public Adopted page ordering)
create or replace function touch_adopted_at()
returns trigger language plpgsql as $$
begin
  if new.status = 'adopted' and old.status is distinct from 'adopted' then
    new.adopted_at := now();
  elsif new.status <> 'adopted' then
    new.adopted_at := null;
  end if;
  return new;
end $$;

create trigger animals_touch_adopted_at
  before update on animals
  for each row execute function touch_adopted_at();

-- Dashboard sign-in is by username; Supabase auth wants an email.
-- SECURITY DEFINER lookup (rescuer emails are public on the site anyway).
create or replace function get_rescuer_email(p_username text)
returns text language sql security definer stable as $$
  select email from rescuers where username = lower(p_username);
$$;

-- MONEY OUT: what the shop's profits (and direct supporters) paid for
create table bills_paid (
  id uuid primary key default gen_random_uuid(),
  paid_on date not null,
  context text,                 -- 'Batata — dental extraction'
  animal_ref text,              -- optional link to a listed animal
  clinic text,                  -- clinic/vendor name (nullable for supplies)
  amount_aed numeric not null,
  amount_covered_aed numeric,   -- for partly-covered bills (drives progress bar)
  receipt_url text,             -- Supabase Storage — the public receipt/photo
  source text check (source in ('shop','supporter')),
  note text
);

-- MONEY IN: what sold (hand-entered now; can auto-populate from a store later)
create table shop_ledger (
  id uuid primary key default gen_random_uuid(),
  sold_on date not null,
  item text not null,
  qty int default 1,
  amount_aed numeric not null,  -- total for the row (qty × price)
  benefit text,                 -- '→ food runs for rescuers'
  note text
);

create table shop_signups (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- RLS ---------------------------------------------------------------------

alter table rescuers enable row level security;
alter table animals enable row level security;
alter table bills_paid enable row level security;
alter table shop_ledger enable row level security;
alter table shop_signups enable row level security;

-- Public read (rescuers: auth_user_id is hidden — the site never selects it;
-- column-level privacy enforced by revoking it)
create policy rescuers_read on rescuers for select using (true);
revoke select (auth_user_id) on rescuers from anon, authenticated;

create policy animals_read on animals for select using (true);
create policy bills_paid_read on bills_paid for select using (true);
create policy shop_ledger_read on shop_ledger for select using (true);

-- Rescuers update only their own rows (once accounts are claimed)
create policy rescuers_update_own on rescuers
  for update using (auth_user_id = auth.uid());

create policy animals_write_own on animals
  for all using (
    rescuer_id in (select id from rescuers where auth_user_id = auth.uid())
  );

-- Ledgers: no public writes — service role only (bypasses RLS).
-- Shop signups: no public read; inserts happen server-side via service role.

-- Storage ------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('animal-photos', 'animal-photos', true),
  ('receipts', 'receipts', true),
  ('vet-certificates', 'vet-certificates', false)  -- PRIVATE — medical documents
on conflict (id) do nothing;

create policy animal_photos_read on storage.objects
  for select using (bucket_id in ('animal-photos','receipts'));

create policy animal_photos_insert_own on storage.objects
  for insert with check (
    bucket_id = 'animal-photos' and auth.role() = 'authenticated'
  );

-- Vet certificates: rescuer reads/writes only their own folder ({auth_uid}/...)
create policy vet_certs_own on storage.objects
  for all using (
    bucket_id = 'vet-certificates'
    and (storage.foldername(name))[1] = auth.uid()::text
  ) with check (
    bucket_id = 'vet-certificates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
