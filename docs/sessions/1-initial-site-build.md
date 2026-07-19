# Session 1 — Initial site build (2026-07-18)

Built the tipped v1 site from the Claude Design handoff bundle (`handoff/`) and CLAUDE.md.

## What shipped

- **Stack:** Next.js 15 (App Router, TS), Tailwind 3 with all brand tokens in `tailwind.config.ts`, Netlify config (`netlify.toml`). Builds clean (`npx next build`), zero console errors on every route.
- **Brand components:** `TippedLogo` (wordmark with ears on the second p, spec geometry), `TippedMonogram` (cat-head, circle/square), `Ears`, `EarTippedBadge`, `StatusPill`, `ReceiptCard`, `CatCard`, `CatPhoto` (photo or sex-tinted gradient + monogram fallback), `EmailRescuerButton` (mailto per Hard rule 2), `Header`, `Footer`. Favicon = `app/icon.svg` (monogram on cocoa tile).
- **Routes:** `/` (matches `Tipped Homepage.dc.html`), `/cats` (grid + status/area filters), `/cats/[ref]` (profile + open-bill module + OG tags + `opengraph-image` fallback card), `/rescuers`, `/how-it-works` (steps + why-the-tipped-ear + vet-bill explainer), `/transparency` (two ledgers + totals + honesty line; `/bills-paid` redirects), `/shop` (catalog only, order via IG/email, signup form), `/dashboard` (placeholder), branded 404, sitemap, robots.
- **Data layer:** `lib/data.ts` adapter — reads Supabase when env vars exist, otherwise serves `lib/seed.ts` (Karak, Mango, Batata + placeholder rescuers + sample ledgers). Site runs and deploys with no backend.
- **Supabase:** `supabase/migrations/0001_initial_schema.sql` — full CLAUDE.md data model, RLS (public read, service-role-only ledger writes, `auth_user_id` column revoked from anon), DXB-ref trigger, storage buckets. Not yet applied — no Supabase project exists.
- **Photos:** handoff tortie → hero (`public/cats/hero-tortie.jpg`), dark tabby → Batata (`public/cats/batata.jpg`).

## Decisions made

- Nav is Adopt / Transparency / Shop / For rescuers (CLAUDE.md route table wins over the prototype's "Vet bills" link).
- "Pay the clinic directly" CTA opens a mailto to hello@tipped.cat asking for the clinic's payment details — no payment collection anywhere (Hard rule 1).
- Footer rescuer credits are behind `SHOW_RESCUER_CREDITS = false` in `Footer.tsx` until groups consent (Hard rule 5); placeholder rescuer cards carry an "EXAMPLE PROFILE" pill.
- Shop signup is a server action into `shop_signups` (service role); degrades to a "email us instead" line while Supabase is unconfigured.
- `/dashboard` is an honest placeholder — rescuer accounts need the Supabase project + auth (Phase 3 anyway).

## Next

- Create the Supabase project, apply migration 0001, set env vars (`.env.example`).
- Confirm the Instagram handle in `app/shop/page.tsx` (`TODO` marked) and the `tipped.cat` domain.
- Netlify site + deploy from git; verify OG previews in WhatsApp once live.
- First commit still pending approval.
