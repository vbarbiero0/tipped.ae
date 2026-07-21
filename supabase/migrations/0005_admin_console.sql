-- Step 2 — admin console (/admin). Featured toggles, admin write access to
-- the ledgers and signups, admin read of vet certificates, invite logging.

-- Featured: up to 3 animals drive the homepage cards (enforced in app);
-- one featured bill drives the homepage receipt module.
alter table animals add column featured boolean not null default false;
alter table bills_paid add column featured boolean not null default false;

-- Admin manages the ledgers from the browser (was service-role only)
create policy bills_admin_all on bills_paid for all
  using (is_admin()) with check (is_admin());
create policy ledger_admin_all on shop_ledger for all
  using (is_admin()) with check (is_admin());

-- Admin reads signups (CSV export); inserts stay server-side
create policy signups_admin_read on shop_signups for select using (is_admin());

-- Admin reviews vet certificates in the approval queue (private bucket)
create policy vet_certs_admin_read on storage.objects for select using (
  bucket_id = 'vet-certificates' and is_admin()
);

-- Log rescuer creation (invite flow inserts via service role; actor null then)
create or replace function log_rescuer_created()
returns trigger language plpgsql security definer as $$
begin
  insert into audit_log (actor_id, action, target_type, target_id, note)
  values (auth.uid(), 'rescuer_created', 'rescuer', new.id::text, new.name);
  return new;
end $$;

create trigger rescuers_log_created
  after insert on rescuers
  for each row execute function log_rescuer_created();
