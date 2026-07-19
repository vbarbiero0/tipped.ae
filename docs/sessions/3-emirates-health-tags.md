# Session 3 — Emirates, health tags, vetted removed (2026-07-18)

Vanessa's calls from the tag/area discussion, all implemented:

## Areas → the 7 emirates, UAE-wide

- `area` (freeform neighborhood) replaced by `emirate` on animals + rescuers — fixed vocabulary in `lib/emirates.ts`, CHECK constraints in the migration. Neighborhoods live on only in story text.
- **Refs use the full emirate name** (her call: "I want the full name"): `DUBAI-001`, `AJMAN-001`, `SHARJAH-001`, hyphenated for multi-word (`UMM-AL-QUWAIN-001`). Migration trigger generates per-emirate sequences.
- Copy swept UAE-wide: metadata, hero eyebrow ("THE UAE'S STREET CATS & DOGS"), footer ("United Arab Emirates · every animal here is sterilised, vaccinated and known by name"), rescuers, shop, OG cards. /adopt filter is now an emirate select (all 7 listed).

## Health tags (replacing "vetted" everywhere)

- **"Vetted" is gone** — too vague, per Vanessa. No badge, copy, or section uses it.
- **"Vaccinated" now has a researched, precise definition**: up to date on what UAE municipalities require for pet registration — rabies annually + the core combo (flu/enteritis a.k.a. FVRCP for cats, DHPPi/L for dogs). Encoded in `lib/health.ts` (`VACCINATED_DEFINITION`), shown in the /how-it-works "What the tags mean" block.
- Two tag families (`components/HealthTags.tsx`):
  - *Basics* — quiet Cream pills: sterilised, vaccinated, microchipped, tested FIV/FeLV −, tested heartworm −. Tested is its own claim: no test → no tag.
  - *Conditions* — Sunset-tinted pills, never alarm-red: FIV +, FeLV +, heartworm +, heartworm — in treatment, special needs, chronic condition.
- **Cards** show one identity badge (ear-tip for cats / paw "sterilised" for dogs) + condition tags only. **Profiles** show the full row under HEALTH + the rescuer's medical text.
- **Auto condition notes** (Vanessa's rule #5): FIV/FeLV/heartworm conditions auto-add a plain-language explainer card to the profile ("FIV, plainly. …can't pass to humans or dogs… deep bite, not shared bowls…"). special_needs/chronic defer to the rescuer's medical text. See `CONDITION_NOTES` in `lib/health.ts`.
- New seed cat **Loomi** (AJMAN-001, FIV+, "entirely unbothered") demos the whole pipeline; Karak demos a missing basic (not yet microchipped → no tag, medical text says chip is booked); Simsim moved to Sharjah.

## For the future rescuer dashboard

Vanessa's rule #4: the dashboard must expose the full tag vocabulary as multi-select options — as much information as the rescuer can give. The controlled slugs in `lib/health.ts` are the source of truth; extend there.

## Verified

- `tsc` + production build clean. Browser-checked: Loomi profile (tags + FIV explainer), /adopt emirate select (all 7), full-name refs on all cards, UAE copy sweep.

## Addendum — rounded-squares shape language (same day)

Vanessa's brand update: **rounded squares only — no pills, no circles, no arches.** Full sweep applied:
- Buttons: large CTAs (py-15) → 12px radius; medium (py-3/py-10/py-11, incl. nav CTA + popover mailto buttons) → 10px; small (filters, card Email buttons, Copy) → 9px (Copy 8px).
- Badges/tags (ear-tipped, paw, health basics + conditions, status, foster, EXAMPLE PROFILE): 7px.
- Photos: hero + profile arch (`240px 240px 28px 28px`) → 20px rects; brand ears still peek over the flat top edge.
- Progress bars: 4px (bar + fill) — receipt card + transparency.
- `TippedMonogram`: circle option removed — always a Cocoa ~27%-radius tile (favicon already matched).
- Inputs/selects (shop signup, emirate filter, popover copy row): 9–10px.
- CLAUDE.md brand sections rewritten to match (Shape language, UI patterns, monogram scales) — the handoff HTML remains pill-era; CLAUDE.md wins.
- Zero `rounded-full` / `999px` / circle-avatar left in app/ or components/ (grep-verified); build + types clean; homepage/browse verified in browser.

## Open → resolved (2026-07-19)

- **Domain: `tipped.ae`** (Vanessa's decision). Contact is `hello@tipped.ae`; placeholder rescuer emails moved to `@tipped.ae`; `.env.example` site URL updated.
- **Instagram: `@tipped.ae`** — handle secured by Vanessa. `INSTAGRAM_HANDLE` / `INSTAGRAM_URL` in `lib/brand.ts`; shop CTA + new footer link use them.
- First commit made 2026-07-19 and pushed to github.com/vbarbiero0/tipped.ae (covers sessions 1–3).
