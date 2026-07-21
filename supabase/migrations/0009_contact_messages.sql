-- 0009: contact messages — the /contact mailto gains a message box that
-- stores the note and pings Telegram. Same closed-surface pattern as
-- rescuer_applications: service-key inserts only, admin read/update.

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  handled_at timestamptz
);

alter table contact_messages enable row level security;

create policy contact_messages_admin_read on contact_messages
  for select using (is_admin());
create policy contact_messages_admin_update on contact_messages
  for update using (is_admin());
