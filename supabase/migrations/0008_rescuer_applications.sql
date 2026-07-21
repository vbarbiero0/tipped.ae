-- 0008: rescuer applications — the /rescuers#join box becomes a tracked
-- submission (Telegram ping + admin list) instead of a bare mailto.
--
-- Inserts happen only through the applyAsRescuer server action with the
-- service key — no anon INSERT policy on purpose (same pattern as
-- shop_signups: the public REST surface stays closed).

create table rescuer_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  emirate text,
  instagram text,
  note text,
  created_at timestamptz not null default now(),
  handled_at timestamptz
);

alter table rescuer_applications enable row level security;

create policy rescuer_applications_admin_read on rescuer_applications
  for select using (is_admin());
create policy rescuer_applications_admin_update on rescuer_applications
  for update using (is_admin());
