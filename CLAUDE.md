# CLAUDE.md — tipped

Source of truth for the **tipped** website build. If anything in the codebase conflicts with this file, this file wins. Update this file when decisions change.

## What this is

**tipped** is a platform for Dubai's street cats. Rescuers list cats with stories and photos. Adopters anywhere in the world browse and contact rescuers **directly by email**. Helping with a cat's vet bill means **paying the vet clinic directly** — money never passes through the platform or rescuers. A shop sells products; **100% of the shop's profit pays vet bills** (Vanessa, 2026-07-19 — supersedes the earlier food/medicine/supplies framing), evidenced on the public transparency page, **updated weekly**.

The name and mark reference the **ear-tip**: the clipped ear marking a rescued/TNR'd street cat.

Contact address: **hello@tipped.ae** — NOT live yet; **every contact point currently routes to vbarbiero0@gmail.com** (interim, 2026-07-20). The switch-back checklist is `docs/LAUNCH-SWITCHES.md` — read it before launch, keep it current. Domain: **tipped.ae** (Vanessa's decision, 2026-07-19 — supersedes the earlier `.cat` direction). Instagram: **@tipped.ae** (handle secured). **Domain purchase is deliberately deferred** until Vanessa calls the site ready — don't push DNS/domain steps; `https://tippedae.netlify.app` is the working URL (and the `NEXT_PUBLIC_SITE_URL` env value on Netlify) until then.

## Hard rules (never violate)

1. **No money through the platform.** No donation buttons, no payment collection for cats, no "donate" language anywhere. Support = pay the clinic directly. Vet-bill payments go to the clinic's own account; tipped never touches the money and the receipt is posted publicly. This works for listed cats **and** for cats still on the street. (UAE law prohibits unlicensed fundraising; the shop is separate licensed commerce.)
2. **Inquiries are direct email.** No contact forms, no stored inquiries, no messaging system. `mailto:` links to the rescuer with pre-filled subject `Adoption inquiry: {name} ({ref})` and a template body (country, home setup, other pets, experience). Homepage/listing buttons read "Email {RescuerFirstName}".
3. **The ears never recolor.** Plain ear = Sunset `#F0955B`. Tipped ear = Tip pink `#F58B93`. On every surface, light or dark, product or pixel.
4. **Voice: warm, sincere, simple** (reference: spca.com; changed 2026-07-22 — supersedes the earlier "honest, no sob stories" register). Speak plainly and kindly, in service of the reader and the animals. Invite, don't perform: "Every contribution, no matter how small, helps rescuers do more." / "By adopting or fostering, you give a rescued animal the home they've been waiting for." Gratitude is welcome ("Thank you for your generosity"). Avoid cleverness, irony, punchy fragments, and copywriter attitude — no "Bin-diver, reformed", no snappy taglines in body copy. Pet stories are honest and affectionate, written simply: where they were found, what they're like, what they need. (Still no sob-story manipulation and no "furbaby 🥺" register — warmth, not performance.)
5. **Real rescuers appear only with their consent.** Until confirmed, use placeholder profiles clearly marked as examples.
6. **Shop is not pinned to individual animals.** 100% of the shop's profit pays vet bills generally — never "buy this mug to fix Batata's leg." Every product carries the same benefit line: "→ 100% of profit to vet bills". The transparency page is the proof, updated weekly — the weekly cadence is a public promise; keep the copy honest to it.

## Brand tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| cream | `#FFF3E4` | warm backgrounds, type on dark |
| cocoa | `#3A2A22` | type, dark sections, buttons |
| sunset | `#F0955B` | plain ear, numbers, progress bars, CTAs on dark |
| tip-pink | `#F58B93` | tipped ear, badges, highlights |
| paper | `#FBF7F0` | page background (cards sit on it in white) |
| canvas-2 | `#FAF7F2` | alt off-white surface |

Supporting: link/accent text `#B5643A` (hover `#8F4C2B`); badge text `#C4525C` on 16%-opacity Tip pink; body text = Cocoa at 72–80% opacity; receipt card bg `#FFFDF8`. **Max two background colors per page:** Paper/Cream + Cocoa.

### Typography (Google Fonts)
- Display / headings / wordmark: **Nunito 800** (load variable 400–900)
- Text & UI: **Quicksand 500–600** (labels/buttons Quicksand 700)
- Numbers & receipts (AED amounts, bill numbers): **ui-monospace**
- Sample display line: "Help a rescued animal find their home."
- Type scale: H1 54/1.08 · H2 34 · card title 22 · body 14–17/1.6+ · meta 12–12.5 at 50–60% opacity. Eyebrow labels: Quicksand 700, 12.5px, .16em tracking, `#B5643A`.

### Shape language
**Rounded squares ONLY — no pills, no circles, no arches** (changed 2026-07-18; supersedes the handoff's pill/arch language). Buttons 10–12px radius (small CTAs 9px). Badges/tags 7px. Cards 18–20px. Photos 18–20px rounded rects — the hero photo has no arch; the brand ears still peek above its flat top edge. Progress bars 4px (bar + fill). Avatars & favicons: Cocoa rounded-square tiles ~27% radius — never circles. Thick round-joined SVG strokes stay (the ears keep their soft terminals).

## The logo (build as `<TippedLogo />` React component)

Wordmark `tipped`, all lowercase, Nunito 800, cocoa on cream (inverted: cream on cocoa; ears unchanged).

Two cat ears sit **centered on the second p** (4th character), bases touching the p's bowl:
- Left ear: plain triangle, Sunset, rotated −12°
- Right ear: tipped (top cut), Tip pink, rotated +12°

Ear SVGs (viewBox `0 0 36 52`; rounded corners via thick round-joined stroke to match Nunito's terminals):
```svg
<!-- plain -->
<path d="M8,44 L18,12 L28,44 Z" fill="#F0955B" stroke="#F0955B" stroke-width="9" stroke-linejoin="round"/>
<!-- tipped -->
<path d="M8,44 L12,24 L24,20 L28,44 Z" fill="#F58B93" stroke="#F58B93" stroke-width="9" stroke-linejoin="round"/>
```

Proportions relative to font-size F:
- Each ear rendered width ≈ `0.33 × F`, aspect 36:52
- Gap between ears ≈ `0.07 × F`
- Ear pair top ≈ `0.21 × F` above the ascender line — implement by wrapping the second p in a span, ears absolutely positioned `top: -0.21em; left: 50%; transform: translateX(-50%)` (each ear then rotated ±12°)
- Example at F=84px: ears 28×40px, gap 6px, top −17px

Monogram / avatar / favicon: a **cat head silhouette wearing the brand ears** — Cream head, Cocoa eyes; left ear filled Sunset with curved edges (matching the logo's rounded ears), right ear fully Tip pink with the flat tipped cut. Ears never recolor. Always on a Cocoa rounded-square tile, ~27% radius (avatar and favicon alike — no circles). Use wherever the full wordmark won't fit.

SVG (viewBox `0 0 120 110`, one cream head path with both ears; colored ear fills drawn on top):
```svg
<svg viewBox="0 0 120 110"><path d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 C57,30 63,30 68,32 L74,18 L86,14 L92,52 C96,60 96,70 92,78 C84,96 36,96 28,78 C24,70 24,60 28,52 Z" fill="#FFF3E4"/><path d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 Z" fill="#F0955B"/><path d="M68,32 L74,18 L86,14 L92,52 Z" fill="#F58B93"/><circle cx="46" cy="64" r="5" fill="#3A2A22"/><circle cx="74" cy="64" r="5" fill="#3A2A22"/></svg>
```
Scales: 96px tile / 60px-wide mark · 56px / 37px · 30px / 19px.

Tagline / hero line: **"The streets raised them. You take it from here."** Brand tagline for marks/products: "Every tipped ear is a cat someone saved."

## Stack

- **Next.js 14+ (App Router, TypeScript)** — same patterns as Kebs Technologies build
- **Supabase** — Postgres + Auth + Storage (cat photos, receipt images)
- **Tailwind** — tokens above wired into `tailwind.config` (colors + font families); no ad-hoc hex in components
- **Netlify** — hosting + deploys from git
- Dev happens in the **Claude Code desktop app**; never commit secrets; env in `.env.local` / Netlify env vars. `.claudeignore` blocks `.env*`.

## Routes (v1)

> **Naming note (2026-07-21):** this table is the original cat-era design spec.
> Live truth: listings are at `/pets` + `/pets/[ref]` (301s from `/cats*` and
> `/adopt*`), plus `/adopted` and `/rescuers/[username]` — see the "Pets
> rename" paragraph under Implementation status.

| Route | Purpose |
|---|---|
| `/` | **Designed — match `Tipped Homepage.dc.html`.** Sections in order: (1) sticky header — wordmark left; nav Adopt / Transparency / Shop / For rescuers; "Meet the cats" pill right. (2) Hero on Paper — eyebrow "DUBAI'S STREET CATS", H1 "The streets raised them. You take it from here.", subcopy, two buttons (primary "Browse the cats", secondary "How it works"). (3) "Ready to leave the street" — 3 featured cat cards (photo w/ big radius, ear-tipped badge, name, "sex · age · area", rescuer story voice, "with {Rescuer} · {@handle}", "Email {Rescuer}" button) + "All cats →". (4) "Adopting, plainly" — 3 numbered steps. (5) **Vet-bill module** on Cocoa dark section — receipt card (clinic + bill #, cat + treatment, AED covered / to-go, Sunset progress bar) + "Pay the clinic directly", caption "Goes to the clinic's own account. tipped never touches it." + line "Works for listed cats and for cats still on the street." (6) "The shop pays bills too" — 3 product rows each with a "→ benefit" line + "Visit the shop →". (7) Footer — wordmark, tagline, hello@tipped.ae, "BUILT WITH DUBAI'S RESCUE COMMUNITY" + rescuer list, "Dubai, UAE · every cat here is ear-tipped, fixed and vetted". Component prop toggles: `showShop` (default true), `showHeroEars` (default true). |
| `/cats` | Grid; filters: status (available / pending / homed), area |
| `/cats/[ref]` | Profile: photos, story, medical, status, rescuer, clinic payment box, email button. **OG tags required** (see below) |
| `/rescuers` | Directory: name, area, blurb, cats-saved count, IG, email, clinic links |
| `/how-it-works` | 3 steps (per homepage "Adopting, plainly"): (1) Find your cat — every listing written by the rescuer who feeds this cat, no shelter-speak; (2) Email the rescuer — straight to their inbox, no forms, no gatekeeping; (3) Adopt, near or far — Dubai cats fly well; adopter and rescuer arrange vetting, paperwork and travel together. Plus the "why the tipped ear?" explainer and the vet-bill-module explanation. |
| `/transparency` | **The two-ledger glass box.** Two side-by-side ledgers on one page: **Money in** (`shop_ledger` — what sold) and **Money out** (`bills_paid` — what it paid for). Top of page shows three totals and the honesty line: "AED {in} in · AED {out} out · AED {in−out} ready for the next bill." Each Money-in row: date · item · qty · amount · benefit tag. Each Money-out row: date · what was bought/treated · amount · **receipt image** · who it helped. Uses the receipt-card visual (off-white `#FFFDF8`, dashed dividers, slight `rotate(-1deg)`, ui-monospace numbers, Sunset progress where a bill is partly covered). Covers listed cats **and** street cats. Data is hand-entered at first (decoupled from checkout entirely — see Selling model); the page just displays the tables. Ship at launch even if sparse — its existence is the pitch. `/bills-paid` redirects here. |
| `/shop` | v1: **catalog only, no checkout.** The 3 designed products (tote AED 95, wet bag AED 120, collar tag AED 45), each with its "→ benefit" line, plus a short "how buying works" note and an "Order via Instagram / email" CTA (`mailto:hello@tipped.ae` + IG link). No cart, no payment collection in the site until eTrader + a hosted store are live (Phase 2). Email signup captures interest to `shop_signups`. |
| `/dashboard` | Rescuer-only: add/edit own cats, edit own profile. Mobile-first — rescuers work from phones |
| `/advice` | **Tips & Advice blog (2026-07-22).** MDX posts in `content/advice/` (frontmatter: title, category, summary, cover, date, author "tipped") — no database table. List page with a category filter (Cats · Dogs · Community care · Adopting & travel; only categories with posts render); `/advice/[slug]` article layout with cover, related-posts row, and a soft closing line inviting readers to meet the pets. Voice per Hard rule 4. Covers are branded SVGs in `public/advice/` (brand colors + ear motif, no stock photos); og:image is always the dynamic PNG from `app/advice/[slug]/opengraph-image.tsx` because chat apps don't render SVG og:images. |

## Data model (Supabase)

```sql
rescuers (
  id uuid pk default gen_random_uuid(),
  auth_user_id uuid unique references auth.users,  -- null until claimed
  name text not null,
  area text,
  blurb text,
  email text not null,          -- adoption inquiries go here
  instagram text,
  cats_saved int default 0,
  clinics jsonb default '[]',   -- [{name, url, ref}]
  is_placeholder boolean default true,  -- true until real rescuer consents
  created_at timestamptz default now()
)

cats (
  id uuid pk default gen_random_uuid(),
  ref text unique not null,     -- 'DXB-001' style, generated sequentially
  rescuer_id uuid references rescuers not null,
  name text not null,
  sex text check (sex in ('Male','Female')),
  age text,                     -- freeform: '~2 yrs'
  area text,
  story text,
  medical text,
  status text default 'available' check (status in ('available','pending','adopted')),
  photos text[] default '{}',   -- Supabase Storage URLs
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)

-- MONEY OUT: what the shop's profits (and direct supporters) paid for
bills_paid (
  id uuid pk default gen_random_uuid(),
  paid_on date not null,
  context text,                 -- 'Batata — dental extraction' or 'Kwagga — 20kg food'
  cat_ref text,                 -- optional link to a listed cat; null for street cats/general
  clinic text,                  -- clinic/vendor name (nullable for supplies)
  amount_aed numeric not null,
  amount_covered_aed numeric,   -- optional, for partly-covered bills (drives progress bar)
  receipt_url text,             -- Supabase Storage — the public receipt/photo
  source text check (source in ('shop','supporter')),
  note text
)

-- MONEY IN: what sold (hand-entered now; can auto-populate from a store later)
shop_ledger (
  id uuid pk default gen_random_uuid(),
  sold_on date not null,
  item text not null,           -- 'The ear-tipped tote'
  qty int default 1,
  amount_aed numeric not null,  -- total for the row (qty × price)
  benefit text,                 -- '→ food runs for rescuers'
  note text
)

shop_signups ( id uuid pk, email text unique, created_at timestamptz default now() )
```

Totals for `/transparency` are computed at read time: `sum(shop_ledger.amount_aed)` = in, `sum(bills_paid.amount_aed where source='shop')` = out from shop, gap = in − out. Supporter-paid bills (`source='supporter'`) show in Money-out but are excluded from the shop gap math (they weren't shop money).

RLS: public read on `cats`, `rescuers` (hide `auth_user_id`), `bills_paid`, `shop_ledger`. Rescuers update only rows where `auth_user_id = auth.uid()`. `bills_paid` and `shop_ledger` writes: service role only (you add rows via an admin script or the Supabase table editor for now — no public write).

## OG / sharing (launch requirement, not polish)

Every `/cats/[ref]` page must render correct Open Graph + Twitter tags: cat photo as `og:image` (1200×630 crop), title `{name} — {status line} · tipped`, description = first ~150 chars of story. WhatsApp/Instagram share previews are the distribution model. Use Next `generateMetadata`. Add a dynamic OG image route (`next/og`) with the monogram + cat photo if no photo exists.

## UI patterns (from the homepage design)

- **Surfaces:** page bg Paper `#FBF7F0`; cards white, radius 18–20px, shadow `0 1px 3px rgba(58,42,34,.08)`. Photos are 18–20px rounded rects (no arches). Max two bg colors per page (Paper/Cream + Cocoa).
- **Buttons (rounded squares, 10–12px radius, small CTAs 9px, Quicksand 700):** primary = Cocoa fill / Cream text; secondary = 1.5px Cocoa-30% outline; on dark sections = Sunset fill / Cocoa text.
- **Links:** `#B5643A`, hover `#8F4C2B`.
- **Eyebrow labels:** Quicksand 700, 12.5px, .16em tracking, `#B5643A`.
- **ear-tipped badge:** tipped-ear SVG + "ear-tipped" text, `#C4525C` on 16%-opacity Tip pink, 7px-radius tag. Marks every fixed cat — appears on every cat card.
- **Receipt card:** off-white `#FFFDF8`, dashed dividers, slight `rotate(-1deg)`, numbers in ui-monospace; progress bar Sunset on Cream (covered vs. to-go).
- **Dark sections:** Cocoa bg, Cream type at 60–75% opacity for body.

## Component notes

- `<TippedLogo size inverted />` and `<TippedMonogram size shape="circle|square" />` per geometry above
- `<CatCard />`: photo w/ big radius (fallback: monogram on sunset/pink gradient by sex), ear-tipped badge, name, "sex · age · area" meta, story in rescuer's voice (3-line clamp), "with {Rescuer} · {@handle}", `<EmailRescuerButton>`
- `<VetBillModule />`: the Cocoa-section receipt card — clinic + bill #, cat + treatment, AED covered / AED to-go, Sunset progress bar, "Pay the clinic directly" button, caption "Goes to the clinic's own account. tipped never touches it."
- `<TransparencyLedger />`: renders the two-ledger `/transparency` page — the three totals + honesty line at top, then Money-in and Money-out columns of receipt-cards. Reads `shop_ledger` + `bills_paid` via the data adapter; degrades gracefully when sparse ("First bills coming soon — the shop just opened").
- `<EmailRescuerButton />`: builds the mailto per Hard rule 2; label "Email {RescuerFirstName}"
- `<EarTippedBadge />`: reused on every cat
- Status tags (7px radius): available = sunset bg/cocoa text "LOOKING FOR A HOME"; pending = tip-pink bg "ADOPTION PENDING"; adopted = cocoa bg/cream text "ADOPTED"

## Seed content (from the homepage design — use as the example cats)

Three cats are written in the warm voice (2026-07-22 rewrite); use them for the seed (rescuers marked `is_placeholder: true` until they consent):
- **Karak** — cat · male · 2 yrs · Dubai. "Karak was rescued from behind a cafeteria in Deira, where staff had been feeding him for months. He's affectionate and talkative, comes when called, and is gentle with children. Neutered, vaccinated and ready for a family of his own."
- **Mango** — cat · female · 3 yrs · Dubai. "Mango raised three kittens under a parked truck before she was rescued. All three have found homes, and now it's her turn. She's calm, sweet-natured, and settles quickly — she'd suit a quiet home where she can finally rest."
- **Batata** — cat · male · 4 yrs · Dubai. "Batata spent years surviving on the streets of Satwa and lost part of his tail along the way. It never dimmed his spirit — he's cheerful, food-motivated, and loves company. He's looking for a warm lap and a steady routine." Vet-bill example: Modern Vet, Umm Suqeim · Bill #04211 · dental extraction AED 840 (AED 520 covered, AED 320 to go).

Two real cat photos are in the handoff bundle's `uploads/` (a ginger and a tabby) — usable as hero/listing imagery. Footer rescuer credits list: Dubai Street Kitties, @straycatdubai, @kevinofdxb, Save Dubai Stray Cats, @straycatsdxb, @furrballs_cats, Nine Lives, Meow Meow Rescue, Bin Kitty Collective, @bubbles.petsrescue — **display only after consent**; until then keep behind the placeholder flag.

Shop products (homepage): "The ear-tipped tote" AED 95 → food runs for rescuers · "Street graduate wet bag" AED 120 → medicine & supplies · "'Street graduate' collar tag" AED 45 → vet bills.

## Selling model (v1 decision)

The site does **not** process payments at launch. Taking money in the UAE requires a trade license (Dubai eTrader is the light path); until that + a hosted store are in place, products are sold manually — order via Instagram DM (@tipped.ae) or `hello@tipped.ae`, invoiced by payment link / bank transfer. `/shop` is a catalog with an "order via Instagram/email" CTA, not a checkout.

Critically, the **transparency page is decoupled from selling**: it just displays two hand-maintained tables (`shop_ledger` in, `bills_paid` out), refreshed **weekly** (the site promises this cadence — hold to it). This works identically whether sales happen by DM today or through Shopify later — so full transparency ships in Phase 1 regardless of how checkout evolves. When a hosted store arrives, `shop_ledger` rows can be auto-populated from it, but nothing about the page needs to change.

## Phase plan

- **Phase 1 (launch):** the cats site + `/transparency` (two ledgers, hand-entered) + `/shop` as catalog with order-by-Instagram/email. Seeded with placeholder rescuers + the 3 written cats once 2–3 rescuers confirm. Domain live, OG verified in WhatsApp.
- **Phase 2:** eTrader license, then a hosted store (Shopify or Zid/Salla with a UAE payment provider — Telr/Ziina/Stripe/Tabby) at `shop.tipped.ae`; `shop_ledger` can auto-populate from store payouts. Product photos, more SKUs.
- **Phase 3:** rescuer self-signup with admin approval, Arabic language pass, per-cat share images with story text baked in.
- **Content (ongoing from 2026-07-22):** the `/advice` blog launched with 6 UAE-specific care posts; new posts are just `.mdx` files dropped into `content/advice/` + an SVG cover in `public/advice/` — no deploy config, no database.

## Env vars
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only), `NEXT_PUBLIC_SITE_URL`.

## Scope change — cats & dogs (2026-07-18, session 2)

The platform now covers **both cats and dogs**. Where this file says "cats", read "cats & dogs" unless it's about the ear-tip itself. Decisions made:

- **Data model:** the `cats` table is now `animals` with a `species text check (species in ('cat','dog'))` column; `bills_paid.cat_ref` is now `animal_ref`. (Migration 0001 was rewritten in place — it had never been applied.)
- **Routes:** listings live at `/adopt` and `/adopt/[ref]`; `/cats` and `/cats/:ref` 301-redirect there. Public photos moved to `public/animals/` (the redirect would have swallowed `/cats/*.jpg`).
- **Brand:** the name, wordmark, ears and cat-head monogram are unchanged — the ear-tip story stays the brand anchor. Cats keep the `ear-tipped` badge; dogs get a paw-marked `fixed & vetted` badge (`components/VettedBadge.tsx` picks by species — dogs are never labeled ear-tipped). Dog listings without photos fall back to a `DogHead` mark in the same visual language (floppy Sunset/Tip-pink ears, in `TippedMonogram.tsx`). `/how-it-works` explains it honestly: "Dogs don't get ear-tipped — theirs is a microchip and a collar tag."
- **Seed:** two placeholder dogs (Chapati DXB-004, Simsim DXB-005) with placeholder dog-rescuer Noor (Al Warqa). Homepage features 2 cats + 1 dog.
- **Resolved (2026-07-19):** domain is `tipped.ae`, Instagram is `@tipped.ae` (secured). `lib/brand.ts` carries `CONTACT_EMAIL`, `INSTAGRAM_HANDLE`, `INSTAGRAM_URL`.

## Adopt & foster (2026-07-18, session 2 addendum)

Animals carry `for_adoption` / `for_foster` (any combination) and `in_foster` (orthogonal to `status` — a fostered animal is usually still available). Adoption is worldwide; **fostering is UAE-local** and the foster email template says so. The email popover offers one mailto per open intent; foster-only listings get a "Foster {name}" button. `/adopt?intent=foster` deep-links the foster filter. Nav reads "Adopt & foster". No foster forms, no matching — Hard rule 2 applies to both intents.

## Emirates + health tags (2026-07-18, session 3)

**UAE-wide.** Areas are the 7 emirates only (fixed vocabulary in `lib/emirates.ts`; no neighborhoods outside story text). Refs use the **full emirate name**, sequential per emirate: `DUBAI-001`, `AJMAN-001`, `UMM-AL-QUWAIN-001`. All copy reads "the UAE", not "Dubai".

**Step 1 (2026-07-21) — trust & approval model.** Statuses are now the 3-value enum `available | in_foster | adopted` (display: "Looking for a home" / "In foster" / "Adopted"; the old `pending` status and `in_foster` boolean are gone — for_adoption/for_foster intents remain separate). Medical: `medical_checks text[]` (spayed_neutered, vaccinated, dewormed, flea_treated, fiv_tested, felv_tested, blood_panel, dental_done, ear_tipped, passport_ready, fit_to_fly) + `medical_other text`; `ear_tipped boolean` is its own column and drives the brand badge. `microchip_number` and `vet_certificate_url` are NOT NULL. **Approval workflow:** `approval_status` (pending/approved/changes_requested/rejected, independent of adoption status) + `approval_note`; the public site shows only approved animals of active rescuers (enforced by RLS, not client code). Rescuers carry `trust_level` (trusted = new posts auto-approve; review = pending), `active`, `role` (rescuer/admin), and `wishlist_links jsonb` ([{label,url}]). `audit_log` records approvals/rejections/deletes/trust changes via triggers (admin-read-only); `animal_stats` counts profile views + email-button taps via the `bump_animal_stat` RPC. `npm run lint` (ESLint, next/core-web-vitals) and `npm run build` must both pass.

**Step 2 (2026-07-21) — admin console.** `/admin` (+ `/admin/rescuers`, `/admin/animals`, `/admin/ledger`, `/admin/signups`), gated to `role='admin'` by `useAdmin()` in `components/admin/AdminShell.tsx` (non-admins are bounced to /dashboard; marketing Header/Footer null themselves on /admin* too). Approvals: full-preview queue (photos, story, checks, chip, signed vet-cert URL) with Approve / Request changes + note / Reject, a pending-count badge in the sidebar, and an empty state. Rescuers: invite flow via the `inviteRescuer` server action (`app/admin/actions.ts` — verifies the caller's token is an admin, creates the auth user with `generateLink({type:"invite"})`, upserts the rescuer row, returns an emailable one-time link; **no email is sent automatically** — the UI offers a prefilled mailto), trust toggle (audited), consent flag (`is_placeholder`), edit modal, deactivate (= `active=false`, unpublishes via RLS, never deletes). All animals: search + species/emirate/status/rescuer filters, Edit (reuses `/dashboard/new?edit=` — admins may edit anyone's animal; ownership is preserved on update), Publish/Unpublish via `approval_status`, and homepage-featured stars (max 3, client-guarded). Ledger: Money in / Money out tabs matching the public Open-books shape, phone-friendly add forms, receipt upload to the public `receipts` bucket, and a single featured bill (star = clears others) that fronts the homepage receipt module; featured animals front the homepage cards the same way (`featured boolean` on `animals` + `bills_paid`, migration 0005). Signups: list + client-side CSV download. Homepage falls back to the species-mix / first-open-bill logic when nothing is featured.

**Pets rename + Step 4 public pages (2026-07-21, session 8).** The platform vocabulary is **pets** (Vanessa's revised brief: "rename cats to pets, not animals"). Migration 0007 (applied): `animals` → `pets`, `animal_stats` → `pet_stats` (`pet_id`), `bills_paid.animal_ref` → `pet_ref`, `rescuers.cats_saved` → `pets_saved`; plpgsql bodies recreated under pet names (`assign_pet_ref`, `bump_pet_stat`, `log_pet_approval_change`, `log_pet_delete`) because function bodies resolve table names at execution; new audit rows write `target_type='pet'` while history keeps `'animal'`; policy names still say `animals_*` (cosmetic only). Routes: `/pets` + `/pets/[ref]` are canonical; `/cats`, `/cats/:ref`, `/adopt`, `/adopt/:ref` all 301 there; **static photos deliberately stay under `public/animals/`** (a `/pets/...` file path would sit in redirect/route shadow — same landmine as the original `/cats` one). Admin lives at `/admin/pets`; dashboard copy per brief ("My Pets", "Add a pet", empty state "No pets yet — add your first rescue."). Step 4: `/adopted` (celebratory grid of status-adopted pets, empty-state safe), public rescuer profiles at `/rescuers/[username]` (their pets, wishlist links under "Send supplies directly", clinic links, and the guard line "money never moves through tipped, and never to private accounts"), microchip number shown on pet profiles (hidden for `PENDING-*` backfill stubs), `getRescuers` now selects `username` + `wishlist_links`. Homepage stays deliberately cat-led per the brief. TS identifiers renamed in step (`Pet`, `PetCard`, `getPets`, `bump_pet_stat`).

**"Vetted" is banned** — too vague. The health-tag system replaces it (`lib/health.ts` is the source of truth):
- Basics (Cream pills): `sterilised`, `vaccinated`, `microchipped`, `tested FIV/FeLV −`, `tested heartworm −`. No test → no tag; we don't claim what we don't know.
- Conditions (Sunset pills, never red): `FIV +`, `FeLV +`, `heartworm +`, `heartworm — in treatment`, `special needs`, `chronic condition`.
- **"Vaccinated" means precisely**: up to date on UAE municipal registration requirements — rabies annually + core combo (FVRCP cats / DHPPi/L dogs). Definition in `VACCINATED_DEFINITION`, explained on /how-it-works.
- **FIV/FeLV/heartworm conditions auto-add a plain-language care explainer** to the profile (`CONDITION_NOTES`). Never remove this — it's a Vanessa rule.
- Cards: identity badge (ear-tip / paw "sterilised") + condition tags only. Profiles: full row under HEALTH.
- **Future rescuer dashboard must expose the full tag vocabulary as multi-select** — as much information as the rescuer can give (Vanessa's rule). Extend slugs in `lib/health.ts`, nowhere else.

## Implementation status

Session logs live in `docs/sessions/` — read the latest before starting work. As of session 2 (2026-07-18): all public v1 routes are built and render from a seed-data fallback in `lib/seed.ts`; `lib/data.ts` switches to Supabase automatically once the env vars above are set. **Supabase is live**: project ref `dnhcjfaariprtntxuowp` (created by Vanessa, 2026-07-20), migration 0001 + `supabase/seed.sql` applied via the Management API query endpoint (`POST /v1/projects/{ref}/database/query` with a user-provided `sbp_` access token — the CLI's `db push` path needs the DB password, which we don't hold). Local `.env.local` (git-ignored) holds URL + anon + service keys; the site reads the DB (round-trip verified). Migrations 0001–0006 are applied. Access tokens are per-session: ask Vanessa for a fresh `sbp_` token when DDL is needed, and remind her to revoke it after (she does). **Call the Management API with `curl`, not Python urllib** — Cloudflare started 1010-blocking urllib's signature mid-2026-07-21, and the resulting bare 403 masquerades as a revoked token; read the error body before concluding anything about auth. `/dashboard` is the **designed rescuer dashboard as a front-end demo** (session 5 — local state, Silvana's demo data, no auth/persistence; marketing Header/Footer null themselves on /dashboard*). The design introduces schema deltas (species `other`, in-foster-as-status, public Adopted page, expanded medical vocabulary, required microchip + vet certificate, rescuer wishlists) — see docs/sessions/5-rescuer-dashboard.md before wiring Supabase; do not silently diverge from lib/types. Footer rescuer credits are gated behind `SHOW_RESCUER_CREDITS` in `components/Footer.tsx` (Hard rule 5). The shop's Instagram URL carries a TODO — confirm the handle before launch.

**Voice pass (2026-07-22, session 13).** Vanessa supplied a rewritten CLAUDE.md carrying the new warm voice (rule 4 above), new hero/homepage copy direction, the retitled tagline, and warm-voice seed stories — all applied across every user-facing surface and the seed data (files + live placeholder rows). Her paste was based on a pre-July-19 copy of this file, so four accidental regressions in it were NOT applied, per her "layout unchanged" rider and her own later decisions: (1) domain stays `tipped.ae` / interim Gmail routing — not `hello@tipped.cat`; (2) shape language stays rounded-squares-only — not pills/circles; (3) the shop line stays "100% of profit pays vet bills, updated weekly" — not the older food/medicine/supplies framing; (4) "vetted" stays banned — the paste's footer line was reworded without it. Flagged to her in chat the same day.

**Tips & Advice blog (2026-07-22, session 14).** `/advice` + `/advice/[slug]`, MDX via `next-mdx-remote/rsc` + `gray-matter` (`lib/advice.ts` is the loader; posts sorted by date, related = same category first). Launched with 6 posts written in the warm voice, dated 2026-06-26 → 2026-07-19 so the section doesn't look filled in one day: community cats in summer, heatstroke signs, hot pavement (7-second test), cats under cars, winter shelters, and TNR/the ear-tip. Medical content stays at signs-and-first-steps — the answer to an emergency is always "get to a vet now"; no dosages or protocols, ever. Covers: generated branded SVGs in `public/advice/` — **route-shadow check done**: no redirect touches `/advice`, and static `/advice/*.svg` files serve correctly alongside the dynamic `/advice/[slug]` route (filesystem wins; verified with curl). OG images are per-post PNGs from the dynamic `opengraph-image.tsx` (SVG og:images don't preview in WhatsApp). Nav: dropdown row "Tips & advice" + desktop bar link (lg+) + footer link. The brief referenced an approved reference post for tone; none exists in the repo — the brief's own structural spec (short intro, sub-headed sections, bolded lead-ins, "know the danger signs", italic closing with one gentle action) was used as the reference, and all six posts follow it.

**Admin identity (2026-07-21, session 7):** Vanessa's login is the auth user `vbarbiero0@gmail.com`, linked to the admin rescuer row **Vanessa / @vanessa** (`is_placeholder=false`). The old Silvana/@straycatdubai auth user was deleted at her request and the row rebranded — the seed files (`lib/seed.ts`, `supabase/seed.sql`) still carry the Silvana persona, so **do not re-run the rescuer seed against the live DB** without reconciling usernames first (it would resurrect @straycatdubai as a second row). Usernames must be stored lowercase — `get_rescuer_email` lowercases input against the stored value verbatim.
