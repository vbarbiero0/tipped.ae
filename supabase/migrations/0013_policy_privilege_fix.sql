-- 0013: fix anon pets reads broken by 0011's rescuers grant lockdown.
--
-- Postgres evaluates the USING expression of EVERY applicable permissive
-- policy. `animals_own_all` on pets subqueries rescuers.auth_user_id — a
-- column anon deliberately cannot SELECT since 0011 — so ALL anon pets
-- queries died with "permission denied for table rescuers" and the site fell
-- back to seed data (masked because seed matches live content). Pre-0011 the
-- table-level grant made the old column revoke a no-op, which is why this
-- never bit before.
--
-- Fix: the subquery moves into a SECURITY DEFINER helper (runs as owner,
-- bypasses caller grants) — same pattern as is_admin(). Policy expressions
-- referencing OTHER tables must never touch columns the weakest caller can't
-- read; same-table references are exempt from column checks, which is why
-- rescuers' own policies were fine.

create or replace function my_rescuer_id()
returns uuid language sql security definer stable as $$
  select id from rescuers where auth_user_id = auth.uid()
$$;

drop policy animals_own_all on pets;
create policy animals_own_all on pets
  for all
  using (rescuer_id = my_rescuer_id())
  with check (rescuer_id = my_rescuer_id());

drop policy stats_owner_read on pet_stats;
create policy stats_owner_read on pet_stats
  for select
  using (is_admin() or pet_id in (select id from pets where rescuer_id = my_rescuer_id()));
