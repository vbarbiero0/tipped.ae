-- 0012: app_settings — small server-side key/value store. First use: the
-- Instagram access token (stored in the DB, not env, because it must
-- self-refresh — Netlify env vars can't update themselves).
--
-- No RLS policies on purpose: with RLS enabled and zero policies, anon and
-- authenticated can read/write nothing. Only the service role touches this.

create table app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table app_settings enable row level security;
