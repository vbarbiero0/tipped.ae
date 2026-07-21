-- Step 1 — generalize + trust & approval (task brief 2026-07-21).
-- The cats→animals rename, species 'other', and the seven emirates shipped in
-- 0001; this migration converts the remaining deltas on the live schema.
--
-- Judgment calls (logged in docs/sessions/6):
--  * status folds in_foster INTO the enum (available|in_foster|adopted);
--    'pending' is dropped. for_adoption/for_foster (what the rescuer is open
--    to) are separate intents and stay.
--  * tested[]/conditions[] stay — they power the public health tags and the
--    FIV/FeLV/heartworm auto-explainers (Vanessa's standing rule).
--  * sterilised/vaccinated booleans fold into medical_checks as
--    spayed_neutered/vaccinated; ear_tipped becomes its own boolean column
--    (drives the brand badge). blood_panel_done renamed → blood_panel.
--  * freeform medical renamed → medical_other.
--  * NOT NULL backfills: seed animals get 'PENDING-<ref>' chips and a
--    'pending/awaiting-upload' certificate marker.
--  * Vanessa's linked rescuer row (Silvana) becomes role=admin,
--    trust_level=trusted. Trusted rescuers' new animals auto-approve.

-- ---------------------------------------------------------------- animals
alter table animals rename column medical to medical_other;

-- status: fold in_foster into the enum
alter table animals drop constraint animals_status_check;
update animals set status = 'in_foster' where in_foster and status <> 'adopted';
update animals set status = 'available' where status = 'pending';
alter table animals add constraint animals_status_check
  check (status in ('available','in_foster','adopted'));
alter table animals drop column in_foster;

-- medical model
update animals set medical_checks = array_replace(medical_checks, 'blood_panel_done', 'blood_panel');
update animals set medical_checks = medical_checks || '{spayed_neutered}' where sterilised and not ('spayed_neutered' = any(medical_checks));
update animals set medical_checks = medical_checks || '{vaccinated}' where vaccinated and not ('vaccinated' = any(medical_checks));
alter table animals add column ear_tipped boolean default true;
update animals set ear_tipped = ('ear_tipped' = any(medical_checks)) or (species = 'cat' and sterilised);
update animals set medical_checks = array_remove(medical_checks, 'ear_tipped');
alter table animals drop column sterilised;
alter table animals drop column vaccinated;
alter table animals add constraint animals_medical_checks_check check (
  medical_checks <@ array['spayed_neutered','vaccinated','dewormed','flea_treated',
    'fiv_tested','felv_tested','blood_panel','dental_done','ear_tipped',
    'passport_ready','fit_to_fly']::text[]
);

-- required listing credentials
update animals set microchip_number = 'PENDING-' || ref where microchip_number is null or microchip_number = '';
update animals set vet_certificate_url = 'pending/awaiting-upload' where vet_certificate_url is null or vet_certificate_url = '';
alter table animals alter column microchip_number set not null;
alter table animals alter column vet_certificate_url set not null;

-- approval workflow (independent of adoption status)
alter table animals add column approval_status text not null default 'pending'
  check (approval_status in ('pending','approved','changes_requested','rejected'));
alter table animals add column approval_note text;
update animals set approval_status = 'approved';  -- existing seed listings

-- ---------------------------------------------------------------- rescuers
alter table rescuers add column trust_level text not null default 'review'
  check (trust_level in ('trusted','review'));
alter table rescuers add column active boolean default true;
alter table rescuers add column role text not null default 'rescuer'
  check (role in ('rescuer','admin'));
alter table rescuers rename column wishlists to wishlist_links;
update rescuers set wishlist_links = coalesce(
  (select jsonb_agg(jsonb_build_object('label', coalesce(e->>'label', e->>'name'), 'url', e->>'url'))
   from jsonb_array_elements(wishlist_links) e), '[]'::jsonb);

-- Vanessa's test/admin identity
update rescuers set role = 'admin', trust_level = 'trusted'
  where id = '00000000-0000-4000-8000-000000000001';

-- trusted rescuers publish instantly
create or replace function auto_approve_trusted()
returns trigger language plpgsql security definer as $$
begin
  if (select trust_level from rescuers where id = new.rescuer_id) = 'trusted' then
    new.approval_status := 'approved';
  end if;
  return new;
end $$;

create trigger animals_auto_approve_trusted
  before insert on animals
  for each row execute function auto_approve_trusted();

-- ---------------------------------------------------------------- audit log
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  target_type text not null,
  target_id text,
  note text,
  created_at timestamptz default now()
);

