-- 0007: the platform vocabulary is "pets" — rename animals → pets.
--
-- Vanessa's revised step brief: "rename cats to pets (not animals); the stats
-- table becomes pet_stats (pet_id, views, email_clicks); everywhere the
-- migration says 'animals', read 'pets'."
--
-- Renames carry triggers, policies, indexes and FKs along by OID, but plpgsql
-- bodies reference tables by NAME at execution time — so every function whose
-- body says "animals"/"animal_stats" is recreated here under its pet name and
-- the old one dropped. Policy names still say "animals_*"; cosmetic only,
-- left alone. Historical audit rows keep target_type='animal' — an audit log
-- remembers history verbatim; new rows write 'pet'.

alter table animals rename to pets;
alter table animal_stats rename to pet_stats;
alter table pet_stats rename column animal_id to pet_id;

-- Ref generator ("DUBAI-001") — body queried animals by name
create or replace function assign_pet_ref()
returns trigger language plpgsql as $$
declare
  prefix text;
  next_n int;
begin
  if new.ref is null or new.ref = '' then
    prefix := upper(replace(coalesce(new.emirate, 'UAE'), ' ', '-'));
    select coalesce(max(substring(ref from '\d+$')::int), 0) + 1
      into next_n
      from pets
      where ref like prefix || '-%';
    new.ref := prefix || '-' || lpad(next_n::text, 3, '0');
  end if;
  return new;
end $$;
drop trigger animals_assign_ref on pets;
create trigger pets_assign_ref
  before insert on pets
  for each row execute function assign_pet_ref();
drop function assign_animal_ref();

-- Stats RPC — body wrote to animal_stats by name; client calls the new name
create or replace function bump_pet_stat(p_pet_id uuid, p_kind text)
returns void language plpgsql security definer as $$
begin
  if p_kind not in ('view','email') then
    raise exception 'unknown stat kind %', p_kind;
  end if;
  insert into pet_stats (pet_id, views, email_clicks)
  values (p_pet_id,
          case when p_kind = 'view' then 1 else 0 end,
          case when p_kind = 'email' then 1 else 0 end)
  on conflict (pet_id) do update set
    views = pet_stats.views + case when p_kind = 'view' then 1 else 0 end,
    email_clicks = pet_stats.email_clicks + case when p_kind = 'email' then 1 else 0 end;
end $$;
grant execute on function bump_pet_stat(uuid, text) to anon, authenticated;
drop function bump_animal_stat(uuid, text);

-- Audit writers — new rows record target_type 'pet'
create or replace function log_pet_approval_change()
returns trigger language plpgsql security definer as $$
begin
  if new.approval_status is distinct from old.approval_status then
    insert into audit_log (actor_id, action, target_type, target_id, note)
    values (auth.uid(), 'approval_' || new.approval_status, 'pet', new.id::text, new.approval_note);
  end if;
  return new;
end $$;
drop trigger animals_log_approval on pets;
create trigger pets_log_approval
  after update on pets
  for each row execute function log_pet_approval_change();
drop function log_animal_approval_change();

create or replace function log_pet_delete()
returns trigger language plpgsql security definer as $$
begin
  insert into audit_log (actor_id, action, target_type, target_id, note)
  values (auth.uid(), 'delete', 'pet', old.id::text, old.name || ' (' || old.ref || ')');
  return old;
end $$;
drop trigger animals_log_delete on pets;
create trigger pets_log_delete
  after delete on pets
  for each row execute function log_pet_delete();
drop function log_animal_delete();

-- The bills ledger's loose text pointer joins the vocabulary too
alter table bills_paid rename column animal_ref to pet_ref;
alter table rescuers rename column cats_saved to pets_saved;
