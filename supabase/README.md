# tipped — Supabase runbook

One project, created via CLI. Region: eu-central-1 (closest to the UAE with
full feature support; switch to me-central-1 if available on the plan).

## Create + provision (needs SUPABASE_ACCESS_TOKEN in env)

```bash
npx supabase login                     # or export SUPABASE_ACCESS_TOKEN=...
npx supabase orgs list                 # grab the org id
npx supabase projects create tipped --org-id <ORG> --region eu-central-1 \
  --db-password "$(openssl rand -base64 24)"   # SAVE the password → .env.local
npx supabase link --project-ref <REF>          # prompts for db password
npx supabase db push                           # applies supabase/migrations/*
psql "$(npx supabase db url)" -f supabase/seed.sql   # or run seed.sql in the SQL editor
npx supabase projects api-keys --project-ref <REF>   # anon + service_role
```

## Env wiring

- Local: `.env.local` (git-ignored) — NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DB password.
- Netlify (Project configuration → Environment variables):
  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (client-safe), and
  SUPABASE_SERVICE_ROLE_KEY (server-only — powers the shop-signup action).
  Redeploy after adding.

The site needs no code change: `lib/data.ts` switches from built-in seed to
Supabase the moment the env vars exist.

## Notes

- `seed.sql` is idempotent (upserts by fixed uuid) — re-run freely.
- Rescuer auth users are created by hand (all rescuers are vetted): Supabase
  dashboard → Authentication → Add user (email + password), then set
  `rescuers.auth_user_id` to that user's id and fill `rescuers.username`.
  The dashboard login resolves username → email via `get_rescuer_email()`.
- Vet certificates go to the PRIVATE `vet-certificates` bucket; animal photos
  and receipts are public buckets.