create or replace function log_animal_approval_change()
returns trigger language plpgsql security definer as $$
begin
  if new.approval_status is distinct from old.approval_status then
    insert into audit_log (actor_id, action, target_type, target_id, note)
    values (auth.uid(), 'approval_' || new.approval_status, 'animal', new.id::text, new.approval_note);
  end if;
  return new;
end $$;

create trigger animals_log_approval
  after update on animals
  for each row execute function log_animal_approval_change();

create or replace function log_animal_delete()
returns trigger language plpgsql security definer as $$
begin
  insert into audit_log (actor_id, action, target_type, target_id, note)
  values (auth.uid(), 'delete', 'animal', old.id::text, old.name || ' (' || old.ref || ')');
  return old;
end $$;

create trigger animals_log_delete
  after delete on animals
  for each row execute function log_animal_delete();

create or replace function log_rescuer_admin_change()
returns trigger language plpgsql security definer as $$
begin
  if new.trust_level is distinct from old.trust_level then
    insert into audit_log (actor_id, action, target_type, target_id, note)
    values (auth.uid(), 'trust_' || new.trust_level, 'rescuer', new.id::text, null);
  end if;
  if new.active is distinct from old.active then
    insert into audit_log (actor_id, action, target_type, target_id, note)
    values (auth.uid(), case when new.active then 'activate' else 'deactivate' end, 'rescuer', new.id::text, null);
  end if;
  return new;
end $$;

create trigger rescuers_log_admin_change
  after update on rescuers
  for each row execute function log_rescuer_admin_change();

-- ---------------------------------------------------------------- stats
create table animal_stats (
  animal_id uuid primary key references animals on delete cascade,
  views int not null default 0,
  email_clicks int not null default 0
);

create or replace function bump_animal_stat(p_animal_id uuid, p_kind text)
returns void language plpgsql security definer as $$
begin
  if p_kind not in ('view','email') then
    raise exception 'unknown stat kind %', p_kind;
  end if;
  insert into animal_stats (animal_id, views, email_clicks)
  values (p_animal_id,
          case when p_kind = 'view' then 1 else 0 end,
          case when p_kind = 'email' then 1 else 0 end)
  on conflict (animal_id) do update set
    views = animal_stats.views + case when p_kind = 'view' then 1 else 0 end,
    email_clicks = animal_stats.email_clicks + case when p_kind = 'email' then 1 else 0 end;
end $$;

grant execute on function bump_animal_stat(uuid, text) to anon, authenticated;

-- ---------------------------------------------------------------- RLS
create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from rescuers where auth_user_id = auth.uid() and role = 'admin');
$$;

-- animals: public sees only approved listings of active rescuers;
-- rescuers CRUD their own; admins everything
drop policy animals_read on animals;
drop policy animals_write_own on animals;

create policy animals_public_read on animals for select using (
  approval_status = 'approved'
  and exists (select 1 from rescuers r where r.id = rescuer_id and r.active)
);
create policy animals_own_all on animals for all using (
  rescuer_id in (select id from rescuers where auth_user_id = auth.uid())
) with check (
  rescuer_id in (select id from rescuers where auth_user_id = auth.uid())
);
create policy animals_admin_all on animals for all
  using (is_admin()) with check (is_admin());

-- rescuers: public sees active; self + admin see all; admin writes all
drop policy rescuers_read on rescuers;
create policy rescuers_read on rescuers for select using (
  active = true or auth_user_id = auth.uid() or is_admin()
);
create policy rescuers_admin_write on rescuers for update
  using (is_admin()) with check (is_admin());

-- audit log: admin eyes only (writes happen in definer triggers)
alter table audit_log enable row level security;
create policy audit_admin_read on audit_log for select using (is_admin());

-- stats: owner + admin read (writes only via the RPC)
alter table animal_stats enable row level security;
create policy stats_owner_read on animal_stats for select using (
  is_admin() or animal_id in (
    select a.id from animals a
    join rescuers r on r.id = a.rescuer_id
    where r.auth_user_id = auth.uid())
);
